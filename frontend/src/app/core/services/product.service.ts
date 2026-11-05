import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

/**
 * Catálogo respaldado por la API Express/MongoDB.
 * Mantiene una copia reactiva en memoria para que las páginas puedan
 * filtrar y ordenar sin volver a consultar el servidor.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly productsSignal = signal<Product[]>([]);

  readonly products = this.productsSignal.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly featuredProducts = computed(() =>
    this.productsSignal().filter((product) => product.isFeatured)
  );

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => {
        this.productsSignal.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo. Verifica que la API esté en línea.');
        this.loading.set(false);
      },
    });
  }

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find((product) => product.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const tempId = `temp-${Date.now()}`;
    const optimistic: Product = { ...product, id: tempId };

    this.productsSignal.update((list) => [...list, optimistic]);

    this.http.post<Product>(this.apiUrl, product).subscribe({
      next: (created) => {
        this.productsSignal.update((list) =>
          list.map((item) => (item.id === tempId ? created : item))
        );
      },
      error: () => {
        this.productsSignal.update((list) => list.filter((item) => item.id !== tempId));
        this.error.set('No se pudo agregar el producto.');
      },
    });
  }

  updateProduct(id: string, changes: Partial<Omit<Product, 'id'>>): void {
    const previous = this.getProductById(id);
    if (!previous) {
      return;
    }

    this.productsSignal.update((list) =>
      list.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

    this.http.patch<Product>(`${this.apiUrl}/${id}`, changes).subscribe({
      next: (updated) => {
        this.productsSignal.update((list) =>
          list.map((item) => (item.id === id ? updated : item))
        );
      },
      error: () => {
        this.productsSignal.update((list) =>
          list.map((item) => (item.id === id ? previous : item))
        );
        this.error.set('No se pudo actualizar el producto.');
      },
    });
  }

  deleteProduct(id: string): void {
    const snapshot = this.productsSignal();
    this.productsSignal.update((list) => list.filter((item) => item.id !== id));

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      error: () => {
        this.productsSignal.set(snapshot);
        this.error.set('No se pudo eliminar el producto.');
      },
    });
  }
}

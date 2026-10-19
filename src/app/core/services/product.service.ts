import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>([
    {
      id: 'koko-01',
      name: 'Geisha Finca El Paraiso',
      variety: 'Geisha de Altura',
      origin: 'Huila, Colombia',
      altitude: '1,950 msnm',
      process: 'Lavado',
      roastLevel: 'Tueste Claro',
      tastingNotes: ['Jazmin', 'Bergamota', 'Melocoton'],
      scaScore: 89.5,
      price: 24.5,
      originalPrice: 28.0,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop',
      stock: 14,
      isFeatured: true,
      badge: 'Microlote Exclusivo',
      description: 'Cosecha seleccionada a mano. Acidez vivaz con postgusto dulce y persistente.',
    },
    {
      id: 'koko-02',
      name: 'Bourbon Rosado Anaerobico',
      variety: 'Bourbon Rosado',
      origin: 'San Agustin, Colombia',
      altitude: '1,800 msnm',
      process: 'Maceración Carbónica',
      roastLevel: 'Tueste Medio',
      tastingNotes: ['Frambuesa', 'Miel de Maple', 'Cacao Criollo'],
      scaScore: 88.0,
      price: 21.0,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      stock: 22,
      isFeatured: true,
      badge: 'Favorito Baristas',
      description: 'Fermentacion en cereza durante 72 horas bajo atmosfera controlada.',
    },
    {
      id: 'koko-03',
      name: 'Yirgacheffe Heirloom Natural',
      variety: 'Variedades Autoctonas',
      origin: 'Gedeo, Etiopia',
      altitude: '2,100 msnm',
      process: 'Natural',
      roastLevel: 'Tueste Claro',
      tastingNotes: ['Arandano Silvestre', 'Chocolate Negro', 'Cardamomo'],
      scaScore: 88.75,
      price: 22.5,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
      stock: 9,
      isFeatured: true,
      badge: 'Cuna del Cafe',
      description: 'Secado en camas africanas elevadas durante 24 dias.',
    },
    {
      id: 'koko-04',
      name: 'Pacamara Honey Volcan Baru',
      variety: 'Pacamara Gigante',
      origin: 'Boquete, Panama',
      altitude: '1,750 msnm',
      process: 'Honey',
      roastLevel: 'Tueste Medio',
      tastingNotes: ['Papaya', 'Azucar Mascabado', 'Nuez de Macadamia'],
      scaScore: 87.5,
      price: 19.5,
      originalPrice: 23.0,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
      stock: 18,
      isFeatured: true,
      badge: 'Suelo Volcanico',
      description: 'Suelos ricos en ceniza volcanica que otorgan una dulzura acaramelada natural.',
    },
  ]);

  readonly products = this.productsSignal.asReadonly();

  readonly featuredProducts = computed(() =>
    this.productsSignal().filter((p) => p.isFeatured)
  );

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const newProduct: Product = {
      ...product,
      id: 'koko-' + Date.now(),
    };
    this.productsSignal.update((list) => [...list, newProduct]);
  }

  updateProduct(id: string, changes: Partial<Omit<Product, 'id'>>): void {
    this.productsSignal.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  }

  deleteProduct(id: string): void {
    this.productsSignal.update((list) => list.filter((p) => p.id !== id));
  }
}

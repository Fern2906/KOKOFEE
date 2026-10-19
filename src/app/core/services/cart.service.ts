import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([
    {
      product: {
        id: 'koko-01',
        name: 'Geisha Finca El Paraíso',
        variety: 'Geisha 100%',
        origin: 'Huila, Colombia',
        altitude: '1,950 msnm',
        process: 'Lavado',
        roastLevel: 'Tueste Claro',
        tastingNotes: ['Jazmín', 'Bergamota', 'Melocotón'],
        scaScore: 89.5,
        price: 24.5,
        weight: '250g',
        imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
        stock: 12,
        isFeatured: true,
        badge: 'Cosecha Limitada',
        description: 'Perfil floral brillante y acidez cítrica sedosa.',
      },
      quantity: 1,
    },
  ]);

  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  addItem(product: Product, quantity = 1): void {
    this.itemsSignal.update((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...current, { product, quantity }];
    });
  }

  removeItem(productId: string): void {
    this.itemsSignal.update((current) => current.filter((i) => i.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.itemsSignal.update((current) =>
      current.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}

import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

export type { CartItem } from '../models/cart-item.model';

/** Monto mínimo (en USD) para obtener envío gratis. */
export const FREE_SHIPPING_THRESHOLD = 45;

/** Costo de envío estándar cuando no se alcanza el mínimo. */
export const STANDARD_SHIPPING_COST = 4.9;

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

  readonly isEmpty = computed(() => this.itemsSignal().length === 0);

  readonly shippingThreshold = FREE_SHIPPING_THRESHOLD;

  readonly shippingCost = computed(() => {
    const subtotal = this.subtotal();
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    return STANDARD_SHIPPING_COST;
  });

  readonly total = computed(() => this.subtotal() + this.shippingCost());

  /** Cuánto falta para alcanzar el envío gratis (0 si ya se alcanzó). */
  readonly freeShippingRemaining = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - this.subtotal())
  );

  /** Progreso (0-100) hacia el envío gratis. */
  readonly freeShippingProgress = computed(() =>
    Math.min(100, (this.subtotal() / FREE_SHIPPING_THRESHOLD) * 100)
  );

  addItem(product: Product, quantity = 1): void {
    const maxQuantity = Math.max(0, product.stock);
    if (maxQuantity === 0) {
      return;
    }

    this.itemsSignal.update((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(maxQuantity, i.quantity + quantity) }
            : i
        );
      }
      return [...current, { product, quantity: Math.min(maxQuantity, quantity) }];
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
      current.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(quantity, Math.max(0, i.product.stock)) }
          : i
      )
    );
  }

  increment(productId: string): void {
    const item = this.itemsSignal().find((i) => i.product.id === productId);
    if (!item) {
      return;
    }
    this.updateQuantity(productId, item.quantity + 1);
  }

  decrement(productId: string): void {
    const item = this.itemsSignal().find((i) => i.product.id === productId);
    if (!item) {
      return;
    }
    this.updateQuantity(productId, item.quantity - 1);
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}

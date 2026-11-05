import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButton, NbCallout, NbChip, NbDisplay, NbProgress, NbStatusDot,
  NbSticker, NbStickerFace, NbSurface, NbText,
} from '@ng-brutalism/ui';
import {
  LucideAngularModule,
  ArrowLeft, ArrowRight, CreditCard, Leaf, Receipt,
  ShieldCheck, ShoppingBag, Sparkles, Trash2, Truck,
} from 'lucide-angular';

import { NavbarComponent } from '../../layouts/public-layout/navbar/navbar';
import { FooterComponent } from '../../layouts/public-layout/footer/footer';
import { CartItemComponent } from '../../shared/components/cart-item/cart-item';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    RouterLink,
    NbButton, NbCallout, NbChip, NbDisplay, NbProgress, NbStatusDot,
    NbSticker, NbStickerFace, NbSurface, NbText,
    LucideAngularModule,
    NavbarComponent, FooterComponent,
    CartItemComponent, EmptyStateComponent, ConfirmDialogComponent,
  ],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPageComponent {
  readonly cartService = inject(CartService);

  readonly confirmClearOpen = signal(false);
  readonly checkoutNotice = signal(false);

  readonly icons = {
    ArrowLeft, ArrowRight, CreditCard, Leaf, Receipt,
    ShieldCheck, ShoppingBag, Sparkles, Trash2, Truck,
  };

  readonly freeShippingMessage = computed(() => {
    const remaining = this.cartService.freeShippingRemaining();
    if (remaining <= 0) {
      return '¡Envío gratis desbloqueado!';
    }
    return `Te faltan $${remaining.toFixed(2)} para el envío gratis`;
  });

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
    this.checkoutNotice.set(false);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
    this.checkoutNotice.set(false);
  }

  requestClearCart(): void {
    this.confirmClearOpen.set(true);
  }

  confirmClearCart(): void {
    this.cartService.clear();
    this.confirmClearOpen.set(false);
    this.checkoutNotice.set(false);
  }

  cancelClearCart(): void {
    this.confirmClearOpen.set(false);
  }

  onCheckout(): void {
    this.checkoutNotice.set(true);
  }
}

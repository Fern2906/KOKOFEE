import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButton, NbChip, NbIcon, NbMediaFrame, NbSticker, NbCard, NbCardFooter, NbCardContent, NbCardHeader } from '@ng-brutalism/ui';
import { LucideAngularModule, ShoppingCart, Star, MapPin, ArrowRight, Check} from 'lucide-angular';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    NbMediaFrame,
    NbChip,
    NbButton,
    NbSticker,
    LucideAngularModule,
    NbCard,
    NbCardFooter,
    NbCardContent,
    NbCardHeader
],
  templateUrl: './product-card.html'
})


export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  readonly icons = {
    cart: ShoppingCart,
    star: Star,
    pin: MapPin,
    arrow: ArrowRight,
    check: Check
  };

  protected readonly added = signal(false);

  handleAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1800);
  }
}

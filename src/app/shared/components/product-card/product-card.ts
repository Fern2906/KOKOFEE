import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbBadge, NbButton, NbCard, NbCardContent, NbCardFooter, NbCardHeader, NbChip, NbIcon, NbMediaFrame, NbMediaItem, NbSticker } from '@ng-brutalism/ui';
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
    NbIcon
],
  templateUrl: './product-card.html'
})


export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  protected readonly added = signal(false);

  handleAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1800);
  }
}

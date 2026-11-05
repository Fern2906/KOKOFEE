import { Component, computed, input, output } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card';

type ProductGridColumns = 2 | 3 | 4;

/**
 * Rejilla reutilizable de productos. Centraliza el layout responsive y
 * reenvía el evento de "agregar al carrito" a la página que la use.
 */
@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <div [class]="gridClass()">
      @for (product of products(); track product.id) {
        <app-product-card [product]="product" (addToCart)="addToCart.emit($event)" />
      }
    </div>
  `,
})
export class ProductGridComponent {
  readonly products = input.required<Product[]>();
  readonly columns = input<ProductGridColumns>(3);

  readonly addToCart = output<Product>();

  private readonly columnClasses: Record<ProductGridColumns, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  readonly gridClass = computed(
    () => `grid grid-cols-1 gap-6 ${this.columnClasses[this.columns()]}`
  );
}

import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbBadge,
  NbButton,
  NbCard,
  NbCardContent,
  NbCardFooter,
  NbCardHeader,
  NbChip,
  NbMediaFrame,
} from '@ng-brutalism/ui';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    NbCard,
    NbCardHeader,
    NbCardContent,
    NbCardFooter,
    NbMediaFrame,
    NbBadge,
    NbChip,
    NbButton,
  ],
  template: `
    <nb-card
      class="group relative flex flex-col h-full bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0px_#1A120B]"
    >
      <!-- Media Frame with Product Image & Badges -->
      <div class="relative overflow-hidden border-b-2 border-koko-espresso bg-koko-cream">
        <div nbMediaFrame ratio="4/3">
          <img
            [src]="product().imageUrl"
            [alt]="product().name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <!-- Top Badges -->
        <div class="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          @if (product().badge) {
            <span nbBadge tone="primary" class="font-bold text-xs uppercase tracking-wide">
              {{ product().badge }}
            </span>
          } @else {
            <span nbBadge tone="cream" class="font-medium text-xs">
              {{ product().process }}
            </span>
          }

          <!-- SCA Score Badge -->
          <div
            class="flex items-center gap-1 bg-koko-espresso text-white px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-white/20 shadow-sm"
            title="Puntuación de cata de la Specialty Coffee Association"
          >
            <span class="text-koko-gold">★</span>
            <span>SCA {{ product().scaScore }}</span>
          </div>
        </div>

        <!-- Origin and Altitude Floating Pill -->
        <div class="absolute bottom-2.5 left-3 bg-koko-espresso/80 backdrop-blur-sm text-koko-cream px-2 py-0.5 rounded text-[11px] font-mono">
          📍 {{ product().origin }} · {{ product().altitude }}
        </div>
      </div>

      <!-- Card Body Content -->
      <nb-card-header class="p-4 pb-2">
        <div class="flex items-center justify-between text-xs text-koko-muted font-medium mb-1">
          <span>{{ product().variety }}</span>
          <span class="font-mono text-koko-espresso font-semibold">{{ product().weight }}</span>
        </div>
        <h3 class="font-display text-lg font-bold text-koko-espresso group-hover:text-koko-caramel transition-colors line-clamp-1">
          {{ product().name }}
        </h3>
      </nb-card-header>

      <nb-card-content class="p-4 pt-0 flex-1 flex flex-col justify-between">
        <p class="text-xs text-koko-coffee/80 line-clamp-2 mb-3">
          {{ product().description }}
        </p>

        <!-- Tasting Notes Chips -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          @for (note of product().tastingNotes; track note) {
            <span nbChip tone="cream" padding="sm" class="text-[11px] font-medium text-koko-roast">
              {{ note }}
            </span>
          }
        </div>
      </nb-card-content>

      <!-- Footer with Price and CTA -->
      <nb-card-footer class="p-4 pt-3 border-t-2 border-koko-espresso/10 bg-koko-cream/50 flex items-center justify-between mt-auto">
        <div>
          <div class="text-[10px] uppercase font-bold text-koko-muted tracking-wider">Precio</div>
          <div class="flex items-baseline gap-1.5">
            <span class="font-mono text-lg font-extrabold text-koko-espresso">
              \${{ product().price.toFixed(2) }}
            </span>
            @if (product().originalPrice) {
              <span class="font-mono text-xs text-koko-muted line-through">
                \${{ product().originalPrice?.toFixed(2) }}
              </span>
            }
          </div>
        </div>

        <button
          nbButton
          [tone]="added() ? 'success' : 'primary'"
          size="sm"
          (click)="handleAddToCart($event)"
          [attr.aria-label]="'Añadir ' + product().name + ' al carrito'"
          class="font-bold flex items-center gap-1.5 transition-transform active:scale-95"
        >
          @if (added()) {
            <span>✓ Añadido</span>
          } @else {
            <span>+ Agregar</span>
          }
        </button>
      </nb-card-footer>
    </nb-card>
  `,
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

import { Component, computed, input, output } from '@angular/core';
import { NbBadge, NbChip, NbChipGroup, NbMediaFrame, NbSurface, NbText } from '@ng-brutalism/ui';
import { LucideAngularModule, Minus, Plus, Trash2 } from 'lucide-angular';
import { CartItem } from '../../../core/models/cart-item.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    NbBadge, NbChip, NbChipGroup, NbMediaFrame, NbSurface, NbText,
    LucideAngularModule,
  ],
  template: `
    <article nbSurface tone="cream" padding="sm" radius="xl" shadow="hard" border="strong"
      class="cart-item grid gap-4 p-3 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-5 sm:p-4">

      <!-- Imagen -->
      <div class="relative mx-auto w-28 shrink-0 sm:mx-0 sm:w-28">
        <div nbMediaFrame ratio="1/1" tone="pink" border="strong" radius="lg" shadow="none">
          <img [src]="item().product.imageUrl" [alt]="item().product.name"
            class="h-full w-full object-cover" loading="lazy" />
        </div>

        @if (item().product.badge) {
          <span nbBadge tone="yellow" radius="sm" border="strong"
            class="absolute -left-2 -top-2 -rotate-6 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
            {{ item().product.badge }}
          </span>
        }
      </div>

      <!-- Detalle -->
      <div class="flex min-w-0 flex-col gap-1.5">
        <span nbText size="xs" weight="black" transform="uppercase" tracking="wide" tone="muted"
          class="font-mono">
          {{ item().product.variety }} · {{ item().product.weight }}
        </span>

        <h3 class="font-display text-base font-black uppercase leading-tight text-(--nb-foreground) sm:text-lg">
          {{ item().product.name }}
        </h3>

        <p class="font-mono text-[11px] font-bold uppercase tracking-wide text-(--nb-foreground)/65">
          {{ item().product.origin }} · {{ item().product.process }} · {{ item().product.roastLevel }}
        </p>

        @if (item().product.tastingNotes.length > 0) {
          <div nbChipGroup gap="xs" radius="sm" class="mt-1 flex-wrap">
            @for (note of item().product.tastingNotes.slice(0, 3); track note) {
              <span nbChip tone="lavender" radius="sm" border="thin"
                class="px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                {{ note }}
              </span>
            }
          </div>
        }

        <span class="mt-1 font-mono text-xs font-bold text-(--nb-foreground)/65">
          \${{ item().product.price.toFixed(2) }} <span class="opacity-60">/ {{ item().product.weight }}</span>
        </span>
      </div>

      <!-- Controles -->
      <div
        class="flex items-center justify-between gap-4 border-t-2 border-dashed border-(--nb-border)/20 pt-3 sm:flex-col sm:items-end sm:border-l-2 sm:border-t-0 sm:pl-5 sm:pt-0">

        <div class="flex flex-col items-start gap-1 sm:items-end">
          <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-(--nb-foreground)/55">
            Total
          </span>
          <span class="font-display text-lg font-black text-(--nb-foreground)">
            \${{ lineTotal().toFixed(2) }}
          </span>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="flex items-stretch border-2 border-(--nb-border) bg-white shadow-[3px_3px_0_#1A120B]"
            role="group" [attr.aria-label]="'Cantidad de ' + item().product.name">
            <button type="button"
              class="grid h-8 w-8 place-items-center border-r-2 border-(--nb-border) transition-colors hover:bg-(--nb-surface) disabled:cursor-not-allowed disabled:opacity-35"
              [disabled]="!canDecrease()" (click)="decrease()" aria-label="Disminuir cantidad">
              <lucide-icon [img]="icons.Minus" [size]="14" [strokeWidth]="3" />
            </button>

            <span class="grid min-w-9 place-items-center px-2 font-mono text-sm font-black"
              aria-live="polite">
              {{ item().quantity }}
            </span>

            <button type="button"
              class="grid h-8 w-8 place-items-center border-l-2 border-(--nb-border) transition-colors hover:bg-(--nb-surface) disabled:cursor-not-allowed disabled:opacity-35"
              [disabled]="!canIncrease()" (click)="increase()" aria-label="Aumentar cantidad">
              <lucide-icon [img]="icons.Plus" [size]="14" [strokeWidth]="3" />
            </button>
          </div>

          <button type="button"
            class="inline-flex items-center gap-1 border-b-2 border-transparent font-mono text-[10px] font-black uppercase tracking-widest text-(--nb-danger) transition-colors hover:border-(--nb-danger)"
            (click)="remove.emit()" [attr.aria-label]="'Eliminar ' + item().product.name + ' del carrito'">
            <lucide-icon [img]="icons.Trash2" [size]="12" [strokeWidth]="3" />
            Quitar
          </button>
        </div>
      </div>
    </article>
  `,
  styles: `
    .cart-item {
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .cart-item:hover {
      transform: translate(-2px, -2px);
    }

    @media (prefers-reduced-motion: reduce) {
      .cart-item {
        transition: none;
      }

      .cart-item:hover {
        transform: none;
      }
    }
  `,
})
export class CartItemComponent {
  readonly item = input.required<CartItem>();

  readonly quantityChange = output<number>();
  readonly remove = output<void>();

  protected readonly icons = { Minus, Plus, Trash2 };

  readonly lineTotal = computed(
    () => this.item().product.price * this.item().quantity
  );

  readonly canDecrease = computed(() => this.item().quantity > 1);

  readonly canIncrease = computed(
    () => this.item().quantity < Math.max(0, this.item().product.stock)
  );

  decrease(): void {
    if (!this.canDecrease()) {
      return;
    }
    this.quantityChange.emit(this.item().quantity - 1);
  }

  increase(): void {
    if (!this.canIncrease()) {
      return;
    }
    this.quantityChange.emit(this.item().quantity + 1);
  }
}

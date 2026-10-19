import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbAvatar,
  NbBadge,
  NbCard,
  NbCardContent,
  NbCardHeader,
  NbRating,
} from '@ng-brutalism/ui';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [
    CommonModule,
    NbCard,
    NbCardHeader,
    NbCardContent,
    NbAvatar,
    NbRating,
    NbBadge,
  ],
  template: `
    <nb-card
      class="flex flex-col h-full bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0px_#1A120B]"
    >
      <nb-card-header class="p-5 pb-3">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            @if (review().avatarUrl) {
              <nb-avatar
                [src]="review().avatarUrl"
                [alt]="review().authorName"
                class="w-11 h-11 shrink-0"
              />
            } @else {
              <div class="w-11 h-11 rounded-full bg-koko-roast text-koko-cream flex items-center justify-center font-bold font-mono text-sm border-2 border-koko-espresso">
                {{ review().authorName.charAt(0) }}
              </div>
            }

            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-display font-bold text-sm text-koko-espresso">
                  {{ review().authorName }}
                </h4>
                @if (review().verifiedPurchase) {
                  <span
                    nbBadge
                    tone="success"
                    class="text-[10px] py-0 px-1.5 font-bold uppercase"
                    title="Compra verificada en la tostaduría"
                  >
                    ✓ Verificada
                  </span>
                }
              </div>
              <p class="text-xs text-koko-muted line-clamp-1">
                {{ review().authorRole }}
              </p>
            </div>
          </div>

          <span class="text-[11px] font-mono text-koko-muted whitespace-nowrap">
            {{ review().date }}
          </span>
        </div>
      </nb-card-header>

      <nb-card-content class="p-5 pt-0 flex-1 flex flex-col justify-between">
        <div class="mb-3">
          <nb-rating [value]="review().rating" [max]="5" class="text-koko-caramel" />
        </div>

        <p class="text-xs text-koko-coffee/90 leading-relaxed italic mb-4">
          “{{ review().comment }}”
        </p>

        <div class="mt-auto pt-3 border-t border-koko-border-subtle flex items-center justify-between text-[11px] text-koko-muted font-mono">
          <span>Café reseñado:</span>
          <span class="font-semibold text-koko-espresso">{{ review().productName }}</span>
        </div>
      </nb-card-content>
    </nb-card>
  `,
})
export class ReviewCardComponent {
  readonly review = input.required<Review>();
}

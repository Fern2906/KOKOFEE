import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAvatar, NbBadge, NbCard, NbCardContent, NbCardHeader, NbRating, NbSticker, NbStickerFace, NbChip } from '@ng-brutalism/ui';
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
    NbChip
],
  templateUrl: './review-card.html'
})
export class ReviewCardComponent {
  readonly review = input.required<Review>();
}

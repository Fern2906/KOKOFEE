import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButton, NbCard, NbCardContent, NbCardFooter, NbCardHeader, NbMediaFrame, NbSticker, NbStickerFace, NbChip } from '@ng-brutalism/ui';
import { Recipe } from '../../../core/models/recipe.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    CommonModule,
    NbCard,
    NbCardHeader,
    NbCardContent,
    NbCardFooter,
    NbMediaFrame,
    NbButton,
    NbSticker,
    NbStickerFace,
    NbChip,
    LucideAngularModule
  ],
  templateUrl: 'recipe-card.html'
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly viewRecipe = output<Recipe>();
}

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbBadge,
  NbButton,
  NbCard,
  NbCardContent,
  NbCardFooter,
  NbCardHeader,
  NbMediaFrame,
} from '@ng-brutalism/ui';
import { Recipe } from '../../../core/models/recipe.model';

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
    NbBadge,
    NbButton,
  ],
  templateUrl: 'recipe-card.html'
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();
  readonly viewRecipe = output<Recipe>();
}

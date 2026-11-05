import { Component, computed, input, output } from '@angular/core';
import { Recipe } from '../../../core/models/recipe.model';
import { RecipeCardComponent } from '../recipe-card/recipe-card';

type RecipeGridColumns = 2 | 3;

/**
 * Rejilla reutilizable de recetas. Reenvía el evento "ver receta"
 * para que la página controle cómo abrir el detalle.
 */
@Component({
  selector: 'app-recipe-grid',
  standalone: true,
  imports: [RecipeCardComponent],
  template: `
    <div [class]="gridClass()">
      @for (recipe of recipes(); track recipe.id) {
        <app-recipe-card [recipe]="recipe" (viewRecipe)="viewRecipe.emit($event)" />
      }
    </div>
  `,
})
export class RecipeGridComponent {
  readonly recipes = input.required<Recipe[]>();
  readonly columns = input<RecipeGridColumns>(3);

  readonly viewRecipe = output<Recipe>();

  private readonly columnClasses: Record<RecipeGridColumns, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
  };

  readonly gridClass = computed(
    () => `grid grid-cols-1 gap-6 ${this.columnClasses[this.columns()]}`
  );
}

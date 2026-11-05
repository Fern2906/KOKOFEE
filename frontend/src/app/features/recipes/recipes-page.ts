import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButton, NbChip, NbDisplay, NbStatusDot, NbSurface, NbText,
} from '@ng-brutalism/ui';
import {
  LucideAngularModule,
  ArrowRight, BookOpen, ChefHat, Coffee, FlaskConical, Sparkles, Timer, X,
} from 'lucide-angular';

import { NavbarComponent } from '../../layouts/public-layout/navbar/navbar';
import { FooterComponent } from '../../layouts/public-layout/footer/footer';
import { RecipeGridComponent } from '../../shared/components/recipe-grid/recipe-grid';
import { RecipeDetailComponent } from '../../shared/components/recipe-detail/recipe-detail';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import {
  RecipeFilterOption,
  RecipeFiltersComponent,
} from '../../shared/components/recipe-filters/recipe-filters';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe, RECIPE_DIFFICULTIES, RECIPE_METHODS } from '../../core/models/recipe.model';

interface ActiveFilter {
  key: string;
  label: string;
  clear: () => void;
}

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [
    RouterLink,
    NbButton, NbChip, NbDisplay, NbStatusDot, NbSurface, NbText,
    LucideAngularModule,
    NavbarComponent, FooterComponent,
    RecipeGridComponent, RecipeDetailComponent, EmptyStateComponent, RecipeFiltersComponent,
  ],
  templateUrl: './recipes-page.html',
  styleUrl: './recipes-page.css',
})
export class RecipesPageComponent {
  readonly recipeService = inject(RecipeService);

  readonly searchQuery = signal('');
  readonly selectedMethod = signal('all');
  readonly selectedDifficulty = signal('all');
  readonly selectedRecipe = signal<Recipe | null>(null);

  readonly icons = {
    ArrowRight, BookOpen, ChefHat, Coffee, FlaskConical, Sparkles, Timer, X,
  };

  readonly methodOptions = computed<RecipeFilterOption[]>(() => [
    { value: 'all', label: 'Todos los métodos' },
    ...RECIPE_METHODS.map((method) => ({ value: method, label: method })),
  ]);

  readonly difficultyOptions = computed<RecipeFilterOption[]>(() => [
    { value: 'all', label: 'Todas las dificultades' },
    ...RECIPE_DIFFICULTIES.map((difficulty) => ({ value: difficulty, label: difficulty })),
  ]);

  readonly activeFilters = computed<ActiveFilter[]>(() => {
    const filters: ActiveFilter[] = [];
    const query = this.searchQuery().trim();

    if (query) {
      filters.push({
        key: 'search',
        label: `“${query}”`,
        clear: () => this.searchQuery.set(''),
      });
    }

    if (this.selectedMethod() !== 'all') {
      filters.push({
        key: 'method',
        label: this.selectedMethod(),
        clear: () => this.selectedMethod.set('all'),
      });
    }

    if (this.selectedDifficulty() !== 'all') {
      filters.push({
        key: 'difficulty',
        label: this.selectedDifficulty(),
        clear: () => this.selectedDifficulty.set('all'),
      });
    }

    return filters;
  });

  readonly activeFilterCount = computed(() => this.activeFilters().length);

  readonly filteredRecipes = computed(() => {
    const query = this.normalize(this.searchQuery().trim());
    const method = this.selectedMethod();
    const difficulty = this.selectedDifficulty();

    return this.recipeService.recipes().filter((recipe) => {
      const matchesQuery =
        !query ||
        this.normalize(
          [
            recipe.title,
            recipe.description,
            recipe.method,
            recipe.difficulty,
            recipe.recommendedCoffee,
            recipe.grindSize,
            ...recipe.steps,
          ].join(' ')
        ).includes(query);

      return (
        matchesQuery &&
        (method === 'all' || recipe.method === method) &&
        (difficulty === 'all' || recipe.difficulty === difficulty)
      );
    });
  });

  readonly recipeStats = computed(() => {
    const recipes = this.recipeService.recipes();
    return {
      total: recipes.length,
      methods: new Set(recipes.map((r) => r.method)).size,
      steps: recipes.reduce((acc, recipe) => acc + recipe.steps.length, 0),
    };
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onMethodChange(value: string): void {
    this.selectedMethod.set(value || 'all');
  }

  onDifficultyChange(value: string): void {
    this.selectedDifficulty.set(value || 'all');
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedMethod.set('all');
    this.selectedDifficulty.set('all');
  }

  openRecipe(recipe: Recipe): void {
    this.selectedRecipe.set(recipe);
  }

  closeRecipe(): void {
    this.selectedRecipe.set(null);
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}

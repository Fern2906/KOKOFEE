import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Recipe } from '../models/recipe.model';

/**
 * Recetario respaldado por la API Express/MongoDB.
 * La copia reactiva en memoria permite filtrar por método, dificultad
 * y texto sin repetir la consulta en cada interacción.
 */
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/recipes`;
  private readonly recipesSignal = signal<Recipe[]>([]);

  readonly recipes = this.recipesSignal.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Recipe[]>(this.apiUrl).subscribe({
      next: (recipes) => {
        this.recipesSignal.set(recipes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el recetario. Verifica que la API esté en línea.');
        this.loading.set(false);
      },
    });
  }

  addRecipe(data: Omit<Recipe, 'id'>): void {
    const tempId = `temp-${Date.now()}`;
    const optimistic: Recipe = { ...data, id: tempId };

    this.recipesSignal.update((list) => [...list, optimistic]);

    this.http.post<Recipe>(this.apiUrl, data).subscribe({
      next: (created) => {
        this.recipesSignal.update((list) =>
          list.map((item) => (item.id === tempId ? created : item))
        );
      },
      error: () => {
        this.recipesSignal.update((list) => list.filter((item) => item.id !== tempId));
        this.error.set('No se pudo crear la receta.');
      },
    });
  }

  updateRecipe(id: string, data: Omit<Recipe, 'id'>): void {
    const previous = this.recipesSignal().find((recipe) => recipe.id === id);
    if (!previous) {
      return;
    }

    this.recipesSignal.update((list) =>
      list.map((recipe) => (recipe.id === id ? { id, ...data } : recipe))
    );

    this.http.patch<Recipe>(`${this.apiUrl}/${id}`, data).subscribe({
      next: (updated) => {
        this.recipesSignal.update((list) =>
          list.map((recipe) => (recipe.id === id ? updated : recipe))
        );
      },
      error: () => {
        this.recipesSignal.update((list) =>
          list.map((recipe) => (recipe.id === id ? previous : recipe))
        );
        this.error.set('No se pudo actualizar la receta.');
      },
    });
  }

  deleteRecipe(id: string): void {
    const snapshot = this.recipesSignal();
    this.recipesSignal.update((list) => list.filter((recipe) => recipe.id !== id));

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      error: () => {
        this.recipesSignal.set(snapshot);
        this.error.set('No se pudo eliminar la receta.');
      },
    });
  }
}

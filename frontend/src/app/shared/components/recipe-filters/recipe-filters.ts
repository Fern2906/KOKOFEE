import { Component, input, output } from '@angular/core';
import {
  NbChip, NbLabel, NbSelect, NbSelectOption, NbSelectValue, NbSurface,
} from '@ng-brutalism/ui';
import { LucideAngularModule, SlidersHorizontal, X } from 'lucide-angular';
import { SearchboxComponent } from '../searchbox/searchbox';

export interface RecipeFilterOption {
  value: string;
  label: string;
}

/**
 * Barra de filtros del recetario. Es presentacional: recibe los valores
 * actuales y emite los cambios para que la página decida cómo filtrar.
 */
@Component({
  selector: 'app-recipe-filters',
  standalone: true,
  imports: [
    NbChip, NbLabel, NbSelect, NbSelectOption, NbSurface, LucideAngularModule, SearchboxComponent,
  ],
  template: `
    <div nbSurface tone="cream" padding="lg" radius="xl" shadow="hard" border="strong"
      class="flex flex-col gap-4">

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="recipe-filters__icon">
            <lucide-icon [img]="icons.SlidersHorizontal" [size]="16" [strokeWidth]="3" />
          </span>
          <div>
            <h2 class="font-display text-sm font-black uppercase leading-none">Filtrar recetario</h2>
            <p class="mt-1 font-mono text-[9px] font-bold uppercase tracking-widest opacity-60">
              Encuentra tu método de extracción
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          @if (activeCount() > 0) {
            <span nbChip tone="yellow" radius="sm" class="font-mono text-[10px] font-black uppercase">
              {{ activeCount() }} {{ activeCount() === 1 ? 'filtro' : 'filtros' }}
            </span>
            <button type="button" (click)="clear.emit()"
              class="inline-flex items-center gap-1 border-b-2 border-transparent font-mono text-[10px] font-black uppercase tracking-widest transition-colors hover:border-(--nb-border)"
              aria-label="Limpiar todos los filtros">
              <lucide-icon [img]="icons.X" [size]="12" [strokeWidth]="3" />
              Limpiar
            </button>
          }
        </div>
      </div>

      <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem] md:items-end">
        <!-- Búsqueda -->
        <app-searchbox
          id="recipe-search"
          label="Buscar"
          placeholder="Receta, café o método..."
          [value]="search()"
          (searchChange)="searchChange.emit($event)"
          ariaLabel="Buscar recetas"
        />

        <!-- Método -->
        <div class="flex flex-col gap-1.5">
          <label id="recipe-method-label" nbLabel class="text-[10px] font-black uppercase tracking-widest">
            Método
          </label>
          <nb-select [value]="method()" aria-labelledby="recipe-method-label"
            (valueChange)="onSelect(methodChange, $event)">
            @for (option of methodOptions(); track option.value) {
              <nb-select-option [value]="option.value" [label]="option.label">
                {{ option.label }}
              </nb-select-option>
            }
          </nb-select>
        </div>

        <!-- Dificultad -->
        <div class="flex flex-col gap-1.5">
          <label id="recipe-difficulty-label" nbLabel class="text-[10px] font-black uppercase tracking-widest">
            Dificultad
          </label>
          <nb-select [value]="difficulty()" aria-labelledby="recipe-difficulty-label"
            (valueChange)="onSelect(difficultyChange, $event)">
            @for (option of difficultyOptions(); track option.value) {
              <nb-select-option [value]="option.value" [label]="option.label">
                {{ option.label }}
              </nb-select-option>
            }
          </nb-select>
        </div>
      </div>
    </div>
  `,
  styles: `
    .recipe-filters__icon {
      display: grid;
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      place-items: center;
      border: 3px solid var(--nb-border);
      background: var(--nb-lavender);
      box-shadow: 3px 3px 0 0 var(--nb-shadow);
    }
  `,
})
export class RecipeFiltersComponent {
  readonly search = input<string>('');
  readonly method = input<string>('all');
  readonly difficulty = input<string>('all');
  readonly activeCount = input<number>(0);

  readonly methodOptions = input<RecipeFilterOption[]>([]);
  readonly difficultyOptions = input<RecipeFilterOption[]>([]);

  readonly searchChange = output<string>();
  readonly methodChange = output<string>();
  readonly difficultyChange = output<string>();
  readonly clear = output<void>();

  protected readonly icons = { SlidersHorizontal, X };

  onSelect(target: { emit: (value: string) => void }, value: NbSelectValue | null): void {
    target.emit(value != null ? String(value) : 'all');
  }
}

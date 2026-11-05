import { Component, input, output } from '@angular/core';
import {
  NbButton, NbCheckbox, NbInput, NbInputGroup, NbInputPrefix, NbLabel,
  NbSelect, NbSelectOption, NbSelectValue, NbSurface,
} from '@ng-brutalism/ui';
import { LucideAngularModule, Search, SlidersHorizontal, X } from 'lucide-angular';

export interface CatalogFilterOption {
  value: string;
  label: string;
}

/**
 * Panel de filtros del catálogo. Es presentacional: recibe los valores
 * actuales y emite los cambios para que la página decida cómo filtrar.
 */
@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [
    NbButton, NbCheckbox, NbInput, NbInputGroup, NbInputPrefix, NbLabel,
    NbSelect, NbSelectOption, NbSurface, LucideAngularModule,
  ],
  template: `
    <div nbSurface tone="cream" padding="lg" radius="xl" shadow="hard" border="strong"
      class="flex flex-col gap-5">

      <div class="flex items-center justify-between gap-3 border-b-2 border-(--nb-border)/20 pb-3">
        <div class="flex items-center gap-2.5">
          <span class="catalog-filters__icon">
            <lucide-icon [img]="icons.SlidersHorizontal" [size]="16" [strokeWidth]="3" />
          </span>
          <div>
            <h2 class="font-display text-sm font-black uppercase leading-none">Filtrar catálogo</h2>
            <p class="mt-1 font-mono text-[9px] font-bold uppercase tracking-widest opacity-60">
              {{ activeCount() }} {{ activeCount() === 1 ? 'filtro activo' : 'filtros activos' }}
            </p>
          </div>
        </div>

        @if (activeCount() > 0) {
          <button type="button" (click)="clear.emit()"
            class="inline-flex items-center gap-1 border-b-2 border-transparent font-mono text-[10px] font-black uppercase tracking-widest transition-colors hover:border-(--nb-border)"
            aria-label="Limpiar todos los filtros">
            <lucide-icon [img]="icons.X" [size]="12" [strokeWidth]="3" />
            Limpiar
          </button>
        }
      </div>

      <!-- Búsqueda -->
      <div class="flex flex-col gap-1.5">
        <label nbLabel for="catalog-search" class="text-[10px] font-black uppercase tracking-widest">
          Buscar
        </label>
        <nb-input-group class="w-full">
          <span nbInputPrefix class="inline-flex items-center justify-center">
            <lucide-icon [img]="icons.Search" [size]="16" [strokeWidth]="3" />
          </span>
          <input nbInput id="catalog-search" type="search" placeholder="Grano, origen o nota..."
            [value]="search()" (input)="onSearch($event)" aria-label="Buscar productos" />
        </nb-input-group>
      </div>

      <!-- Proceso -->
      <div class="flex flex-col gap-1.5">
        <label id="catalog-process-label" nbLabel class="text-[10px] font-black uppercase tracking-widest">
          Proceso
        </label>
        <nb-select placeholder="Todos los procesos" [value]="process()"
          aria-labelledby="catalog-process-label" (valueChange)="onSelect(processChange, $event)">
          @for (option of processOptions(); track option.value) {
            <nb-select-option [value]="option.value" [label]="option.label">
              {{ option.label }}
            </nb-select-option>
          }
        </nb-select>
      </div>

      <!-- Tueste -->
      <div class="flex flex-col gap-1.5">
        <label id="catalog-roast-label" nbLabel class="text-[10px] font-black uppercase tracking-widest">
          Nivel de tueste
        </label>
        <nb-select placeholder="Todos los tuestes" [value]="roast()"
          aria-labelledby="catalog-roast-label" (valueChange)="onSelect(roastChange, $event)">
          @for (option of roastOptions(); track option.value) {
            <nb-select-option [value]="option.value" [label]="option.label">
              {{ option.label }}
            </nb-select-option>
          }
        </nb-select>
      </div>

      <!-- Origen -->
      <div class="flex flex-col gap-1.5">
        <label id="catalog-origin-label" nbLabel class="text-[10px] font-black uppercase tracking-widest">
          Origen
        </label>
        <nb-select placeholder="Todos los orígenes" [value]="origin()"
          aria-labelledby="catalog-origin-label" (valueChange)="onSelect(originChange, $event)">
          @for (option of originOptions(); track option.value) {
            <nb-select-option [value]="option.value" [label]="option.label">
              {{ option.label }}
            </nb-select-option>
          }
        </nb-select>
      </div>

      <!-- Disponibilidad -->
      <label class="flex cursor-pointer items-center gap-3 border-t-2 border-dashed border-(--nb-border)/25 pt-4">
        <input type="checkbox" nbCheckbox [checked]="inStockOnly()" (change)="onStockChange($event)" />
        <span class="font-mono text-[10px] font-black uppercase tracking-widest">
          Solo disponibles
        </span>
      </label>

      <button type="button" nbButton tone="cream" size="sm" (click)="clear.emit()"
        class="mt-1 w-full justify-center font-mono text-[10px] font-black uppercase"
        [disabled]="activeCount() === 0">
        <lucide-icon [img]="icons.X" [size]="14" [strokeWidth]="3" />
        <span>Restablecer filtros</span>
      </button>
    </div>
  `,
  styles: `
    .catalog-filters__icon {
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
export class CatalogFiltersComponent {
  readonly search = input<string>('');
  readonly process = input<string>('all');
  readonly roast = input<string>('all');
  readonly origin = input<string>('all');
  readonly inStockOnly = input<boolean>(false);
  readonly activeCount = input<number>(0);

  readonly processOptions = input<CatalogFilterOption[]>([]);
  readonly roastOptions = input<CatalogFilterOption[]>([]);
  readonly originOptions = input<CatalogFilterOption[]>([]);

  readonly searchChange = output<string>();
  readonly processChange = output<string>();
  readonly roastChange = output<string>();
  readonly originChange = output<string>();
  readonly inStockOnlyChange = output<boolean>();
  readonly clear = output<void>();

  protected readonly icons = { Search, SlidersHorizontal, X };

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  onSelect(target: { emit: (value: string) => void }, value: NbSelectValue | null): void {
    target.emit(value != null ? String(value) : 'all');
  }

  onStockChange(event: Event): void {
    this.inStockOnlyChange.emit((event.target as HTMLInputElement).checked);
  }
}

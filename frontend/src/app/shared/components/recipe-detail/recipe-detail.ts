import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButton, NbChip, NbChipGroup, NbDisplay, NbMediaFrame, NbSeparator,
  NbStack, NbSurface, NbText,
} from '@ng-brutalism/ui';
import { LucideAngularModule, Coffee, Flame, Timer, Droplets, Scale } from 'lucide-angular';
import { Recipe } from '../../../core/models/recipe.model';
import { ModalComponent } from '../modal/modal.component';

/**
 * Detalle completo de una receta de extracción.
 * Se muestra dentro de un modal reutilizable y puede usarse desde
 * cualquier página que tenga una `Recipe`.
 */
@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    RouterLink,
    NbButton, NbChip, NbChipGroup, NbDisplay, NbMediaFrame, NbSeparator,
    NbStack, NbSurface, NbText,
    LucideAngularModule,
    ModalComponent,
  ],
  template: `
    <app-modal [title]="recipe().title" [tag]="recipe().method + ' · ' + recipe().difficulty"
      maxWidthClass="max-w-3xl">
      <div class="flex flex-col gap-5">

        <div nbMediaFrame ratio="16/9" tone="pink" border="strong" radius="lg" shadow="hard">
          <img [src]="recipe().imageUrl" [alt]="'Preparación de ' + recipe().title"
            class="h-full w-full object-cover" />
        </div>

        <div nbChipGroup gap="sm" radius="sm">
          <span nbChip tone="warning" radius="sm" class="font-mono text-[11px] font-bold">
            <lucide-icon [img]="icons.Timer" [size]="13" [strokeWidth]="3" />
            {{ recipe().timeDisplay }}
          </span>
          <span nbChip tone="accent" radius="sm" class="font-mono text-[11px] font-bold">
            <lucide-icon [img]="icons.Scale" [size]="13" [strokeWidth]="3" />
            {{ recipe().ratio }}
          </span>
          <span nbChip tone="lavender" radius="sm" class="font-mono text-[11px] font-bold">
            <lucide-icon [img]="icons.Coffee" [size]="13" [strokeWidth]="3" />
            {{ recipe().grindSize }}
          </span>
          <span nbChip tone="mint" radius="sm" class="font-mono text-[11px] font-bold">
            <lucide-icon [img]="icons.Flame" [size]="13" [strokeWidth]="3" />
            {{ recipe().temperature }}
          </span>
        </div>

        <p nbText size="md" weight="medium" class="m-0">
          {{ recipe().description }}
        </p>

        <div nbSurface tone="cream" padding="md" radius="lg" border="strong" shadow="none"
          class="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <span class="recipe-detail__coffee">
              <lucide-icon [img]="icons.Coffee" [size]="18" [strokeWidth]="3" />
            </span>
            <div>
              <p class="font-mono text-[9px] font-black uppercase tracking-widest opacity-60">
                Café recomendado
              </p>
              <p class="font-display text-sm font-black uppercase">{{ recipe().recommendedCoffee }}</p>
            </div>
          </div>

          <a routerLink="/productos" nbButton tone="yellow" size="sm" (click)="close.emit()"
            class="justify-center font-mono text-[10px] font-black uppercase">
            <lucide-icon [img]="icons.Droplets" [size]="14" [strokeWidth]="3" />
            Ver granos
          </a>
        </div>

        <hr nbSeparator variant="dashed" />

        <div nbStack gap="md" align="start">
          <div class="flex items-center gap-2">
            <h3 nbDisplay size="sm" class="uppercase">Paso a paso</h3>
            <span nbChip tone="yellow" radius="sm" class="font-mono text-[10px] font-black">
              {{ recipe().steps.length }} pasos
            </span>
          </div>

          <ol class="m-0 flex list-none flex-col gap-3 p-0">
            @for (step of recipe().steps; track $index) {
              <li class="flex items-start gap-3">
                <span class="recipe-detail__step">{{ $index + 1 }}</span>
                <p class="m-0 pt-1 text-sm font-medium leading-relaxed">{{ step }}</p>
              </li>
            }
          </ol>
        </div>
      </div>

      <div modal-footer class="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" nbButton tone="cream" size="sm" (click)="close.emit()"
          class="justify-center font-mono text-[10px] font-black uppercase">
          Cerrar
        </button>
        <a routerLink="/productos" nbButton tone="black" size="sm" (click)="close.emit()"
          class="justify-center font-mono text-[10px] font-black uppercase">
          <lucide-icon [img]="icons.Coffee" [size]="14" [strokeWidth]="3" />
          Comprar café para esta receta
        </a>
      </div>
    </app-modal>
  `,
  styles: `
    .recipe-detail__coffee,
    .recipe-detail__step {
      display: grid;
      flex-shrink: 0;
      place-items: center;
      border: 3px solid var(--nb-border);
      background: var(--nb-yellow);
      box-shadow: 3px 3px 0 0 var(--nb-shadow);
    }

    .recipe-detail__coffee {
      width: 2.25rem;
      height: 2.25rem;
    }

    .recipe-detail__step {
      width: 2rem;
      height: 2rem;
      font-family: var(--font-mono, monospace);
      font-size: 0.75rem;
      font-weight: 900;
      transform: rotate(-3deg);
    }
  `,
})
export class RecipeDetailComponent {
  readonly recipe = input.required<Recipe>();

  readonly close = output<void>();

  protected readonly icons = { Coffee, Droplets, Flame, Scale, Timer };
}

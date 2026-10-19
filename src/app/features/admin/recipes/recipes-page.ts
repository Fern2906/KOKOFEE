import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { NbButton, NbInput, NbLabel } from '@ng-brutalism/ui';

import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe, RECIPE_METHODS, RECIPE_DIFFICULTIES } from '../../../core/models/recipe.model';
import { RecipeCardComponent } from '../../../shared/components/recipe-card/recipe-card';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

type FormMode = 'create' | 'edit';

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbButton,
    NbInput,
    NbLabel,
    RecipeCardComponent,
    InputComponent,
    ModalComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-200">

      <!-- PAGE HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-koko-espresso/20 gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-koko-caramel"></span>
            <span class="text-xs font-mono uppercase tracking-widest font-bold text-koko-caramel">Panel Admin · Recetas</span>
          </div>
          <h1 class="font-display font-black text-2xl sm:text-3xl text-koko-espresso tracking-tight">Recetas de Barismo</h1>
          <p class="text-xs sm:text-sm text-koko-coffee/80 mt-1 max-w-xl">Crea y gestiona las recetas de preparación de KOKOFEE.</p>
        </div>
        <button
          nbButton
          tone="primary"
          size="sm"
          type="button"
          (click)="openCreateModal()"
          class="font-bold text-xs shadow-[2px_2px_0px_#1A120B] whitespace-nowrap"
        >
          + Agregar receta
        </button>
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="flex flex-col sm:flex-row gap-3 flex-wrap">
        <!-- Search -->
        <div class="relative flex-1 min-w-[200px]">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-koko-muted text-sm pointer-events-none">🔍</span>
          <input
            nbInput
            type="search"
            id="rec-search"
            placeholder="Buscar por nombre o descripción..."
            [value]="searchQuery()"
            (input)="onSearch($event)"
            class="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B]"
          />
        </div>
        <!-- Filter by method -->
        <select
          id="filter-method"
          [value]="filterMethod()"
          (change)="onFilterMethod($event)"
          class="px-3 py-2.5 text-xs font-mono font-bold border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] text-koko-espresso cursor-pointer"
        >
          <option value="">Todos los métodos</option>
          @for (m of recipeMethods; track m) {
            <option [value]="m">{{ m }}</option>
          }
        </select>
        <!-- Filter by difficulty -->
        <select
          id="filter-difficulty"
          [value]="filterDifficulty()"
          (change)="onFilterDifficulty($event)"
          class="px-3 py-2.5 text-xs font-mono font-bold border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] text-koko-espresso cursor-pointer"
        >
          <option value="">Todas las dificultades</option>
          @for (d of recipeDifficulties; track d) {
            <option [value]="d">{{ d }}</option>
          }
        </select>
        <!-- Clear filters -->
        @if (filterMethod() || filterDifficulty() || searchQuery()) {
          <button
            type="button"
            (click)="clearFilters()"
            class="text-xs font-mono font-bold text-koko-caramel hover:underline whitespace-nowrap self-center"
          >
            Limpiar filtros ×
          </button>
        }
      </div>

      <!-- RESULTS COUNT -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-koko-muted">{{ filteredRecipes().length }} receta(s)</span>
      </div>

      <!-- RECIPE GRID -->
      @if (filteredRecipes().length === 0) {
        <div class="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div class="text-5xl">📭</div>
          <p class="font-display font-bold text-koko-espresso text-lg">No se encontraron recetas</p>
          <p class="text-sm text-koko-muted max-w-xs">Prueba con otros filtros o agrega una nueva receta con el botón de arriba.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (recipe of pagedRecipes(); track recipe.id) {
            <div class="relative flex flex-col">
              <!-- Card actions row -->
              <div class="flex items-center justify-end gap-2 mb-2">
                <button
                  nbButton
                  tone="cream"
                  size="sm"
                  type="button"
                  (click)="openEditModal(recipe)"
                  class="text-[11px] py-1 px-2.5 font-bold"
                  [attr.aria-label]="'Editar ' + recipe.title"
                >
                  ✏️ Editar
                </button>
                <button
                  nbButton
                  tone="danger"
                  size="sm"
                  type="button"
                  (click)="requestDelete(recipe)"
                  class="text-[11px] py-1 px-2.5 font-bold"
                  [attr.aria-label]="'Eliminar ' + recipe.title"
                >
                  🗑️ Eliminar
                </button>
              </div>
              <app-recipe-card [recipe]="recipe" (viewRecipe)="onViewRecipe($event)" class="flex-1" />
            </div>
          }
        </div>

        <!-- PAGINATION -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between gap-3 flex-wrap text-xs font-mono pt-2">
            <span class="text-koko-muted">Página {{ currentPage() + 1 }} de {{ totalPages() }}</span>
            <div class="flex items-center gap-2">
              <button
                nbButton
                tone="cream"
                size="sm"
                type="button"
                [disabled]="currentPage() === 0"
                (click)="prevPage()"
                class="text-[11px] py-1 px-2 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                nbButton
                tone="cream"
                size="sm"
                type="button"
                [disabled]="currentPage() >= totalPages() - 1"
                (click)="nextPage()"
                class="text-[11px] py-1 px-2 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        }
      }

      <!-- TOAST -->
      @if (toast()) {
        <div
          class="fixed bottom-5 right-5 z-[70] px-4 py-3 bg-koko-espresso text-koko-cream border-2 border-koko-gold rounded-xl shadow-[3px_3px_0px_#C25E00] text-xs font-mono font-bold flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200"
          role="status"
          aria-live="polite"
        >
          <span>{{ toast() }}</span>
          <button (click)="toast.set(null)" class="text-koko-cream/60 hover:text-white">×</button>
        </div>
      }

      <!-- RECIPE FORM MODAL -->
      @if (showModal()) {
        <app-modal
          [title]="formMode() === 'create' ? 'Agregar Receta' : 'Editar Receta'"
          tag="Formulario de Recetas"
          maxWidthClass="max-w-3xl"
          (close)="closeModal()"
        >
          <form [formGroup]="recipeForm" (ngSubmit)="submitForm()" class="space-y-5" id="recipe-form" novalidate>

            <!-- Title & Method -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input
                label="Nombre de la receta"
                id="rf-title"
                placeholder="Ej. V60 Frutal Etiopía"
                formControlName="title"
                [required]="true"
                [isInvalid]="isFieldInvalid('title')"
                [isTouched]="isFieldTouched('title')"
                errorMessage="El nombre es obligatorio"
              />
              <div class="flex flex-col gap-1.5">
                <label nbLabel for="rf-method" class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">
                  Método *
                </label>
                <select
                  id="rf-method"
                  formControlName="method"
                  class="px-3.5 py-2.5 text-sm border-2 rounded-lg bg-white border-koko-espresso shadow-[2px_2px_0px_#1A120B] text-koko-espresso font-medium"
                  [class.border-koko-danger]="isFieldInvalid('method') && isFieldTouched('method')"
                >
                  <option value="">Selecciona método</option>
                  @for (m of recipeMethods; track m) {
                    <option [value]="m">{{ m }}</option>
                  }
                </select>
                @if (isFieldInvalid('method') && isFieldTouched('method')) {
                  <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">Selecciona un método</p>
                }
              </div>
            </div>

            <!-- Difficulty & Time -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label nbLabel for="rf-difficulty" class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">
                  Dificultad *
                </label>
                <select
                  id="rf-difficulty"
                  formControlName="difficulty"
                  class="px-3.5 py-2.5 text-sm border-2 rounded-lg bg-white border-koko-espresso shadow-[2px_2px_0px_#1A120B] text-koko-espresso font-medium"
                  [class.border-koko-danger]="isFieldInvalid('difficulty') && isFieldTouched('difficulty')"
                >
                  <option value="">Selecciona dificultad</option>
                  @for (d of recipeDifficulties; track d) {
                    <option [value]="d">{{ d }}</option>
                  }
                </select>
                @if (isFieldInvalid('difficulty') && isFieldTouched('difficulty')) {
                  <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">Selecciona una dificultad</p>
                }
              </div>
              <app-input
                label="Tiempo de preparación"
                id="rf-time"
                placeholder="ej. 4:00 min"
                formControlName="timeDisplay"
                [required]="true"
                [isInvalid]="isFieldInvalid('timeDisplay')"
                [isTouched]="isFieldTouched('timeDisplay')"
                errorMessage="El tiempo es obligatorio"
              />
            </div>

            <!-- Ratio & Grind -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input
                label="Ratio"
                id="rf-ratio"
                placeholder="ej. 1:16 (15g café / 240g agua)"
                formControlName="ratio"
                [required]="true"
                [isInvalid]="isFieldInvalid('ratio')"
                [isTouched]="isFieldTouched('ratio')"
                errorMessage="El ratio es obligatorio"
              />
              <app-input
                label="Tamaño de molienda"
                id="rf-grind"
                placeholder="ej. Media-Fina"
                formControlName="grindSize"
                [required]="true"
                [isInvalid]="isFieldInvalid('grindSize')"
                [isTouched]="isFieldTouched('grindSize')"
                errorMessage="La molienda es obligatoria"
              />
            </div>

            <!-- Temperature & Recommended Coffee -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input
                label="Temperatura del agua"
                id="rf-temp"
                placeholder="ej. 93°C"
                formControlName="temperature"
                [required]="true"
                [isInvalid]="isFieldInvalid('temperature')"
                [isTouched]="isFieldTouched('temperature')"
                errorMessage="La temperatura es obligatoria"
              />
              <app-input
                label="Café recomendado"
                id="rf-coffee"
                placeholder="ej. Geisha Finca El Paraíso"
                formControlName="recommendedCoffee"
                [required]="true"
                [isInvalid]="isFieldInvalid('recommendedCoffee')"
                [isTouched]="isFieldTouched('recommendedCoffee')"
                errorMessage="El café recomendado es obligatorio"
              />
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5">
              <label nbLabel for="rf-desc" class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">
                Descripción *
              </label>
              <textarea
                id="rf-desc"
                formControlName="description"
                rows="3"
                placeholder="Describe el perfil de sabor, técnica y experiencia de esta preparación..."
                class="w-full px-3.5 py-2.5 text-sm border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] resize-none focus:outline-none"
                [class.border-koko-danger]="isFieldInvalid('description') && isFieldTouched('description')"
              ></textarea>
              @if (isFieldInvalid('description') && isFieldTouched('description')) {
                <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">La descripción es obligatoria</p>
              }
            </div>

            <!-- Image URL + Preview -->
            <app-input
              label="URL de imagen"
              id="rf-image"
              placeholder="https://images.unsplash.com/..."
              formControlName="imageUrl"
              [required]="true"
              [isInvalid]="isFieldInvalid('imageUrl')"
              [isTouched]="isFieldTouched('imageUrl')"
              errorMessage="La URL de imagen es obligatoria"
            />
            @if (imageUrlValue()) {
              <div class="rounded-xl overflow-hidden border-2 border-koko-espresso/30 bg-koko-cream/40" style="max-height:200px">
                <img
                  [src]="imageUrlValue()"
                  alt="Vista previa de la receta"
                  class="w-full object-cover"
                  style="max-height:200px"
                  (error)="onImgError($event)"
                />
              </div>
            }

            <!-- Steps (FormArray) -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <label class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">
                  Pasos de preparación *
                </label>
                <button
                  type="button"
                  (click)="addStep()"
                  class="text-[11px] font-mono font-bold text-koko-caramel hover:underline flex items-center gap-1"
                >
                  + Agregar paso
                </button>
              </div>

              @for (step of stepsControls; track $index) {
                <div class="flex items-start gap-2">
                  <span class="text-[11px] font-mono font-bold text-koko-muted mt-3 w-12 shrink-0 text-right">
                    Paso {{ $index + 1 }}
                  </span>
                  <div class="flex-1 flex flex-col gap-1">
                    <input
                      [formControl]="step"
                      type="text"
                      [placeholder]="'Describe el paso ' + ($index + 1)"
                      class="w-full px-3.5 py-2.5 text-sm border-2 rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] focus:outline-none"
                      [class.border-koko-danger]="step.invalid && step.touched"
                      [class.border-koko-espresso]="!(step.invalid && step.touched)"
                    />
                    @if (step.invalid && step.touched) {
                      <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">El paso no puede estar vacío</p>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="removeStep($index)"
                    [disabled]="stepsControls.length <= 1"
                    class="mt-2 w-8 h-8 rounded-lg border-2 border-koko-espresso bg-koko-cream text-koko-espresso font-bold hover:bg-koko-danger hover:text-white hover:border-koko-danger transition-colors flex items-center justify-center text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Eliminar paso"
                  >
                    ✕
                  </button>
                </div>
              }

              @if (stepsArray.invalid && stepsArray.touched && stepsControls.length === 0) {
                <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">Agrega al menos un paso</p>
              }
            </div>

            @if (formError()) {
              <div class="p-3 bg-red-50 border-2 border-koko-danger rounded-lg text-xs font-bold text-koko-danger" role="alert">
                {{ formError() }}
              </div>
            }
          </form>

          <div modal-footer class="flex items-center justify-end gap-3">
            <button nbButton tone="cream" size="sm" type="button" (click)="closeModal()" class="font-mono text-xs font-bold">
              Cancelar
            </button>
            <button
              nbButton
              tone="primary"
              size="sm"
              type="button"
              (click)="submitForm()"
              class="font-bold text-xs shadow-[2px_2px_0px_#1A120B]"
            >
              {{ formMode() === 'create' ? 'Crear Receta' : 'Guardar Cambios' }}
            </button>
          </div>
        </app-modal>
      }

      <!-- CONFIRM DELETE -->
      @if (showConfirm()) {
        <app-confirm-dialog
          title="Eliminar receta"
          [message]="'¿Deseas eliminar la receta ' + (recipeToDelete()?.title ?? '') + '? Esta acción no se puede deshacer.'"
          confirmLabel="Sí, eliminar"
          cancelLabel="Cancelar"
          (confirmed)="confirmDelete()"
          (cancelled)="cancelDelete()"
        />
      }
    </div>
  `,
})
export class RecipesAdminPage {
  readonly PAGE_SIZE = 6;

  readonly recipeMethods = RECIPE_METHODS;
  readonly recipeDifficulties = RECIPE_DIFFICULTIES;

  private readonly recipeService = inject(RecipeService);
  private readonly fb = inject(FormBuilder);

  // ── UI state ──────────────────────────────────────────────────────────────
  readonly isLoading       = signal(false);
  readonly showModal       = signal(false);
  readonly showConfirm     = signal(false);
  readonly formMode        = signal<FormMode>('create');
  readonly editingRecipe   = signal<Recipe | null>(null);
  readonly recipeToDelete  = signal<Recipe | null>(null);
  readonly toast           = signal<string | null>(null);
  readonly formError       = signal<string | null>(null);

  // ── Filters ───────────────────────────────────────────────────────────────
  readonly searchQuery     = signal('');
  readonly filterMethod    = signal('');
  readonly filterDifficulty = signal('');
  readonly currentPage     = signal(0);

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly filteredRecipes = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const method = this.filterMethod();
    const diff = this.filterDifficulty();
    return this.recipeService.recipes().filter(r => {
      const mq = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const mm = !method || r.method === method;
      const md = !diff || r.difficulty === diff;
      return mq && mm && md;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRecipes().length / this.PAGE_SIZE)));
  readonly pagedRecipes = computed(() => {
    const start = this.currentPage() * this.PAGE_SIZE;
    return this.filteredRecipes().slice(start, start + this.PAGE_SIZE);
  });

  // ── Reactive Form ─────────────────────────────────────────────────────────
  readonly recipeForm = this.fb.group({
    title:            ['', Validators.required],
    description:      ['', Validators.required],
    method:           ['', Validators.required],
    difficulty:       ['', Validators.required],
    timeDisplay:      ['', Validators.required],
    ratio:            ['', Validators.required],
    grindSize:        ['', Validators.required],
    temperature:      ['', Validators.required],
    recommendedCoffee: ['', Validators.required],
    imageUrl:         ['', Validators.required],
    steps:            this.fb.array<FormControl<string>>(
      [this.fb.control('', { validators: Validators.required, nonNullable: true })],
    ),
  });

  get stepsArray(): FormArray<FormControl<string>> {
    return this.recipeForm.get('steps') as FormArray<FormControl<string>>;
  }

  get stepsControls(): FormControl<string>[] {
    return this.stepsArray.controls as FormControl<string>[];
  }

  readonly imageUrlValue = computed(() => this.recipeForm.get('imageUrl')?.value ?? '');

  // ── Helpers ───────────────────────────────────────────────────────────────
  isFieldInvalid(f: string): boolean { return !!this.recipeForm.get(f)?.invalid; }
  isFieldTouched(f: string): boolean { return !!this.recipeForm.get(f)?.touched; }

  // ── Filter handlers ───────────────────────────────────────────────────────
  onSearch(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
    this.currentPage.set(0);
  }

  onFilterMethod(e: Event): void {
    this.filterMethod.set((e.target as HTMLSelectElement).value);
    this.currentPage.set(0);
  }

  onFilterDifficulty(e: Event): void {
    this.filterDifficulty.set((e.target as HTMLSelectElement).value);
    this.currentPage.set(0);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.filterMethod.set('');
    this.filterDifficulty.set('');
    this.currentPage.set(0);
  }

  prevPage(): void { if (this.currentPage() > 0) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages() - 1) this.currentPage.update(p => p + 1); }

  // ── Modal ─────────────────────────────────────────────────────────────────
  openCreateModal(): void {
    this.formMode.set('create');
    this.editingRecipe.set(null);
    this.recipeForm.reset({ title: '', description: '', method: '', difficulty: '', timeDisplay: '', ratio: '', grindSize: '', temperature: '', recommendedCoffee: '', imageUrl: '' });
    // Reset steps to one empty control
    while (this.stepsArray.length > 0) this.stepsArray.removeAt(0);
    this.stepsArray.push(this.fb.control('', { validators: Validators.required, nonNullable: true }));
    this.formError.set(null);
    this.showModal.set(true);
  }

  openEditModal(recipe: Recipe): void {
    this.formMode.set('edit');
    this.editingRecipe.set(recipe);
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      method: recipe.method,
      difficulty: recipe.difficulty,
      timeDisplay: recipe.timeDisplay,
      ratio: recipe.ratio,
      grindSize: recipe.grindSize,
      temperature: recipe.temperature,
      recommendedCoffee: recipe.recommendedCoffee,
      imageUrl: recipe.imageUrl,
    });
    // Populate steps
    while (this.stepsArray.length > 0) this.stepsArray.removeAt(0);
    const steps = recipe.steps && recipe.steps.length > 0 ? recipe.steps : [''];
    steps.forEach(s => {
      this.stepsArray.push(this.fb.control(s, { validators: Validators.required, nonNullable: true }));
    });
    this.formError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.recipeForm.reset();
    while (this.stepsArray.length > 0) this.stepsArray.removeAt(0);
    this.stepsArray.push(this.fb.control('', { validators: Validators.required, nonNullable: true }));
    this.editingRecipe.set(null);
  }

  // ── Steps array management ────────────────────────────────────────────────
  addStep(): void {
    this.stepsArray.push(this.fb.control('', { validators: Validators.required, nonNullable: true }));
  }

  removeStep(index: number): void {
    if (this.stepsArray.length > 1) {
      this.stepsArray.removeAt(index);
    }
  }

  // ── Image error handler ───────────────────────────────────────────────────
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  // ── Form submit ───────────────────────────────────────────────────────────
  submitForm(): void {
    this.recipeForm.markAllAsTouched();
    this.stepsArray.controls.forEach(c => c.markAsTouched());

    if (this.recipeForm.invalid) {
      this.formError.set('Corrige los campos con error antes de continuar.');
      return;
    }

    this.formError.set(null);
    const raw = this.recipeForm.getRawValue();
    const steps = this.stepsArray.controls.map(c => c.value).filter(Boolean);

    const payload: Omit<Recipe, 'id'> = {
      title:            raw.title as string,
      description:      raw.description as string,
      method:           raw.method as Recipe['method'],
      difficulty:       raw.difficulty as Recipe['difficulty'],
      timeDisplay:      raw.timeDisplay as string,
      ratio:            raw.ratio as string,
      grindSize:        raw.grindSize as string,
      temperature:      raw.temperature as string,
      recommendedCoffee: raw.recommendedCoffee as string,
      imageUrl:         raw.imageUrl as string,
      steps,
      stepsCount:       steps.length,
    };

    const editing = this.editingRecipe();
    if (editing) {
      this.recipeService.updateRecipe(editing.id, payload);
      this.notify('Receta guardada correctamente ✓');
    } else {
      this.recipeService.addRecipe(payload);
      this.notify('Receta guardada correctamente ✓');
    }

    this.closeModal();
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  requestDelete(recipe: Recipe): void {
    this.recipeToDelete.set(recipe);
    this.showConfirm.set(true);
  }

  confirmDelete(): void {
    const recipe = this.recipeToDelete();
    if (recipe) {
      this.recipeService.deleteRecipe(recipe.id);
      this.notify('Receta eliminada');
    }
    this.showConfirm.set(false);
    this.recipeToDelete.set(null);
  }

  cancelDelete(): void {
    this.showConfirm.set(false);
    this.recipeToDelete.set(null);
  }

  // ── View recipe (card output — optional) ──────────────────────────────────
  onViewRecipe(_recipe: Recipe): void {
    // Could open a detail modal in the future; no-op for now
  }

  // ── Toast ──────────────────────────────────────────────────────────────────
  private notify(msg: string): void {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 3000);
  }
}

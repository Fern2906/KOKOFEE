import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NbBadge, NbButton, NbInput, NbLabel } from '@ng-brutalism/ui';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
type ProcessType = Product['process'];
type RoastType   = Product['roastLevel'];


@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbButton,
    NbBadge,
    NbInput,
    NbLabel,
    DataTableComponent,
    StatCardComponent,
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
            <span class="text-xs font-mono uppercase tracking-widest font-bold text-koko-caramel">Panel Admin · Inventario</span>
          </div>
          <h1 class="font-display font-black text-2xl sm:text-3xl text-koko-espresso tracking-tight">Inventario de Granos</h1>
          <p class="text-xs sm:text-sm text-koko-coffee/80 mt-1 max-w-xl">Consulta, agrega, edita y elimina los microlotes disponibles en la tienda KOKOFEE.</p>
        </div>
        <button nbButton tone="primary" size="sm" type="button" id="btn-add-product" (click)="openAddModal()"
          class="font-bold text-xs shadow-[2px_2px_0px_#1A120B] whitespace-nowrap">
          + Agregar Producto
        </button>
      </div>
      <!-- STATS -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card title="Total Microlotes"    [value]="totalProducts()"                     icon="&#x1F4E6;" />
        <app-stat-card title="Stock Total"         [value]="totalStock()"                        icon="&#x1F3EA;" />
        <app-stat-card title="Stock Bajo"          [value]="lowStockCount() + ' alertas'"        icon="&#x26A0;&#xFE0F;" changeType="negative" />
        <app-stat-card title="Sin Existencias"     [value]="outOfStockCount() + ' agotados'"     icon="&#x1F6A8;" changeType="negative" />
      </div>
      <!-- SEARCH & FILTERS -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-koko-muted text-sm pointer-events-none">&#x1F50D;</span>
          <input nbInput type="search" id="inv-search" placeholder="Buscar por nombre, origen o variedad..."
            [value]="searchQuery()" (input)="onSearch($event)"
            class="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B]" />
        </div>
        <select id="filter-process" [value]="filterProcess()" (change)="onFilterProcess($event)"
          class="px-3 py-2.5 text-xs font-mono font-bold border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] text-koko-espresso cursor-pointer">
          <option value="">Todos los procesos</option>
          <option value="Lavado">Lavado</option>
          <option value="Natural">Natural</option>
          <option value="Honey">Honey</option>
          <option value="Maceracion Carbonica">Maceracion Carbonica</option>
        </select>
        <select id="filter-stock" [value]="filterStock()" (change)="onFilterStock($event)"
          class="px-3 py-2.5 text-xs font-mono font-bold border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] text-koko-espresso cursor-pointer">
          <option value="all">Todo el stock</option>
          <option value="low">Stock bajo</option>
          <option value="out">Sin existencias</option>
        </select>
      </div>
      <!-- TABLE -->
      <app-data-table title="Catalogo de Microlotes" [subtitle]="tableSubtitle()"
        [headers]="['Producto','Origen / Proceso','Precio','Stock','SCA','Estado','Acciones']"
        [isLoading]="isLoading()" [isEmpty]="filteredProducts().length === 0"
        emptyMessage="No se encontraron productos con los filtros aplicados.">
        <div table-actions class="flex items-center gap-2">
          <span class="text-xs font-mono text-koko-muted">{{ filteredProducts().length }} resultado(s)</span>
          @if (filterProcess() || filterStock() !== 'all' || searchQuery()) {
            <button type="button" (click)="clearFilters()"
              class="text-[11px] font-mono font-bold text-koko-caramel hover:underline">Limpiar filtros x</button>
          }
        </div>
        <ng-container table-rows>
          @for (product of pagedProducts(); track product.id) {
            <tr class="hover:bg-koko-cream/40 transition-colors" [class.bg-red-50]="product.stock === 0">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <img [src]="product.imageUrl" [alt]="product.name"
                    class="w-10 h-10 rounded-lg object-cover border-2 border-koko-espresso/20 shrink-0 hidden sm:block" loading="lazy" />
                  <div>
                    <div class="font-display font-bold text-xs text-koko-espresso leading-tight max-w-[180px] truncate">{{ product.name }}</div>
                    <div class="text-[10px] font-mono text-koko-muted">{{ product.variety }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="text-xs font-semibold text-koko-roast">{{ product.origin }}</div>
                <div class="text-[10px] font-mono text-koko-muted">{{ product.process }} · {{ product.roastLevel }}</div>
              </td>
              <td class="py-3 px-4 font-mono font-bold text-xs text-koko-espresso whitespace-nowrap">
                {{ '$' + product.price.toFixed(2) }}
                @if (product.originalPrice) {
                  <div class="text-[10px] text-koko-muted line-through font-normal">{{ '$' + product.originalPrice!.toFixed(2) }}</div>
                }
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="font-mono font-bold text-sm"
                  [class.text-koko-danger]="product.stock <= lowStockThreshold"
                  [class.text-koko-espresso]="product.stock > lowStockThreshold">{{ product.stock }}</span>
                <span class="text-[10px] text-koko-muted font-mono"> bolsas</span>
              </td>
              <td class="py-3 px-4 font-mono text-xs text-koko-muted whitespace-nowrap">{{ product.scaScore }}</td>
              <td class="py-3 px-4 whitespace-nowrap">
                @if (product.stock === 0) {
                  <span nbBadge tone="danger"  class="text-[10px] font-bold font-mono py-0.5 px-2">Agotado</span>
                } @else if (product.stock <= lowStockThreshold) {
                  <span nbBadge tone="warning" class="text-[10px] font-bold font-mono py-0.5 px-2">Stock bajo</span>
                } @else {
                  <span nbBadge tone="success" class="text-[10px] font-bold font-mono py-0.5 px-2">Disponible</span>
                }
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button nbButton tone="cream" size="sm" type="button" (click)="openEditModal(product)"
                    class="text-[11px] py-1 px-2.5 font-bold" [attr.aria-label]="'Editar ' + product.name">
                    &#9998; Editar
                  </button>
                  <button nbButton tone="danger" size="sm" type="button" (click)="requestDelete(product)"
                    class="text-[11px] py-1 px-2.5 font-bold" [attr.aria-label]="'Eliminar ' + product.name">
                    &#x1F5D1;
                  </button>
                </div>
              </td>
            </tr>
          }
        </ng-container>
        <div table-footer class="p-3 border-t-2 border-koko-espresso/15 bg-koko-cream/30 flex items-center justify-between gap-3 flex-wrap text-xs font-mono">
          <span class="text-koko-muted">Pagina {{ currentPage() + 1 }} de {{ totalPages() }}</span>
          <div class="flex items-center gap-2">
            <button nbButton tone="cream" size="sm" type="button" [disabled]="currentPage() === 0" (click)="prevPage()"
              class="text-[11px] py-1 px-2 font-bold disabled:opacity-40 disabled:cursor-not-allowed">Anterior</button>
            <button nbButton tone="cream" size="sm" type="button" [disabled]="currentPage() >= totalPages() - 1" (click)="nextPage()"
              class="text-[11px] py-1 px-2 font-bold disabled:opacity-40 disabled:cursor-not-allowed">Siguiente</button>
          </div>
        </div>
      </app-data-table>
      <!-- TOAST -->
      @if (toast()) {
        <div class="fixed bottom-5 right-5 z-[70] px-4 py-3 bg-koko-espresso text-koko-cream border-2 border-koko-gold rounded-xl shadow-[3px_3px_0px_#C25E00] text-xs font-mono font-bold flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200" role="status" aria-live="polite">
          <span>{{ toast() }}</span>
          <button (click)="toast.set(null)" class="text-koko-cream/60 hover:text-white">x</button>
        </div>
      }
      <!-- PRODUCT MODAL -->
      @if (showModal()) {
        <app-modal [title]="editingProduct() ? 'Editar Producto' : 'Agregar Producto'"
          tag="Formulario de Inventario" maxWidthClass="max-w-3xl" (close)="closeModal()">
          <form [formGroup]="productForm" (ngSubmit)="submitForm()" class="space-y-5" id="product-form" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input label="Nombre del producto" id="pf-name" placeholder="Ej. Geisha Finca El Paraiso"
                formControlName="name" [required]="true" [isInvalid]="isFieldInvalid('name')"
                [isTouched]="isFieldTouched('name')" errorMessage="El nombre es obligatorio" />
              <app-input label="Variedad" id="pf-variety" placeholder="Ej. Bourbon Rosado"
                formControlName="variety" [required]="true" [isInvalid]="isFieldInvalid('variety')"
                [isTouched]="isFieldTouched('variety')" errorMessage="La variedad es obligatoria" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input label="Origen" id="pf-origin" placeholder="Ej. Huila, Colombia"
                formControlName="origin" [required]="true" [isInvalid]="isFieldInvalid('origin')"
                [isTouched]="isFieldTouched('origin')" errorMessage="El origen es obligatorio" />
              <app-input label="Altitud" id="pf-altitude" placeholder="Ej. 1,950 msnm"
                formControlName="altitude" [required]="true" [isInvalid]="isFieldInvalid('altitude')"
                [isTouched]="isFieldTouched('altitude')" errorMessage="La altitud es obligatoria" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label nbLabel for="pf-process" class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">Proceso *</label>
                <select id="pf-process" formControlName="process"
                  class="px-3.5 py-2.5 text-sm border-2 rounded-lg bg-white border-koko-espresso shadow-[2px_2px_0px_#1A120B] text-koko-espresso font-medium">
                  <option value="">Selecciona proceso</option>
                  <option value="Lavado">Lavado</option>
                  <option value="Natural">Natural</option>
                  <option value="Honey">Honey</option>
                  <option value="Maceracion Carbonica">Maceracion Carbonica</option>
                </select>
                @if (isFieldInvalid('process') && isFieldTouched('process')) {
                  <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">Selecciona un proceso</p>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label nbLabel for="pf-roast" class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">Nivel de tueste *</label>
                <select id="pf-roast" formControlName="roastLevel"
                  class="px-3.5 py-2.5 text-sm border-2 rounded-lg bg-white border-koko-espresso shadow-[2px_2px_0px_#1A120B] text-koko-espresso font-medium">
                  <option value="">Selecciona tueste</option>
                  <option value="Tueste Claro">Tueste Claro</option>
                  <option value="Tueste Medio">Tueste Medio</option>
                  <option value="Tueste Medio-Oscuro">Tueste Medio-Oscuro</option>
                </select>
                @if (isFieldInvalid('roastLevel') && isFieldTouched('roastLevel')) {
                  <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">Selecciona el tueste</p>
                }
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <app-input label="Precio (USD)" id="pf-price" type="number" placeholder="0.00"
                formControlName="price" [required]="true" [isInvalid]="isFieldInvalid('price')"
                [isTouched]="isFieldTouched('price')" errorMessage="Precio valido (>= 0)" />
              <app-input label="Stock (bolsas)" id="pf-stock" type="number" placeholder="0"
                formControlName="stock" [required]="true" [isInvalid]="isFieldInvalid('stock')"
                [isTouched]="isFieldTouched('stock')" errorMessage="Cantidad valida (>= 0)" />
              <app-input label="Gramaje" id="pf-weight" placeholder="Ej. 250g"
                formControlName="weight" [required]="true" [isInvalid]="isFieldInvalid('weight')"
                [isTouched]="isFieldTouched('weight')" errorMessage="El gramaje es obligatorio" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input label="Puntuacion SCA" id="pf-sca" type="number" placeholder="87.5"
                formControlName="scaScore" [required]="true" [isInvalid]="isFieldInvalid('scaScore')"
                [isTouched]="isFieldTouched('scaScore')" errorMessage="Puntaje SCA valido requerido" />
              <app-input label="Etiqueta (badge)" id="pf-badge" placeholder="Ej. Microlote Exclusivo" formControlName="badge" />
            </div>
            <app-input label="URL de imagen" id="pf-image" placeholder="https://..."
              formControlName="imageUrl" [required]="true" [isInvalid]="isFieldInvalid('imageUrl')"
              [isTouched]="isFieldTouched('imageUrl')" errorMessage="La URL de imagen es obligatoria" />
            <div class="flex flex-col gap-1.5">
              <label nbLabel class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">Notas de cata (separadas por comas)</label>
              <input nbInput id="pf-tasting" formControlName="tastingNotesStr"
                placeholder="Ej. Jazmin, Bergamota, Melocoton"
                class="w-full px-3.5 py-2.5 text-sm border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B]" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label nbLabel for="pf-desc" class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso">Descripcion *</label>
              <textarea id="pf-desc" formControlName="description" rows="3"
                placeholder="Describe el cafe, su cosecha y proceso..."
                class="w-full px-3.5 py-2.5 text-sm border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] resize-none focus:outline-none"
                [class.border-koko-danger]="isFieldInvalid('description') && isFieldTouched('description')"></textarea>
              @if (isFieldInvalid('description') && isFieldTouched('description')) {
                <p class="text-xs font-bold text-koko-danger flex items-center gap-1" role="alert">La descripcion es obligatoria</p>
              }
            </div>
            @if (formError()) {
              <div class="p-3 bg-red-50 border-2 border-koko-danger rounded-lg text-xs font-bold text-koko-danger" role="alert">
                {{ formError() }}
              </div>
            }
          </form>
          <div modal-footer class="flex items-center justify-end gap-3">
            <button nbButton tone="cream" size="sm" type="button" (click)="closeModal()" class="font-mono text-xs font-bold">Cancelar</button>
            <button nbButton tone="primary" size="sm" type="button" [disabled]="isSaving()" (click)="submitForm()"
              class="font-bold text-xs shadow-[2px_2px_0px_#1A120B]">
              @if (isSaving()) { <span class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span> }
              {{ editingProduct() ? 'Guardar Cambios' : 'Crear Producto' }}
            </button>
          </div>
        </app-modal>
      }
      <!-- CONFIRM DELETE -->
      @if (showConfirm()) {
        <app-confirm-dialog title="Eliminar producto"
          [message]="'Vas a eliminar ' + (deletingProduct()?.name ?? '') + '. Esta accion no se puede deshacer.'"
          confirmLabel="Si, eliminar" cancelLabel="Cancelar"
          (confirmed)="confirmDelete()" (cancelled)="cancelDelete()" />
      }
    </div>
  `,
})
export class InventoryPageComponent {
  readonly lowStockThreshold = 15;
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading       = signal(false);
  readonly isSaving        = signal(false);
  readonly showModal       = signal(false);
  readonly showConfirm     = signal(false);
  readonly editingProduct  = signal<Product | null>(null);
  readonly deletingProduct = signal<Product | null>(null);
  readonly toast           = signal<string | null>(null);
  readonly formError       = signal<string | null>(null);
  readonly searchQuery     = signal('');
  readonly filterProcess   = signal('');
  readonly filterStock     = signal<'all' | 'low' | 'out'>('all');
  readonly currentPage     = signal(0);

  readonly filteredProducts = computed(() => {
    const q   = this.searchQuery().toLowerCase();
    const prc = this.filterProcess();
    const stk = this.filterStock();
    return this.productService.products().filter((p) => {
      const mq = !q || p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q) || p.variety.toLowerCase().includes(q);
      const mp = !prc || p.process === prc;
      const ms = stk === 'all' ? true : stk === 'low' ? (p.stock > 0 && p.stock <= 15) : p.stock === 0;
      return mq && mp && ms;
    });
  });

  readonly totalPages     = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / 8)));
  readonly pagedProducts  = computed(() => { const s = this.currentPage() * 8; return this.filteredProducts().slice(s, s + 8); });
  readonly tableSubtitle  = computed(() => `Mostrando ${this.pagedProducts().length} de ${this.filteredProducts().length} productos`);
  readonly totalProducts  = computed(() => this.productService.products().length);
  readonly totalStock     = computed(() => this.productService.products().reduce((s, p) => s + p.stock, 0));
  readonly lowStockCount  = computed(() => this.productService.products().filter((p) => p.stock > 0 && p.stock <= 15).length);
  readonly outOfStockCount = computed(() => this.productService.products().filter((p) => p.stock === 0).length);

  readonly productForm = this.fb.group({
    name:            ['', [Validators.required]],
    variety:         ['', Validators.required],
    origin:          ['', Validators.required],
    altitude:        ['', Validators.required],
    process:         ['', Validators.required],
    roastLevel:      ['', Validators.required],
    price:           [0,  [Validators.required, (c: AbstractControl): ValidationErrors | null => { const v = Number(c.value); return isNaN(v) || v < 0 ? {nonNeg:true} : null; }]],
    originalPrice:   [null as number | null],
    stock:           [0,  [Validators.required, (c: AbstractControl): ValidationErrors | null => { const v = Number(c.value); return isNaN(v) || v < 0 ? {nonNeg:true} : null; }]],
    weight:          ['250g', Validators.required],
    scaScore:        [85, [Validators.required]],
    imageUrl:        ['', Validators.required],
    badge:           [''],
    tastingNotesStr: [''],
    description:     ['', Validators.required],
    isFeatured:      [false],
    isNew:           [false],
  });

  isFieldInvalid(f: string): boolean { return !!this.productForm.get(f)?.invalid; }
  isFieldTouched(f: string): boolean { return !!this.productForm.get(f)?.touched; }

  onSearch(e: Event): void { this.searchQuery.set((e.target as HTMLInputElement).value); this.currentPage.set(0); }
  onFilterProcess(e: Event): void { this.filterProcess.set((e.target as HTMLSelectElement).value); this.currentPage.set(0); }
  onFilterStock(e: Event): void { this.filterStock.set((e.target as HTMLSelectElement).value as 'all'|'low'|'out'); this.currentPage.set(0); }
  clearFilters(): void { this.searchQuery.set(''); this.filterProcess.set(''); this.filterStock.set('all'); this.currentPage.set(0); }
  prevPage(): void { if (this.currentPage() > 0) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages() - 1) this.currentPage.update(p => p + 1); }

  openAddModal(): void { this.editingProduct.set(null); this.productForm.reset({stock:0,price:0,scaScore:85,weight:'250g',isFeatured:false,isNew:false}); this.formError.set(null); this.showModal.set(true); }
  openEditModal(p: Product): void { this.editingProduct.set(p); this.productForm.patchValue({...p, tastingNotesStr: p.tastingNotes.join(', '), originalPrice: p.originalPrice ?? null}); this.formError.set(null); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); this.productForm.reset(); }

  submitForm(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) { this.formError.set('Corrige los campos con error antes de continuar.'); return; }
    this.formError.set(null); this.isSaving.set(true);
    const raw = this.productForm.getRawValue();
    const payload: Omit<Product,'id'> = {
      name: raw.name as string, variety: raw.variety as string, origin: raw.origin as string, altitude: raw.altitude as string,
      process: raw.process as ProcessType, roastLevel: raw.roastLevel as RoastType,
      price: Number(raw.price), originalPrice: raw.originalPrice ? Number(raw.originalPrice) : undefined,
      stock: Number(raw.stock), weight: raw.weight as string, scaScore: Number(raw.scaScore),
      imageUrl: raw.imageUrl as string, badge: raw.badge || undefined,
      tastingNotes: (raw.tastingNotesStr as string).split(',').map(s => s.trim()).filter(Boolean),
      description: raw.description as string, isFeatured: !!raw.isFeatured, isNew: !!raw.isNew,
    };
    const editing = this.editingProduct();
    if (editing) { this.productService.updateProduct(editing.id, payload); this.notify(`"${payload.name}" actualizado.`); }
    else { this.productService.addProduct(payload); this.notify(`"${payload.name}" agregado al inventario.`); }
    this.isSaving.set(false); this.closeModal();
  }

  requestDelete(p: Product): void { this.deletingProduct.set(p); this.showConfirm.set(true); }
  confirmDelete(): void { const p = this.deletingProduct(); if (p) { this.productService.deleteProduct(p.id); this.notify(`"${p.name}" eliminado.`); } this.showConfirm.set(false); this.deletingProduct.set(null); }
  cancelDelete(): void { this.showConfirm.set(false); this.deletingProduct.set(null); }
  private notify(msg: string): void { this.toast.set(msg); setTimeout(() => this.toast.set(null), 4000); }
}

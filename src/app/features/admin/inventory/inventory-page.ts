import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NbBadge, NbButton, NbInput, NbLabel, NbSelect, NbSelectOption } from '@ng-brutalism/ui';
import { DataTableComponent, DataTableCellDirective, TableColumn } from '../../../shared/components/data-table/data-table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LucideAngularModule, Pencil, Trash2, ChevronLeft, ChevronRight, Search, Package } from 'lucide-angular';
type ProcessType = Product['process'];
type RoastType = Product['roastLevel'];


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
    DataTableCellDirective,
    StatCardComponent,
    InputComponent,
    ModalComponent,
    ConfirmDialogComponent,
    LucideAngularModule,
    NbSelect,
    NbSelectOption
  ],
  templateUrl: './inventory-page.html',
})
export class InventoryPageComponent {
  readonly lowStockThreshold = 15;
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly showModal = signal(false);
  readonly showConfirm = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly deletingProduct = signal<Product | null>(null);
  readonly toast = signal<string | null>(null);
  readonly formError = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly filterProcess = signal('');
  readonly filterStock = signal<'all' | 'low' | 'out'>('all');
  readonly currentPage = signal(0);

  readonly filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const prc = this.filterProcess();
    const stk = this.filterStock();
    return this.productService.products().filter((p) => {
      const mq = !q || p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q) || p.variety.toLowerCase().includes(q);
      const mp = !prc || p.process === prc;
      const ms = stk === 'all' ? true : stk === 'low' ? (p.stock > 0 && p.stock <= 15) : p.stock === 0;
      return mq && mp && ms;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / 8)));
  readonly pagedProducts = computed(() => { const s = this.currentPage() * 8; return this.filteredProducts().slice(s, s + 8); });
  readonly tableSubtitle = computed(() => `Mostrando ${this.pagedProducts().length} de ${this.filteredProducts().length} productos`);
  readonly totalProducts = computed(() => this.productService.products().length);
  readonly totalStock = computed(() => this.productService.products().reduce((s, p) => s + p.stock, 0));
  readonly lowStockCount = computed(() => this.productService.products().filter((p) => p.stock > 0 && p.stock <= 15).length);
  readonly outOfStockCount = computed(() => this.productService.products().filter((p) => p.stock === 0).length);

  readonly productForm = this.fb.group({
    name: ['', [Validators.required]],
    variety: ['', Validators.required],
    origin: ['', Validators.required],
    altitude: ['', Validators.required],
    process: ['', Validators.required],
    roastLevel: ['', Validators.required],
    price: [0, [Validators.required, (c: AbstractControl): ValidationErrors | null => { const v = Number(c.value); return isNaN(v) || v < 0 ? { nonNeg: true } : null; }]],
    originalPrice: [null as number | null],
    stock: [0, [Validators.required, (c: AbstractControl): ValidationErrors | null => { const v = Number(c.value); return isNaN(v) || v < 0 ? { nonNeg: true } : null; }]],
    weight: ['250g', Validators.required],
    scaScore: [85, [Validators.required]],
    imageUrl: ['', Validators.required],
    badge: [''],
    tastingNotesStr: [''],
    description: ['', Validators.required],
    isFeatured: [false],
    isNew: [false],
  });
  readonly productColumns: TableColumn<Product>[] = [
    { key: 'product', header: 'Producto' },
    { key: 'origin', header: 'Origen / Proceso' },
    { key: 'price', header: 'Precio', class: 'whitespace-nowrap' },
    { key: 'stock', header: 'Stock', class: 'whitespace-nowrap' },
    { key: 'scaScore', header: 'SCA', class: 'font-mono text-xs' },
    { key: 'status', header: 'Estado', class: 'whitespace-nowrap' },
    { key: 'actions', header: 'Acciones', class: 'whitespace-nowrap' },
  ];

  readonly rowClass = (p: Product) => (p.stock === 0 ? 'bg-red-50' : '');
  protected readonly icons = { Pencil, Trash2, ChevronLeft, ChevronRight, Search, Package };
  isFieldInvalid(f: string): boolean { return !!this.productForm.get(f)?.invalid; }
  isFieldTouched(f: string): boolean { return !!this.productForm.get(f)?.touched; }

  onSearch(e: Event): void { this.searchQuery.set((e.target as HTMLInputElement).value); this.currentPage.set(0); }
  onFilterProcess(value: string): void { this.filterProcess.set(value); this.currentPage.set(0); }
  onFilterStock(value: 'all' | 'low' | 'out'): void { this.filterStock.set(value); this.currentPage.set(0); }
  clearFilters(): void { this.searchQuery.set(''); this.filterProcess.set(''); this.filterStock.set('all'); this.currentPage.set(0); }
  prevPage(): void { if (this.currentPage() > 0) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages() - 1) this.currentPage.update(p => p + 1); }

  openAddModal(): void { this.editingProduct.set(null); this.productForm.reset({ stock: 0, price: 0, scaScore: 85, weight: '250g', isFeatured: false, isNew: false }); this.formError.set(null); this.showModal.set(true); }
  openEditModal(p: Product): void { this.editingProduct.set(p); this.productForm.patchValue({ ...p, tastingNotesStr: p.tastingNotes.join(', '), originalPrice: p.originalPrice ?? null }); this.formError.set(null); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); this.productForm.reset(); }

  submitForm(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) { this.formError.set('Corrige los campos con error antes de continuar.'); return; }
    this.formError.set(null); this.isSaving.set(true);
    const raw = this.productForm.getRawValue();
    const payload: Omit<Product, 'id'> = {
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

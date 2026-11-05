import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbBadge, NbButton, NbChip, NbDisplay, NbSelect, NbSelectOption, NbSelectValue,
  NbStatusDot, NbSurface, NbText,
} from '@ng-brutalism/ui';
import {
  LucideAngularModule,
  ArrowRight, Award, CircleCheck, Coffee, Mountain, Package, ShoppingCart, X,
} from 'lucide-angular';

import { NavbarComponent } from '../../layouts/public-layout/navbar/navbar';
import { FooterComponent } from '../../layouts/public-layout/footer/footer';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import {
  CatalogFilterOption,
  CatalogFiltersComponent,
} from '../../shared/components/catalog-filters/catalog-filters';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'score-desc' | 'name-asc';

interface ActiveFilter {
  key: string;
  label: string;
  clear: () => void;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    RouterLink,
    NbBadge, NbButton, NbChip, NbDisplay, NbSelect, NbSelectOption,
    NbStatusDot, NbSurface, NbText,
    LucideAngularModule,
    NavbarComponent, FooterComponent,
    ProductGridComponent, EmptyStateComponent, CatalogFiltersComponent,
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPageComponent {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchQuery = signal('');
  readonly selectedProcess = signal('all');
  readonly selectedRoast = signal('all');
  readonly selectedOrigin = signal('all');
  readonly inStockOnly = signal(false);
  readonly sortBy = signal<SortOption>('featured');
  readonly lastAdded = signal<Product | null>(null);

  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly icons = {
    ArrowRight, Award, CircleCheck, Coffee, Mountain, Package, ShoppingCart, X,
  };

  readonly sortOptions: CatalogFilterOption[] = [
    { value: 'featured', label: 'Destacados primero' },
    { value: 'price-asc', label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' },
    { value: 'score-desc', label: 'Mejor puntuación SCA' },
    { value: 'name-asc', label: 'Nombre A-Z' },
  ];

  readonly processOptions = computed<CatalogFilterOption[]>(() => [
    { value: 'all', label: 'Todos los procesos' },
    ...this.uniqueSorted(this.productService.products().map((p) => p.process))
      .map((process) => ({ value: process, label: process })),
  ]);

  readonly roastOptions = computed<CatalogFilterOption[]>(() => [
    { value: 'all', label: 'Todos los tuestes' },
    ...this.uniqueSorted(this.productService.products().map((p) => p.roastLevel))
      .map((roast) => ({ value: roast, label: roast })),
  ]);

  readonly originOptions = computed<CatalogFilterOption[]>(() => [
    { value: 'all', label: 'Todos los orígenes' },
    ...this.uniqueSorted(this.productService.products().map((p) => p.origin))
      .map((origin) => ({ value: origin, label: origin })),
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

    if (this.selectedProcess() !== 'all') {
      filters.push({
        key: 'process',
        label: this.selectedProcess(),
        clear: () => this.selectedProcess.set('all'),
      });
    }

    if (this.selectedRoast() !== 'all') {
      filters.push({
        key: 'roast',
        label: this.selectedRoast(),
        clear: () => this.selectedRoast.set('all'),
      });
    }

    if (this.selectedOrigin() !== 'all') {
      filters.push({
        key: 'origin',
        label: this.selectedOrigin(),
        clear: () => this.selectedOrigin.set('all'),
      });
    }

    if (this.inStockOnly()) {
      filters.push({
        key: 'stock',
        label: 'Solo disponibles',
        clear: () => this.inStockOnly.set(false),
      });
    }

    return filters;
  });

  readonly activeFilterCount = computed(() => this.activeFilters().length);

  readonly filteredProducts = computed(() => {
    const query = this.normalize(this.searchQuery().trim());
    const process = this.selectedProcess();
    const roast = this.selectedRoast();
    const origin = this.selectedOrigin();
    const inStockOnly = this.inStockOnly();

    return this.productService
      .products()
      .filter((product) => {
        const matchesQuery =
          !query ||
          this.normalize(
            [
              product.name,
              product.variety,
              product.origin,
              product.process,
              product.roastLevel,
              product.description,
              ...product.tastingNotes,
            ].join(' ')
          ).includes(query);

        return (
          matchesQuery &&
          (process === 'all' || product.process === process) &&
          (roast === 'all' || product.roastLevel === roast) &&
          (origin === 'all' || product.origin === origin) &&
          (!inStockOnly || product.stock > 0)
        );
      })
      .sort((a, b) => this.compareProducts(a, b));
  });

  readonly catalogStats = computed(() => {
    const products = this.productService.products();
    return {
      total: products.length,
      origins: new Set(products.map((p) => p.origin)).size,
      topScore: products.length
        ? Math.max(...products.map((p) => p.scaScore)).toFixed(1)
        : '—',
    };
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onProcessChange(value: string): void {
    this.selectedProcess.set(value || 'all');
  }

  onRoastChange(value: string): void {
    this.selectedRoast.set(value || 'all');
  }

  onOriginChange(value: string): void {
    this.selectedOrigin.set(value || 'all');
  }

  onStockOnlyChange(value: boolean): void {
    this.inStockOnly.set(value);
  }

  onSortChange(value: NbSelectValue | null): void {
    const sort = value != null ? String(value) : 'featured';
    const valid: SortOption[] = ['featured', 'price-asc', 'price-desc', 'score-desc', 'name-asc'];
    this.sortBy.set(valid.includes(sort as SortOption) ? (sort as SortOption) : 'featured');
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedProcess.set('all');
    this.selectedRoast.set('all');
    this.selectedOrigin.set('all');
    this.inStockOnly.set(false);
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product, 1);
    this.lastAdded.set(product);

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => this.lastAdded.set(null), 3200);
  }

  private compareProducts(a: Product, b: Product): number {
    switch (this.sortBy()) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'score-desc':
        return b.scaScore - a.scaScore;
      case 'name-asc':
        return a.name.localeCompare(b.name, 'es');
      case 'featured':
      default:
        return (
          Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false) ||
          b.scaScore - a.scaScore
        );
    }
  }

  private uniqueSorted(values: string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'es'));
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}

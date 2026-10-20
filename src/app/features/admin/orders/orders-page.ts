import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbBadge, NbButton } from '@ng-brutalism/ui';
import type { NbToneToken } from '@ng-brutalism/ui';

import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import {
  DataTableComponent,
  DataTableCellDirective,
  TableColumn
} from '../../../shared/components/data-table/data-table';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge/order-status-badge.component';
import { Product } from '../../../core/models/product.model';

const PAGE_SIZE = 8;

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  'Pendiente': 'Tostando',
  'Tostando': 'Enviado',
  'Enviado': 'Entregado',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  'Pendiente': '🔥 Tostar',
  'Tostando': '📦 Enviar',
  'Enviado': '✓ Entregar',
};

const NEXT_TONE: Partial<Record<OrderStatus, NbToneToken>> = {
  'Pendiente': 'accent',
  'Tostando': 'primary',
  'Enviado': 'success',
};

const TERMINAL_STATUSES: OrderStatus[] = ['Entregado', 'Cancelado'];

const ALL_STATUSES: OrderStatus[] = ['Pendiente', 'Tostando', 'Enviado', 'Entregado', 'Cancelado'];

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    NbBadge,
    NbButton,
    DataTableComponent,
    StatCardComponent,
    ModalComponent,
    ConfirmDialogComponent,
    OrderStatusBadgeComponent,
    DataTableCellDirective
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-200">

      <!-- PAGE HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-koko-espresso/20 gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-koko-caramel"></span>
            <span class="text-xs font-mono uppercase tracking-widest font-bold text-koko-caramel">Panel Admin · Pedidos</span>
          </div>
          <h1 class="font-display font-black text-2xl sm:text-3xl text-koko-espresso tracking-tight">Gestión de Pedidos</h1>
          <p class="text-xs sm:text-sm text-koko-coffee/80 mt-1 max-w-xl">Consulta y administra los pedidos de los clientes de KOKOFEE.</p>
        </div>
      </div>

      <!-- STATS -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <app-stat-card title="Total Pedidos" [value]="totalOrders().toString()" icon="Package" />
        <app-stat-card title="Pedidos Activos" [value]="activeOrdersCount().toString()" icon="Package" />
        <app-stat-card title="Ingresos Totales" [value]="formattedRevenue()" icon="Package" />
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="flex flex-col sm:flex-row gap-3 flex-wrap">
        <!-- Search input -->
        <div class="relative flex-1 min-w-50">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-koko-muted text-sm pointer-events-none">🔍</span>
          <input
            type="search"
            id="orders-search"
            placeholder="Buscar por nº de pedido o cliente..."
            [value]="searchQuery()"
            (input)="onSearch($event)"
            class="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-koko-espresso rounded-lg bg-white shadow-[2px_2px_0px_#1A120B] font-sans focus:outline-none"
          />
        </div>

        <!-- Status filter buttons -->
        <div class="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            (click)="setStatusFilter('')"
            [class]="selectedStatus() === '' ? activeFilterClass : inactiveFilterClass"
          >
            Todos
          </button>
          @for (s of allStatuses; track s) {
            <button
              type="button"
              (click)="setStatusFilter(s)"
              [class]="selectedStatus() === s ? activeFilterClass : inactiveFilterClass"
            >
              {{ s }}
            </button>
          }
        </div>

        <!-- Clear filters -->
        @if (searchQuery() || selectedStatus()) {
          <button
            type="button"
            (click)="clearFilters()"
            class="text-[11px] font-mono font-bold text-koko-caramel hover:underline self-center whitespace-nowrap"
          >
            Limpiar filtros ×
          </button>
        }
      </div>

      <!-- TABLE -->
      <app-data-table heading="Ultimos pedidos" subtitle="Ulitmas compras registradas en la tienda" [columns]="orderColumns" [rows]="orderService.recentOrders()">
         <ng-template appCell="order" let-order>
          <div class="font-mono font-bold text-xs text-koko-espresso">{{ order.orderNumber }}</div>
          <div class="text-xs text-koko-muted truncate max-w-35">{{ order.customerName }}</div>
        </ng-template>

        <ng-template appCell="items" let-order>
          <div class="text-xs font-semibold text-koko-roast truncate max-w-45">
            {{ order.items[0]?.productName }}
          </div>
          <div class="text-xs font-mono text-koko-muted">
            {{ order.items[0]?.quantity }}x {{ order.items[0]?.weight }}
            @if (order.items.length > 1) { <span>(+{{ order.items.length - 1 }} más)</span> }
          </div>
        </ng-template>

        <ng-template appCell="total" let-order>{{ order.total | currency }}</ng-template>

        <ng-template appCell="status" let-order>
          <span nbBadge [tone]="getStatusBadgeTone(order.status)"
                class="text-xs font-bold uppercase tracking-wider font-mono py-0.5 px-2">
            {{ order.status }}
          </span>
        </ng-template>

        <ng-template appCell="actions" let-order>
          @switch (order.status) {
            @case ('Pendiente') {
              <button nbButton tone="warning" size="sm" class="text-xs font-bold"
                      (click)="advanceOrderStatus(order, 'Tostando')">
                <span aria-hidden="true">🔥</span> Tostar
              </button>
            }
            @case ('Tostando') {
              <button nbButton tone="accent" size="sm" class="text-xs font-bold"
                      (click)="advanceOrderStatus(order, 'Enviado')">
                <span aria-hidden="true">📦</span> Enviar
              </button>
            }
            @case ('Enviado') {
              <button nbButton tone="success" size="sm" class="text-xs font-bold"
                      (click)="advanceOrderStatus(order, 'Entregado')">
                <span aria-hidden="true">✓</span> Entregar
              </button>
            }
            @default {
              <span class="text-xs font-mono text-koko-sage font-bold">Completado</span>
            }
          }
        </ng-template>

        <div table-footer class="p-3 border-t-2 flex items-center justify-between text-xs font-mono">
          <span>Mostrando últimos {{ orderService.recentOrders().length }} pedidos</span>
          <a routerLink="/admin/pedidos" class="font-bold hover:underline">Ver listado completo →</a>
        </div>
      </app-data-table>

      <!-- ORDER DETAIL MODAL -->
      @if (showModal()) {
        <app-modal
          title="Detalle del Pedido"
          tag="Gestión de Pedidos"
          maxWidthClass="max-w-3xl"
          (close)="closeModal()"
        >
          @if (selectedOrder(); as order) {
            <div class="space-y-6">

              <!-- Order number + status -->
              <div class="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p class="text-[10px] font-mono uppercase tracking-widest text-koko-muted mb-1">Número de pedido</p>
                  <p class="font-mono font-bold text-xl text-koko-espresso">{{ order.orderNumber }}</p>
                </div>
                <app-order-status-badge [status]="order.status" />
              </div>

              <!-- Customer & order info grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-koko-cream/40 border-2 border-koko-espresso/20 rounded-xl p-4 space-y-3">
                  <p class="text-[10px] font-mono uppercase tracking-widest font-bold text-koko-caramel">Datos del cliente</p>
                  <div>
                    <p class="text-[10px] font-mono text-koko-muted">Nombre</p>
                    <p class="text-sm font-bold text-koko-espresso">{{ order.customerName }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-koko-muted">Correo electrónico</p>
                    <p class="text-xs font-mono text-koko-espresso break-all">{{ order.customerEmail }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-koko-muted">Dirección de envío</p>
                    <p class="text-xs text-koko-espresso">{{ order.shippingAddress }}</p>
                  </div>
                </div>
                <div class="bg-koko-cream/40 border-2 border-koko-espresso/20 rounded-xl p-4 space-y-3">
                  <p class="text-[10px] font-mono uppercase tracking-widest font-bold text-koko-caramel">Datos del pedido</p>
                  <div>
                    <p class="text-[10px] font-mono text-koko-muted">Fecha</p>
                    <p class="text-xs font-mono text-koko-espresso">{{ order.createdAt }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-koko-muted">Estado de pago</p>
                    <span
                      nbBadge
                      [tone]="order.paymentStatus === 'Pagado' ? 'success' : 'warning'"
                      class="text-[10px] font-bold font-mono py-0.5 px-2"
                    >
                      {{ order.paymentStatus }}
                    </span>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono text-koko-muted">Total</p>
                    <p class="font-mono font-black text-lg text-koko-espresso">\${{ order.total.toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Items table -->
              <div class="border-2 border-koko-espresso rounded-xl overflow-hidden">
                <div class="bg-koko-espresso px-4 py-2.5">
                  <p class="text-[11px] font-mono font-bold uppercase tracking-wider text-koko-cream">Productos del pedido</p>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead class="bg-koko-cream/60 border-b-2 border-koko-espresso/20">
                      <tr>
                        <th class="py-2 px-4 font-mono font-bold text-[11px] text-koko-espresso uppercase tracking-wider">Producto</th>
                        <th class="py-2 px-4 font-mono font-bold text-[11px] text-koko-espresso uppercase tracking-wider">Variedad</th>
                        <th class="py-2 px-4 font-mono font-bold text-[11px] text-koko-espresso uppercase tracking-wider">Gramaje</th>
                        <th class="py-2 px-4 font-mono font-bold text-[11px] text-koko-espresso uppercase tracking-wider text-center">Cant.</th>
                        <th class="py-2 px-4 font-mono font-bold text-[11px] text-koko-espresso uppercase tracking-wider text-right">P. Unit.</th>
                        <th class="py-2 px-4 font-mono font-bold text-[11px] text-koko-espresso uppercase tracking-wider text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-koko-espresso/10 bg-white">
                      @for (item of order.items; track item.productName) {
                        <tr class="hover:bg-koko-cream/30 transition-colors">
                          <td class="py-3 px-4 font-bold text-koko-espresso leading-tight max-w-40">{{ item.productName }}</td>
                          <td class="py-3 px-4 text-koko-muted font-mono">{{ item.variety }}</td>
                          <td class="py-3 px-4 font-mono text-koko-muted whitespace-nowrap">{{ item.weight }}</td>
                          <td class="py-3 px-4 font-mono font-bold text-center text-koko-espresso">{{ item.quantity }}</td>
                          <td class="py-3 px-4 font-mono text-right text-koko-espresso whitespace-nowrap">\${{ item.unitPrice.toFixed(2) }}</td>
                          <td class="py-3 px-4 font-mono font-bold text-right text-koko-espresso whitespace-nowrap">\${{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
                        </tr>
                      }
                    </tbody>
                    <tfoot class="border-t-2 border-koko-espresso/20 bg-koko-cream/40">
                      <tr>
                        <td colspan="5" class="py-3 px-4 font-mono font-bold text-right text-koko-espresso text-xs uppercase tracking-wider">Total del pedido</td>
                        <td class="py-3 px-4 font-mono font-black text-right text-koko-espresso whitespace-nowrap">\${{ order.total.toFixed(2) }}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- Admin actions -->
              <div class="border-2 border-koko-espresso/20 rounded-xl p-4 space-y-3">
                <p class="text-[10px] font-mono uppercase tracking-widest font-bold text-koko-caramel">Acciones administrativas</p>

                @if (isTerminalStatus(order.status)) {
                  <p class="text-sm text-koko-muted font-sans flex items-center gap-2">
                    <span class="text-base">ℹ️</span>
                    Este pedido está en estado final y no admite más acciones.
                  </p>
                } @else {
                  <div class="flex flex-wrap gap-3">
                    <!-- Advance to next status -->
                    @if (nextStatusFor(order.status)) {
                      <button
                        nbButton
                        [tone]="nextToneFor(order.status)"
                        size="sm"
                        type="button"
                        (click)="advanceStatus(order)"
                        class="font-bold text-xs shadow-[2px_2px_0px_#1A120B]"
                      >
                        {{ nextLabelFor(order.status) }}
                      </button>
                    }

                    <!-- Cancel order -->
                    <button
                      nbButton
                      tone="danger"
                      size="sm"
                      type="button"
                      (click)="requestCancel(order)"
                      class="font-bold text-xs shadow-[2px_2px_0px_#1A120B]"
                    >
                      🚫 Cancelar pedido
                    </button>
                  </div>
                }
              </div>

            </div>
          }

          <!-- Modal footer -->
          <div modal-footer class="flex justify-end">
            <button nbButton tone="cream" size="sm" type="button" (click)="closeModal()" class="font-mono text-xs font-bold">
              Cerrar
            </button>
          </div>
        </app-modal>
      }

      <!-- CONFIRM CANCEL DIALOG -->
      @if (showConfirm()) {
        <app-confirm-dialog
          title="Cancelar pedido"
          [message]="'¿Estás seguro de que deseas cancelar el pedido ' + (orderToCancel()?.orderNumber ?? '') + '? Esta acción no se puede deshacer.'"
          confirmLabel="Sí, cancelar"
          cancelLabel="No, volver"
          (confirmed)="confirmCancel()"
          (cancelled)="showConfirm.set(false)"
        />
      }

    </div>
  `,
})
export class AdminOrdersPage {
  getStatusBadgeTone(arg0: any): NbToneToken | undefined {
    throw new Error('Method not implemented.');
  }
  advanceOrderStatus(_t58: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
  private readonly orderService = inject(OrderService);

  readonly allStatuses = ALL_STATUSES;

  // Filter / search signals
  readonly searchQuery = signal('');
  readonly selectedStatus = signal<OrderStatus | ''>('');
  readonly currentPage = signal(0);

  // Modal signals
  readonly showModal = signal(false);
  readonly selectedOrder = signal<Order | null>(null);

  // Confirm dialog signals
  readonly showConfirm = signal(false);
  readonly orderToCancel = signal<Order | null>(null);

  // CSS helpers for filter buttons
  readonly activeFilterClass = 'px-3 py-1.5 text-[11px] font-mono font-bold border-2 border-koko-espresso rounded-lg bg-koko-espresso text-koko-cream shadow-[2px_2px_0px_#1A120B] cursor-pointer';
  readonly inactiveFilterClass = 'px-3 py-1.5 text-[11px] font-mono font-bold border-2 border-koko-espresso rounded-lg bg-white text-koko-espresso hover:bg-koko-cream/60 cursor-pointer';

  readonly tableHeaders = ['Pedido', 'Cliente', 'Fecha', 'Items', 'Total', 'Pago', 'Estado', 'Acciones'];
  readonly orderColumns: TableColumn<Order>[] = [
    { key: 'order', header: 'Orden / Cliente' },
    { key: 'items', header: 'Granos & Formato' },
    { key: 'total', header: 'Total', class: 'font-mono font-bold text-xs whitespace-nowrap' },
    { key: 'status', header: 'Estado', class: 'whitespace-nowrap' },
    { key: 'createdAt', header: 'Fecha', class: 'font-mono text-xs text-koko-muted whitespace-nowrap' },
    { key: 'actions', header: 'Acción', class: 'whitespace-nowrap' },
  ];

  readonly productColumns: TableColumn<Product>[] = [
    { key: 'product', header: 'Producto' },
    { key: 'origin', header: 'Origen / Proceso' },
    { key: 'price', header: 'Precio', class: 'whitespace-nowrap' },
    { key: 'stock', header: 'Stock', class: 'whitespace-nowrap' },
    { key: 'scaScore', header: 'SCA', class: 'font-mono text-xs' },
    { key: 'status', header: 'Estado', class: 'whitespace-nowrap' },
    { key: 'actions', header: 'Acciones', class: 'whitespace-nowrap' },
  ];
  // Stats
  readonly totalOrders = computed(() => this.orderService.orders().length);
  readonly activeOrdersCount = computed(() => this.orderService.pendingOrdersCount());
  readonly formattedRevenue = computed(() => '$' + this.orderService.totalRevenue().toFixed(2));

  // Filtered list
  readonly filteredOrders = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const st = this.selectedStatus();
    return this.orderService.orders().filter((o) => {
      const matchesSearch = !q || o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
      const matchesStatus = !st || o.status === st;
      return matchesSearch && matchesStatus;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredOrders().length / PAGE_SIZE)));
  readonly pagedOrders = computed(() => {
    const start = this.currentPage() * PAGE_SIZE;
    return this.filteredOrders().slice(start, start + PAGE_SIZE);
  });
  readonly tableSubtitle = computed(() => `Mostrando ${this.pagedOrders().length} de ${this.filteredOrders().length} pedidos`);

  // Filter controls
  onSearch(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
    this.currentPage.set(0);
  }

  setStatusFilter(status: OrderStatus | ''): void {
    this.selectedStatus.set(status);
    this.currentPage.set(0);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedStatus.set('');
    this.currentPage.set(0);
  }

  prevPage(): void { if (this.currentPage() > 0) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages() - 1) this.currentPage.update(p => p + 1); }

  // Modal
  openDetail(order: Order): void {
    this.selectedOrder.set(order);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedOrder.set(null);
  }

  // Status helpers
  isTerminalStatus(status: OrderStatus): boolean {
    return TERMINAL_STATUSES.includes(status);
  }

  nextStatusFor(status: OrderStatus): OrderStatus | undefined {
    return NEXT_STATUS[status];
  }

  nextLabelFor(status: OrderStatus): string {
    return NEXT_LABEL[status] ?? '';
  }

  nextToneFor(status: OrderStatus): NbToneToken {
    return NEXT_TONE[status] ?? 'primary';
  }

  // Advance to next status
  advanceStatus(order: Order): void {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    this.orderService.updateOrderStatus(order.id, next);
    // Patch status locally so the modal reflects the change immediately,
    // without depending on the signal re-delivering the same object reference.
    this.selectedOrder.set({ ...order, status: next });
  }

  // Cancel flow
  requestCancel(order: Order): void {
    this.orderToCancel.set(order);
    this.showConfirm.set(true);
  }

  confirmCancel(): void {
    const order = this.orderToCancel();
    if (order) {
      this.orderService.updateOrderStatus(order.id, 'Cancelado');
      // Patch locally for immediate modal update.
      if (this.selectedOrder()?.id === order.id) {
        this.selectedOrder.set({ ...order, status: 'Cancelado' });
      }
    }
    this.showConfirm.set(false);
    this.orderToCancel.set(null);
  }
}

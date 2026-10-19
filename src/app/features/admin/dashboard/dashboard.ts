import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NbBadge, NbButton } from '@ng-brutalism/ui';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NbButton,
    NbBadge,
    StatCardComponent,
    DataTableComponent,
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-200">

      <!-- ============================================================== -->
      <!-- 1. PAGE HEADER: Title, Description & Main Action Buttons       -->
      <!-- ============================================================== -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-koko-espresso/20 gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-koko-caramel"></span>
            <span class="text-xs font-mono uppercase tracking-widest font-bold text-koko-caramel">
              Operaciones de Tostaduría
            </span>
          </div>
          <h1 class="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-koko-espresso tracking-tight">
            Dashboard de Control
          </h1>
          <p class="text-xs sm:text-sm text-koko-coffee/80 mt-1 max-w-2xl font-sans">
            Supervisión integral de pedidos recibidos, ciclos de tueste artesanal y existencias de microlotes en tiempo real.
          </p>
        </div>

        <!-- Header Actions -->
        <div class="flex flex-wrap items-center gap-3">
          <button
            nbButton
            tone="cream"
            size="sm"
            (click)="triggerExportNotice()"
            class="font-mono text-xs font-bold"
          >
            📥 Exportar Reporte
          </button>

          <button
            nbButton
            tone="primary"
            size="sm"
            (click)="triggerNewRoastNotice()"
            class="font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#1A120B]"
          >
            <span>+ Programar Tueste</span>
          </button>
        </div>
      </div>

      <!-- Action Toast Notice -->
      @if (actionNotice()) {
        <div
          class="p-3 bg-koko-espresso text-koko-cream border-2 border-koko-gold rounded-xl shadow-[3px_3px_0px_#C25E00] text-xs font-mono font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div class="flex items-center gap-2">
            <span class="text-koko-gold">ℹ</span>
            <span>{{ actionNotice() }}</span>
          </div>
          <button (click)="actionNotice.set(null)" class="text-koko-cream/60 hover:text-white p-1">
            ✕
          </button>
        </div>
      }

      <!-- ============================================================== -->
      <!-- 2. SUMMARY METRICS GRID (StatCardComponent Reused)            -->
      <!-- ============================================================== -->
      <section aria-label="Indicadores principales de la tostaduría">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Stat 1: Weekly Revenue -->
          <app-stat-card
            title="Ventas de la Semana"
            [value]="'\$' + orderService.totalRevenue().toFixed(2)"
            change="+18.2%"
            changeType="positive"
            subtitle="vs semana anterior"
            icon="💵"
          />

          <!-- Stat 2: Active Orders in Queue -->
          <app-stat-card
            title="Pedidos en Cola"
            [value]="orderService.pendingOrdersCount() + ' activos'"
            change="3 en tueste"
            changeType="neutral"
            subtitle="1 pendiente de pago"
            icon="☕"
          />

          <!-- Stat 3: Low Stock Alerts -->
          <app-stat-card
            title="Alertas de Stock"
            [value]="lowStockProducts().length + ' microlotes'"
            change="Crítico ≤ 15u"
            changeType="negative"
            subtitle="Necesitan tueste"
            icon="⚠️"
          />

          <!-- Stat 4: Average Quality Score -->
          <app-stat-card
            title="Calidad SCA Promedio"
            value="88.4 / 100"
            change="Cosecha 2026"
            changeType="positive"
            subtitle="Catado por Q-Graders"
            icon="★"
          />
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- 3. QUICK ACTION SHORTCUTS                                     -->
      <!-- ============================================================== -->
      <section aria-label="Acciones rápidas de gestión">
        <div class="p-4 bg-white border-2 border-koko-espresso rounded-xl shadow-[3px_3px_0px_#1A120B]">
          <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-koko-muted mb-3 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Accesos Rápidos de Administración</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a
              routerLink="/admin/pedidos"
              class="p-3 bg-koko-cream/60 hover:bg-white rounded-lg border-2 border-koko-espresso/30 hover:border-koko-espresso transition-all group flex flex-col justify-between"
            >
              <div class="text-xl mb-1 group-hover:scale-110 transition-transform">🛒</div>
              <span class="font-display font-bold text-xs text-koko-espresso">Gestionar Pedidos</span>
              <span class="text-[10px] font-mono text-koko-muted">Ver cola de despacho</span>
            </a>

            <a
              routerLink="/admin/inventario"
              class="p-3 bg-koko-cream/60 hover:bg-white rounded-lg border-2 border-koko-espresso/30 hover:border-koko-espresso transition-all group flex flex-col justify-between"
            >
              <div class="text-xl mb-1 group-hover:scale-110 transition-transform">📦</div>
              <span class="font-display font-bold text-xs text-koko-espresso">Control Inventario</span>
              <span class="text-[10px] font-mono text-koko-muted">Ajustar bolsas y lotes</span>
            </a>

            <a
              routerLink="/admin/recetas"
              class="p-3 bg-koko-cream/60 hover:bg-white rounded-lg border-2 border-koko-espresso/30 hover:border-koko-espresso transition-all group flex flex-col justify-between"
            >
              <div class="text-xl mb-1 group-hover:scale-110 transition-transform">📖</div>
              <span class="font-display font-bold text-xs text-koko-espresso">Publicar Receta</span>
              <span class="text-[10px] font-mono text-koko-muted">Nuevos ratios de filtro</span>
            </a>

            <a
              routerLink="/admin/resenas"
              class="p-3 bg-koko-cream/60 hover:bg-white rounded-lg border-2 border-koko-espresso/30 hover:border-koko-espresso transition-all group flex flex-col justify-between"
            >
              <div class="text-xl mb-1 group-hover:scale-110 transition-transform">⭐</div>
              <span class="font-display font-bold text-xs text-koko-espresso">Moderar Reseñas</span>
              <span class="text-[10px] font-mono text-koko-muted">Notas de cata clientes</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- 4. RECENT ORDERS & INVENTORY STATUS (Two-column layout)        -->
      <!-- ============================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Left Column: Recent Orders Table (8 cols on lg) -->
        <div class="lg:col-span-8 space-y-4">
          <app-data-table
            title="Pedidos Recientes de la Tostaduría"
            subtitle="Últimas compras registradas en la tienda pública"
            [headers]="['Orden / Cliente', 'Granos & Formato', 'Total', 'Estado', 'Fecha', 'Acción']"
            [isEmpty]="orderService.recentOrders().length === 0"
          >
            <!-- Table Action Slot -->
            <div table-actions class="flex items-center gap-2">
              <span class="text-xs font-mono text-koko-muted">
                {{ orderService.orders().length }} pedidos totales
              </span>
            </div>

            <!-- Table Rows Slot -->
            <ng-container table-rows>
              @for (order of orderService.recentOrders(); track order.id) {
                <tr class="hover:bg-koko-cream/40 transition-colors">
                  <!-- Order Number & Customer -->
                  <td class="py-3 px-4">
                    <div class="font-mono font-bold text-xs text-koko-espresso">
                      {{ order.orderNumber }}
                    </div>
                    <div class="text-xs text-koko-muted font-sans truncate max-w-[140px]">
                      {{ order.customerName }}
                    </div>
                  </td>

                  <!-- Items Summary -->
                  <td class="py-3 px-4">
                    <div class="text-xs font-semibold text-koko-roast truncate max-w-[180px]">
                      {{ order.items[0].productName }}
                    </div>
                    <div class="text-[11px] font-mono text-koko-muted">
                      {{ order.items[0].quantity }}x {{ order.items[0].weight }}
                      @if (order.items.length > 1) {
                        <span> (+{{ order.items.length - 1 }} más)</span>
                      }
                    </div>
                  </td>

                  <!-- Total -->
                  <td class="py-3 px-4 font-mono font-bold text-xs text-koko-espresso whitespace-nowrap">
                    \${{ order.total.toFixed(2) }}
                  </td>

                  <!-- Status with Badge -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span
                      nbBadge
                      [tone]="getStatusBadgeTone(order.status)"
                      class="text-[11px] font-bold uppercase tracking-wider font-mono py-0.5 px-2"
                    >
                      {{ order.status }}
                    </span>
                  </td>

                  <!-- Date -->
                  <td class="py-3 px-4 font-mono text-xs text-koko-muted whitespace-nowrap">
                    {{ order.createdAt }}
                  </td>

                  <!-- Action: Advance Status -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    @if (order.status === 'Pendiente') {
                      <button
                        nbButton
                        tone="warning"
                        size="sm"
                        (click)="advanceOrderStatus(order, 'Tostando')"
                        class="text-[11px] py-1 px-2 font-bold"
                        title="Iniciar tueste del pedido"
                      >
                        🔥 Tostar
                      </button>
                    } @else if (order.status === 'Tostando') {
                      <button
                        nbButton
                        tone="accent"
                        size="sm"
                        (click)="advanceOrderStatus(order, 'Enviado')"
                        class="text-[11px] py-1 px-2 font-bold"
                        title="Marcar pedido como enviado"
                      >
                        📦 Enviar
                      </button>
                    } @else if (order.status === 'Enviado') {
                      <button
                        nbButton
                        tone="success"
                        size="sm"
                        (click)="advanceOrderStatus(order, 'Entregado')"
                        class="text-[11px] py-1 px-2 font-bold"
                        title="Confirmar entrega"
                      >
                        ✓ Entregar
                      </button>
                    } @else {
                      <span class="text-xs font-mono text-koko-sage font-bold">Completado</span>
                    }
                  </td>
                </tr>
              }
            </ng-container>

            <!-- Table Footer Slot -->
            <div table-footer class="p-3 border-t-2 border-koko-espresso/15 bg-koko-cream/30 flex items-center justify-between text-xs font-mono">
              <span class="text-koko-muted">Mostrando últimos 5 pedidos</span>
              <a
                routerLink="/admin/pedidos"
                class="font-bold text-koko-caramel hover:text-koko-roast hover:underline"
              >
                Ver listado completo →
              </a>
            </div>
          </app-data-table>
        </div>

        <!-- Right Column: Low Stock Critical Inventory (4 cols on lg) -->
        <div class="lg:col-span-4 space-y-4">
          <div class="bg-white border-2 border-koko-espresso rounded-xl shadow-[4px_4px_0px_#1A120B] p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b-2 border-koko-espresso/20">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-koko-danger animate-pulse"></span>
                <h3 class="font-display font-bold text-base text-koko-espresso">
                  Stock de Microlotes
                </h3>
              </div>
              <span class="text-[11px] font-mono text-koko-danger font-bold uppercase">
                Alerta Crítica
              </span>
            </div>

            <p class="text-xs text-koko-coffee/80 leading-relaxed">
              Cafés con menos de 15 bolsas disponibles. Se recomienda programar tueste en el siguiente ciclo semanal.
            </p>

            <!-- Low Stock Items List -->
            <div class="space-y-3.5">
              @for (product of lowStockProducts(); track product.id) {
                <div class="p-3 bg-koko-cream/60 border border-koko-border-subtle rounded-lg space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h4 class="font-display font-bold text-xs text-koko-espresso leading-tight">
                        {{ product.name }}
                      </h4>
                      <span class="text-[10px] font-mono text-koko-muted">
                        {{ product.origin }} · {{ product.process }}
                      </span>
                    </div>

                    <span
                      nbBadge
                      tone="danger"
                      class="text-[10px] font-bold font-mono py-0.5 px-1.5 shrink-0"
                    >
                      {{ product.stock }} bolsas
                    </span>
                  </div>

                  <!-- Progress Bar for Stock Level -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-[10px] font-mono text-koko-muted">
                      <span>Nivel de existencias</span>
                      <span class="font-bold text-koko-danger">{{ calculateStockPercentage(product.stock) }}%</span>
                    </div>
                    <div class="w-full h-2 bg-koko-cream rounded-full overflow-hidden border border-koko-espresso/30">
                      <div
                        class="h-full bg-koko-caramel transition-all duration-500 rounded-full"
                        [style.width.%]="calculateStockPercentage(product.stock)"
                      ></div>
                    </div>
                  </div>

                  <div class="pt-1 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-koko-muted">Puntos SCA: {{ product.scaScore }}</span>
                    <button
                      nbButton
                      tone="cream"
                      size="sm"
                      (click)="restockCoffee(product)"
                      class="text-[10px] py-0.5 px-2 font-mono font-bold"
                    >
                      + Tostar Lote
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Roasting Schedule Note -->
            <div class="p-3 bg-koko-espresso text-koko-cream rounded-lg text-[11px] font-mono space-y-1">
              <div class="flex items-center gap-1.5 text-koko-gold font-bold uppercase text-[10px]">
                <span>📅 Próximo ciclo de tueste:</span>
              </div>
              <p class="text-koko-cream/80 text-[10px]">
                Lunes 08:00 AM · Lote Maestro #09 (Geisha & Yirgacheffe)
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
})
export class AdminDashboardPage {
  readonly orderService = inject(OrderService);
  readonly productService = inject(ProductService);

  protected readonly actionNotice = signal<string | null>(null);

  // Products with low stock (15 bags or less)
  readonly lowStockProducts = computed(() =>
    this.productService.products().filter((p) => p.stock <= 15)
  );

  getStatusBadgeTone(status: OrderStatus): 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'cream' {
    switch (status) {
      case 'Pendiente':
        return 'warning';
      case 'Tostando':
        return 'accent';
      case 'Enviado':
        return 'primary';
      case 'Entregado':
        return 'success';
      case 'Cancelado':
        return 'danger';
      default:
        return 'cream';
    }
  }

  calculateStockPercentage(stock: number): number {
    // Assume normal batch threshold is 30 bags
    return Math.min(100, Math.round((stock / 30) * 100));
  }

  advanceOrderStatus(order: Order, nextStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, nextStatus);
    this.actionNotice.set(
      `El pedido ${order.orderNumber} (${order.customerName}) ha sido actualizado al estado "${nextStatus}".`
    );
  }

  restockCoffee(product: Product): void {
    this.actionNotice.set(
      `Se ha programado una curva de tueste de 15kg para "${product.name}". Se notificará al finalizar reposo.`
    );
  }

  triggerNewRoastNotice(): void {
    this.actionNotice.set(
      'Módulo de curva de tueste activado: Selecciona perfil térmico para registrar lote #09.'
    );
  }

  triggerExportNotice(): void {
    this.actionNotice.set(
      'Reporte semanal de pedidos e inventario generado en formato CSV/PDF para descarga.'
    );
  }
}

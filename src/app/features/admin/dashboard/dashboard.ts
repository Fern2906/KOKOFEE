import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NbBadge, NbButton } from '@ng-brutalism/ui';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { Product } from '../../../core/models/product.model';
import { Alert } from '../../../shared/components/alert/alert';
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
    Alert
],
  templateUrl: './dashboard.html',
})
export class AdminDashboardPage {
  readonly orderService = inject(OrderService);
  readonly productService = inject(ProductService);

  protected readonly actionNotice = signal<string | null>(null);

  readonly lowStockProducts = computed(() =>
    this.productService.products().filter((p) => p.stock <= 15)
  );

  readonly quickLinks = [
    { path: '/admin/pedidos',    emoji: '🛒', title: 'Gestionar Pedidos', hint: 'Ver cola de despacho' },
    { path: '/admin/inventario', emoji: '📦', title: 'Control Inventario', hint: 'Ajustar bolsas y lotes' },
    { path: '/admin/recetas',    emoji: '📖', title: 'Publicar Receta',    hint: 'Nuevos ratios de filtro' },
    { path: '/admin/resenas',    emoji: '⭐', title: 'Moderar Reseñas',    hint: 'Notas de cata clientes' },
  ] as const;

  readonly orderColumns: TableColumn<Order>[] = [
    { key: 'order',     header: 'Orden / Cliente' },
    { key: 'items',     header: 'Granos & Formato' },
    { key: 'total',     header: 'Total',  class: 'font-mono font-bold text-xs whitespace-nowrap' },
    { key: 'status',    header: 'Estado', class: 'whitespace-nowrap' },
    { key: 'createdAt', header: 'Fecha',  class: 'font-mono text-xs text-koko-muted whitespace-nowrap' },
    { key: 'actions',   header: 'Acción', class: 'whitespace-nowrap' },
  ];

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

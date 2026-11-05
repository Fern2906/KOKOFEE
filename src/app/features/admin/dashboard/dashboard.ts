import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NbBadge, NbButton } from '@ng-brutalism/ui';
import { LucideAngularModule, ShoppingCart, Package, BookOpen, Star, Flame, Check, Zap } from 'lucide-angular';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { DataTableComponent, DataTableCellDirective, TableColumn } from '../../../shared/components/data-table/data-table';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { Alert } from '../../../shared/components/alert/alert';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterLink,
    NbButton,
    NbBadge,
    LucideAngularModule,
    StatCardComponent,
    DataTableComponent,
    DataTableCellDirective,
    Alert
  ],
  templateUrl: './dashboard.html',
})
export class AdminDashboardPage {
  readonly orderService = inject(OrderService);
  readonly productService = inject(ProductService);

  protected readonly actionNotice = signal<string | null>(null);

  protected readonly icons = { ShoppingCart, Package, BookOpen, Star, Flame, Check, Zap };

  readonly lowStockProducts = computed(() =>
    this.productService.products().filter((p) => p.stock <= 15)
  );

  readonly quickLinks = [
    { path: '/admin/pedidos', icon: ShoppingCart, title: 'Gestionar Pedidos', hint: 'Ver cola de despacho' },
    { path: '/admin/inventario', icon: Package, title: 'Control Inventario', hint: 'Ajustar bolsas y lotes' },
    { path: '/admin/recetas', icon: BookOpen, title: 'Publicar Receta', hint: 'Nuevos ratios de filtro' },
    { path: '/admin/resenas', icon: Star, title: 'Moderar Reseñas', hint: 'Notas de cata clientes' },
  ];

  readonly orderColumns: TableColumn<Order>[] = [
    { key: 'order', header: 'Orden / Cliente' },
    { key: 'items', header: 'Granos & Formato' },
    { key: 'total', header: 'Total', class: 'font-mono font-bold text-xs whitespace-nowrap' },
    { key: 'status', header: 'Estado', class: 'whitespace-nowrap' },
    { key: 'createdAt', header: 'Fecha', class: 'font-mono text-xs text-koko-muted whitespace-nowrap' },
    { key: 'actions', header: 'Acción', class: 'whitespace-nowrap' },
  ];

  getStatusBadgeTone(status: OrderStatus): 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'cream' {
    switch (status) {
      case 'Pendiente': return 'warning';
      case 'Tostando':  return 'accent';
      case 'Enviado':   return 'primary';
      case 'Entregado': return 'success';
      case 'Cancelado': return 'danger';
      default:          return 'cream';
    }
  }

  advanceOrderStatus(order: Order, nextStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, nextStatus);
    this.actionNotice.set(
      `Pedido ${order.orderNumber} actualizado a "${nextStatus}".`
    );
  }
}

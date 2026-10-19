import { Injectable, computed, signal } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ordersSignal = signal<Order[]>([
    {
      id: 'ord-01',
      orderNumber: 'KOKO-8492',
      customerName: 'Santiago Herrera',
      customerEmail: 'santiago@gmail.com',
      items: [
        { productName: 'Geisha Finca El Paraíso', variety: 'Geisha 100%', weight: '250g', quantity: 2, unitPrice: 24.5 },
        { productName: 'Bourbon Rosado Anaeróbico', variety: 'Bourbon Rosado', weight: '250g', quantity: 1, unitPrice: 21.0 },
      ],
      total: 70.0,
      status: 'Tostando',
      paymentStatus: 'Pagado',
      createdAt: 'Hace 45 min',
      shippingAddress: 'Av. Providencia 1240, Depto 402',
    },
    {
      id: 'ord-02',
      orderNumber: 'KOKO-8491',
      customerName: 'Lucía Mendizábal',
      customerEmail: 'lucia.m@outlook.com',
      items: [
        { productName: 'Yirgacheffe Heirloom Natural', variety: 'Autóctonas', weight: '250g', quantity: 1, unitPrice: 22.5 },
      ],
      total: 22.5,
      status: 'Enviado',
      paymentStatus: 'Pagado',
      createdAt: 'Hace 2 horas',
      shippingAddress: 'Calle El Bosque 56, Las Condes',
    },
    {
      id: 'ord-03',
      orderNumber: 'KOKO-8490',
      customerName: 'Café & Grano Roasters',
      customerEmail: 'compras@cafeygrano.com',
      items: [
        { productName: 'Pacamara Honey Volcán Barú', variety: 'Pacamara', weight: '1kg', quantity: 3, unitPrice: 65.0 },
        { productName: 'Geisha Finca El Paraíso', variety: 'Geisha', weight: '1kg', quantity: 2, unitPrice: 85.0 },
      ],
      total: 365.0,
      status: 'Pendiente',
      paymentStatus: 'Pagado',
      createdAt: 'Hace 3 horas',
      shippingAddress: 'Paseo Ahumada 230, Local 12',
    },
    {
      id: 'ord-04',
      orderNumber: 'KOKO-8489',
      customerName: 'Ignacio Cárdenas',
      customerEmail: 'ignacio.card@yahoo.com',
      items: [
        { productName: 'Bourbon Rosado Anaeróbico', variety: 'Bourbon Rosado', weight: '250g', quantity: 2, unitPrice: 21.0 },
      ],
      total: 42.0,
      status: 'Entregado',
      paymentStatus: 'Pagado',
      createdAt: 'Ayer, 16:30',
      shippingAddress: 'San Martín 780, Concepción',
    },
    {
      id: 'ord-05',
      orderNumber: 'KOKO-8488',
      customerName: 'Valeria Toro',
      customerEmail: 'valetoro@gmail.com',
      items: [
        { productName: 'Yirgacheffe Heirloom Natural', variety: 'Autóctonas', weight: '500g', quantity: 1, unitPrice: 38.0 },
      ],
      total: 38.0,
      status: 'Entregado',
      paymentStatus: 'Pagado',
      createdAt: 'Ayer, 11:15',
      shippingAddress: 'Av. Libertad 340, Viña del Mar',
    },
  ]);

  readonly orders = this.ordersSignal.asReadonly();

  readonly totalRevenue = computed(() =>
    this.ordersSignal().reduce((acc, order) => acc + order.total, 0)
  );

  readonly pendingOrdersCount = computed(
    () => this.ordersSignal().filter((o) => o.status === 'Pendiente' || o.status === 'Tostando').length
  );

  readonly recentOrders = computed(() => this.ordersSignal().slice(0, 5));

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    this.ordersSignal.update((orders) =>
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }
}

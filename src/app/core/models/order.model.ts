export type OrderStatus = 'Pendiente' | 'Tostando' | 'Enviado' | 'Entregado' | 'Cancelado';

export interface OrderItem {
  productName: string;
  variety: string;
  weight: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: 'Pagado' | 'Pendiente';
  createdAt: string;
  shippingAddress: string;
}

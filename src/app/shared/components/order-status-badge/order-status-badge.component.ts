import { Component, input } from '@angular/core';
import { NbBadge } from '@ng-brutalism/ui';
import { OrderStatus } from '../../../core/models/order.model';

type BadgeTone = 'warning' | 'accent' | 'primary' | 'success' | 'danger';

function getStatusTone(status: OrderStatus): BadgeTone {
  switch (status) {
    case 'Pendiente':  return 'warning';
    case 'Tostando':   return 'accent';
    case 'Enviado':    return 'primary';
    case 'Entregado':  return 'success';
    case 'Cancelado':  return 'danger';
  }
}

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [NbBadge],
  template: `
    <span [attr.data-tone]="tone" nbBadge [tone]="tone" class="text-[10px] font-bold font-mono py-0.5 px-2">
      {{ status() }}
    </span>
  `,
})
export class OrderStatusBadgeComponent {
  readonly status = input.required<OrderStatus>();

  get tone(): BadgeTone {
    return getStatusTone(this.status());
  }
}

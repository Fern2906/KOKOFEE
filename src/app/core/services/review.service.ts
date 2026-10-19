import { Injectable, signal } from '@angular/core';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly reviewsSignal = signal<Review[]>([
    {
      id: 'rev-01',
      authorName: 'Camila Morales',
      authorRole: 'Q-Grader & Campeona de Baristas 2024',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      date: 'Hace 3 días',
      comment: 'El Geisha de Huila es de los mejores que he probado en el último año. El perfil floral y el equilibrio de acidez málica son impecables. Tueste exacto sin un solo ápice de defecto.',
      productName: 'Geisha Finca El Paraíso',
      verifiedPurchase: true,
    },
    {
      id: 'rev-02',
      authorName: 'Mateo Riquelme',
      authorRole: 'Aficionado al café de especialidad',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      date: 'Hace 1 semana',
      comment: 'Pedí el Bourbon Rosado y llegó tostado hace solo 4 días con su fecha y lote impresos en la bolsa. La frescura se nota en el bloom de la Chemex: burbujeo vivo y aroma a miel increíble.',
      productName: 'Bourbon Rosado Anaeróbico',
      verifiedPurchase: true,
    },
    {
      id: 'rev-03',
      authorName: 'Sofía Valenzuela',
      authorRole: 'Head Barista en Café Nómade',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      date: 'Hace 2 semanas',
      comment: 'KOKOFEE respeta el trabajo de los caficultores de verdad. La trazabilidad completa, las notas de cata certeras y la consistencia entre lotes los convierten en nuestro tostador de referencia.',
      productName: 'Yirgacheffe Heirloom Natural',
      verifiedPurchase: true,
    },
  ]);

  readonly reviews = this.reviewsSignal.asReadonly();
}

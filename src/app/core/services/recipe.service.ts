import { Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly recipesSignal = signal<Recipe[]>([
    {
      id: 'rec-01',
      title: 'V60 — Dulzura y Claridad Frutal',
      method: 'V60',
      difficulty: 'Iniciación',
      timeDisplay: '3:00 min',
      ratio: '1:16 (15g café / 240g agua)',
      grindSize: 'Media-Fina',
      temperature: '93°C',
      description: 'Extracción en 3 vertidos controlados para potenciar acidez brillante, notas florales y cuerpo limpio sin astringencia.',
      recommendedCoffee: 'Geisha Finca El Paraíso',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop',
      stepsCount: 4,
    },
    {
      id: 'rec-02',
      title: 'Chemex — Perfil Sedoso y Cristalino',
      method: 'Chemex',
      difficulty: 'Intermedio',
      timeDisplay: '4:30 min',
      ratio: '1:15 (30g café / 450g agua)',
      grindSize: 'Media-Gruesa',
      temperature: '94°C',
      description: 'Su filtro de triple capa atrapa todos los aceites y sedimentos, entregando una taza aromática, limpia y extraordinariamente suave.',
      recommendedCoffee: 'Yirgacheffe Heirloom Natural',
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop',
      stepsCount: 5,
    },
    {
      id: 'rec-03',
      title: 'Aeropress Invertido — Máximo Cuerpo y Miel',
      method: 'Aeropress',
      difficulty: 'Iniciación',
      timeDisplay: '2:15 min',
      ratio: '1:14 (17g café / 240g agua)',
      grindSize: 'Media',
      temperature: '89°C',
      description: 'Inmersión total al vacío para resaltar notas melosas, chocolate denso y una textura redonda y cremosa en boca.',
      recommendedCoffee: 'Bourbon Rosado Anaeróbico',
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
      stepsCount: 4,
    },
  ]);

  readonly recipes = this.recipesSignal.asReadonly();
}

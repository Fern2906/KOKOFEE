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
      steps: [
        'Calienta el agua a 93°C y coloca el filtro en el V60, enjuágalo con agua caliente.',
        'Agrega 15g de café molido medio-fino y nivela la cama de café.',
        'Vierte 30g de agua en espiral del centro hacia los bordes y espera 45s (bloom).',
        'Realiza 2 vertidos más de 105g cada uno en espiral, manteniendo el nivel constante hasta completar 240g.',
      ],
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
      steps: [
        'Calienta el agua a 94°C y dobla el filtro Chemex colocando tres capas hacia el pico vertedor.',
        'Enjuaga el filtro con agua caliente y desecha el agua de precalentamiento.',
        'Agrega 30g de café molido medio-grueso y asiéntalo uniformemente.',
        'Vierte 60g en espiral para el bloom y espera 45 segundos.',
        'Continúa vertiendo en pulsos de 80-100g hasta alcanzar 450g en un tiempo total de 4:30 min.',
      ],
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
      steps: [
        'Invierte el Aeropress (posición invertida) y precalienta con agua a 89°C.',
        'Agrega 17g de café molido medio y vierte 240g de agua a 89°C.',
        'Revuelve suavemente durante 10 segundos y coloca el filtro humedecido en la tapa.',
        'A los 2:00 min, invierte sobre tu taza y presiona con presión constante durante 15 segundos.',
      ],
    },
  ]);

  readonly recipes = this.recipesSignal.asReadonly();

  addRecipe(data: Omit<Recipe, 'id'>): void {
    const current = this.recipesSignal();
    const maxNum = current.reduce((max, r) => {
      const match = r.id.match(/^rec-(\d+)$/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const newId = `rec-${String(maxNum + 1).padStart(2, '0')}`;
    this.recipesSignal.update(list => [...list, { id: newId, ...data }]);
  }

  updateRecipe(id: string, data: Omit<Recipe, 'id'>): void {
    this.recipesSignal.update(list =>
      list.map(r => (r.id === id ? { id, ...data } : r))
    );
  }

  deleteRecipe(id: string): void {
    this.recipesSignal.update(list => list.filter(r => r.id !== id));
  }
}

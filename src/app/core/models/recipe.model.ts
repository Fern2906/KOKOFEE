export interface Recipe {
  id: string;
  title: string;
  method: 'V60' | 'Chemex' | 'Aeropress' | 'Prensa Francesa' | 'Espresso';
  difficulty: 'Iniciación' | 'Intermedio' | 'Avanzado';
  timeDisplay: string;
  ratio: string;
  grindSize: string;
  temperature: string;
  description: string;
  recommendedCoffee: string;
  imageUrl: string;
  stepsCount: number;
}

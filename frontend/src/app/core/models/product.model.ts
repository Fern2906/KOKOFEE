export interface Product {
  id: string;
  name: string;
  variety: string;
  origin: string;
  altitude: string;
  process: 'Lavado' | 'Natural' | 'Honey' | 'Maceración Carbónica';
  roastLevel: 'Tueste Claro' | 'Tueste Medio' | 'Tueste Medio-Oscuro';
  tastingNotes: string[];
  scaScore: number;
  price: number;
  originalPrice?: number;
  weight: string;
  imageUrl: string;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  description: string;
}

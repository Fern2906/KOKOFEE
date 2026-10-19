import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>([
    {
      id: 'koko-01',
      name: 'Geisha Finca El Paraíso',
      variety: 'Geisha de Altura',
      origin: 'Huila, Colombia',
      altitude: '1,950 msnm',
      process: 'Lavado',
      roastLevel: 'Tueste Claro',
      tastingNotes: ['Jazmín', 'Bergamota', 'Melocotón'],
      scaScore: 89.5,
      price: 24.5,
      originalPrice: 28.0,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop',
      stock: 14,
      isFeatured: true,
      badge: 'Microlote Exclusivo',
      description: 'Cosecha seleccionada a mano. Acidez vivaz con postgusto dulce y persistente que evoca té blanco y flores silvestres.',
    },
    {
      id: 'koko-02',
      name: 'Bourbon Rosado Anaeróbico',
      variety: 'Bourbon Rosado',
      origin: 'San Agustín, Colombia',
      altitude: '1,800 msnm',
      process: 'Maceración Carbónica',
      roastLevel: 'Tueste Medio',
      tastingNotes: ['Frambuesa', 'Miel de Maple', 'Cacao Criollo'],
      scaScore: 88.0,
      price: 21.0,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      stock: 22,
      isFeatured: true,
      badge: 'Favorito Baristas',
      description: 'Fermentación en cereza durante 72 horas bajo atmósfera controlada. Notas intensas a frutas rojas maduras.',
    },
    {
      id: 'koko-03',
      name: 'Yirgacheffe Heirloom Natural',
      variety: 'Variedades Autóctonas',
      origin: 'Gedeo, Etiopía',
      altitude: '2,100 msnm',
      process: 'Natural',
      roastLevel: 'Tueste Claro',
      tastingNotes: ['Arándano Silvestre', 'Chocolate Negro', 'Cardamomo'],
      scaScore: 88.75,
      price: 22.5,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
      stock: 9,
      isFeatured: true,
      badge: 'Cuna del Café',
      description: 'Secado en camas africanas elevadas durante 24 días. Cuerpo envolvente con explosión frutal inconfundible.',
    },
    {
      id: 'koko-04',
      name: 'Pacamara Honey Volcán Barú',
      variety: 'Pacamara Gigante',
      origin: 'Boquete, Panamá',
      altitude: '1,750 msnm',
      process: 'Honey',
      roastLevel: 'Tueste Medio',
      tastingNotes: ['Papaya', 'Azúcar Mascabado', 'Nuez de Macadamia'],
      scaScore: 87.5,
      price: 19.5,
      originalPrice: 23.0,
      weight: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
      stock: 18,
      isFeatured: true,
      badge: 'Suelo Volcánico',
      description: 'Suelos ricos en ceniza volcánica que otorgan una dulzura acaramelada natural y un cuerpo cremoso irrepetible.',
    },
  ]);

  readonly products = this.productsSignal.asReadonly();

  readonly featuredProducts = computed(() =>
    this.productsSignal().filter((p) => p.isFeatured)
  );

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }
}

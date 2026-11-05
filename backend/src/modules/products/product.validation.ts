import { z } from 'zod';
import { PRODUCT_PROCESSES, PRODUCT_ROAST_LEVELS } from './product.model';

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  variety: z.string().trim().min(1, 'La variedad es obligatoria'),
  origin: z.string().trim().min(1, 'El origen es obligatorio'),
  altitude: z.string().trim().min(1, 'La altitud es obligatoria'),
  process: z.enum(PRODUCT_PROCESSES),
  roastLevel: z.enum(PRODUCT_ROAST_LEVELS),
  tastingNotes: z.array(z.string().trim().min(1)).default([]),
  scaScore: z.number().min(0).max(100),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  weight: z.string().trim().min(1, 'El peso es obligatorio'),
  imageUrl: z.string().url('La imagen debe ser una URL válida'),
  stock: z.number().int().min(0),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  badge: z.string().trim().optional(),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

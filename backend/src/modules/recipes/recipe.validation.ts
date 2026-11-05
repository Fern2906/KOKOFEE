import { z } from 'zod';
import { RECIPE_DIFFICULTIES, RECIPE_METHODS } from './recipe.model';

export const createRecipeSchema = z.object({
  title: z.string().trim().min(2, 'El título debe tener al menos 2 caracteres'),
  method: z.enum(RECIPE_METHODS),
  difficulty: z.enum(RECIPE_DIFFICULTIES),
  timeDisplay: z.string().trim().min(1, 'El tiempo es obligatorio'),
  ratio: z.string().trim().min(1, 'El ratio es obligatorio'),
  grindSize: z.string().trim().min(1, 'La molienda es obligatoria'),
  temperature: z.string().trim().min(1, 'La temperatura es obligatoria'),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
  recommendedCoffee: z.string().trim().min(1, 'El café recomendado es obligatorio'),
  imageUrl: z.string().url('La imagen debe ser una URL válida'),
  steps: z
    .array(z.string().trim().min(1, 'El paso no puede estar vacío'))
    .min(1, 'La receta debe tener al menos un paso'),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

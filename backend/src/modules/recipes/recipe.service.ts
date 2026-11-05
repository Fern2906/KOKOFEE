import { isValidObjectId } from 'mongoose';
import { HttpError } from '../../utils/http-error';
import { escapeRegex } from '../../utils/escape-regex';
import { RecipeDifficulty, RecipeMethod, RecipeModel } from './recipe.model';
import { CreateRecipeInput, UpdateRecipeInput } from './recipe.validation';

export interface RecipeFilters {
  search?: string;
  method?: string;
  difficulty?: string;
}

export async function listRecipes(filters: RecipeFilters) {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    const regex = new RegExp(escapeRegex(filters.search), 'i');
    query['$or'] = [
      { title: regex },
      { description: regex },
      { recommendedCoffee: regex },
      { grindSize: regex },
      { steps: regex },
    ];
  }

  if (filters.method && filters.method !== 'all') {
    query['method'] = filters.method as RecipeMethod;
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    query['difficulty'] = filters.difficulty as RecipeDifficulty;
  }

  return RecipeModel.find(query).sort({ title: 1 });
}

export async function getRecipeById(id: string) {
  ensureValidId(id);

  const recipe = await RecipeModel.findById(id);
  if (!recipe) {
    throw new HttpError(404, 'Receta no encontrada');
  }

  return recipe;
}

export async function createRecipe(input: CreateRecipeInput) {
  return RecipeModel.create({
    ...input,
    stepsCount: input.steps.length,
  });
}

export async function updateRecipe(id: string, input: UpdateRecipeInput) {
  ensureValidId(id);

  const payload = {
    ...input,
    ...(input.steps ? { stepsCount: input.steps.length } : {}),
  };

  const recipe = await RecipeModel.findByIdAndUpdate(id, payload, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!recipe) {
    throw new HttpError(404, 'Receta no encontrada');
  }

  return recipe;
}

export async function deleteRecipe(id: string) {
  ensureValidId(id);

  const recipe = await RecipeModel.findByIdAndDelete(id);
  if (!recipe) {
    throw new HttpError(404, 'Receta no encontrada');
  }

  return recipe;
}

function ensureValidId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new HttpError(400, 'Identificador de receta inválido');
  }
}

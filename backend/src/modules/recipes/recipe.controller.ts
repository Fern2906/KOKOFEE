import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { createRecipeSchema, updateRecipeSchema } from './recipe.validation';
import * as recipeService from './recipe.service';

export const listRecipes = asyncHandler(async (req: Request, res: Response) => {
  const search = typeof req.query['search'] === 'string' ? req.query['search'].trim() : '';
  const recipes = await recipeService.listRecipes({
    search,
    method: typeof req.query['method'] === 'string' ? req.query['method'] : undefined,
    difficulty:
      typeof req.query['difficulty'] === 'string' ? req.query['difficulty'] : undefined,
  });

  res.json(recipes);
});

export const getRecipe = asyncHandler(async (req: Request, res: Response) => {
  const recipe = await recipeService.getRecipeById(req.params['id'] as string);
  res.json(recipe);
});

export const createRecipe = asyncHandler(async (req: Request, res: Response) => {
  const input = createRecipeSchema.parse(req.body);
  const recipe = await recipeService.createRecipe(input);
  res.status(201).json(recipe);
});

export const updateRecipe = asyncHandler(async (req: Request, res: Response) => {
  const input = updateRecipeSchema.parse(req.body);
  const recipe = await recipeService.updateRecipe(req.params['id'] as string, input);
  res.json(recipe);
});

export const deleteRecipe = asyncHandler(async (req: Request, res: Response) => {
  await recipeService.deleteRecipe(req.params['id'] as string);
  res.status(204).send();
});

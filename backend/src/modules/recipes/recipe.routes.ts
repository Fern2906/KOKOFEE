import { Router } from 'express';
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  listRecipes,
  updateRecipe,
} from './recipe.controller';

const router = Router();

router.get('/', listRecipes);
router.get('/:id', getRecipe);
router.post('/', createRecipe);
router.patch('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;

import { Router } from 'express';
import healthRoutes from './health.routes';
import productRoutes from '../modules/products/product.routes';
import recipeRoutes from '../modules/recipes/recipe.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/products', productRoutes);
router.use('/recipes', recipeRoutes);

export default router;

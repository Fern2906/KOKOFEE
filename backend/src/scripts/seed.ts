import { connectDatabase, disconnectDatabase } from '../config/database';
import { ProductModel } from '../modules/products/product.model';
import { RecipeModel } from '../modules/recipes/recipe.model';
import { productsSeed } from '../data/products.seed';
import { recipesSeed } from '../data/recipes.seed';

async function seed(): Promise<void> {
  await connectDatabase();

  await Promise.all([ProductModel.deleteMany({}), RecipeModel.deleteMany({})]);
  console.log('[seed] Colecciones de productos y recetas limpiadas');

  await ProductModel.insertMany(productsSeed);
  console.log(`[seed] ${productsSeed.length} productos insertados`);

  await RecipeModel.insertMany(recipesSeed);
  console.log(`[seed] ${recipesSeed.length} recetas insertadas`);

  await disconnectDatabase();
}

seed().catch((error) => {
  console.error('[seed] Error:', error);
  process.exit(1);
});

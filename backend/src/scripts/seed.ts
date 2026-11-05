import { connectDatabase, disconnectDatabase } from '../config/database';
import { ProductModel } from '../modules/products/product.model';
import { RecipeModel } from '../modules/recipes/recipe.model';
import { productsSeed } from '../data/products.seed';
import { recipesSeed } from '../data/recipes.seed';

async function seed(): Promise<void> {
  await connectDatabase();

  await Promise.all([ProductModel.deleteMany({}), RecipeModel.deleteMany({})]);

  await ProductModel.insertMany(productsSeed);

  await RecipeModel.insertMany(recipesSeed);

  await disconnectDatabase();
}

seed().catch((error) => {
  process.exit(1);
});

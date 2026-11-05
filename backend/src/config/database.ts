import mongoose from 'mongoose';
import { env } from './env';
import { ProductModel } from '../modules/products/product.model';
import { RecipeModel } from '../modules/recipes/recipe.model';
import { productsSeed } from '../data/products.seed';
import { recipesSeed } from '../data/recipes.seed';

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8_000,
  });

  console.log(
    `[db] MongoDB conectado en ${mongoose.connection.host}/${mongoose.connection.name}`
  );
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('[db] MongoDB desconectado');
}

export function getDatabaseState(): string {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return states[mongoose.connection.readyState] ?? 'unknown';
}

/**
 * Si las colecciones están vacías, carga los datos iniciales del catálogo
 * y del recetario. Así el frontend funciona desde el primer arranque.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  const [productCount, recipeCount] = await Promise.all([
    ProductModel.estimatedDocumentCount(),
    RecipeModel.estimatedDocumentCount(),
  ]);

  if (productCount === 0) {
    await ProductModel.insertMany(productsSeed);
    console.log(`[seed] ${productsSeed.length} productos insertados`);
  }

  if (recipeCount === 0) {
    await RecipeModel.insertMany(recipesSeed);
    console.log(`[seed] ${recipesSeed.length} recetas insertadas`);
  }
}

import { isValidObjectId } from 'mongoose';
import { HttpError } from '../../utils/http-error';
import { escapeRegex } from '../../utils/escape-regex';
import { ProductModel, ProductProcess, ProductRoastLevel } from './product.model';
import { CreateProductInput, UpdateProductInput } from './product.validation';

export interface ProductFilters {
  search?: string;
  process?: string;
  roast?: string;
  origin?: string;
  inStock?: boolean;
  sort?: string;
}

function buildSort(sort?: string): Record<string, 1 | -1> {
  switch (sort) {
    case 'price-asc':
      return { price: 1 };
    case 'price-desc':
      return { price: -1 };
    case 'score-desc':
      return { scaScore: -1 };
    case 'name-asc':
      return { name: 1 };
    case 'featured':
    default:
      return { isFeatured: -1, scaScore: -1 };
  }
}

export async function listProducts(filters: ProductFilters) {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    const regex = new RegExp(escapeRegex(filters.search), 'i');
    query['$or'] = [
      { name: regex },
      { variety: regex },
      { origin: regex },
      { process: regex },
      { roastLevel: regex },
      { description: regex },
      { tastingNotes: regex },
    ];
  }

  if (filters.process && filters.process !== 'all') {
    query['process'] = filters.process as ProductProcess;
  }

  if (filters.roast && filters.roast !== 'all') {
    query['roastLevel'] = filters.roast as ProductRoastLevel;
  }

  if (filters.origin && filters.origin !== 'all') {
    query['origin'] = filters.origin;
  }

  if (filters.inStock) {
    query['stock'] = { $gt: 0 };
  }

  return ProductModel.find(query).sort(buildSort(filters.sort));
}

export async function getProductById(id: string) {
  ensureValidId(id);

  const product = await ProductModel.findById(id);
  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return product;
}

export async function createProduct(input: CreateProductInput) {
  return ProductModel.create(input);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  ensureValidId(id);

  const product = await ProductModel.findByIdAndUpdate(id, input, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return product;
}

export async function deleteProduct(id: string) {
  ensureValidId(id);

  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return product;
}

function ensureValidId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new HttpError(400, 'Identificador de producto inválido');
  }
}

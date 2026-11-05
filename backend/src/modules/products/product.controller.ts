import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { createProductSchema, updateProductSchema } from './product.validation';
import * as productService from './product.service';

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const search = typeof req.query['search'] === 'string' ? req.query['search'].trim() : '';
  const products = await productService.listProducts({
    search,
    process: typeof req.query['process'] === 'string' ? req.query['process'] : undefined,
    roast: typeof req.query['roast'] === 'string' ? req.query['roast'] : undefined,
    origin: typeof req.query['origin'] === 'string' ? req.query['origin'] : undefined,
    inStock: req.query['inStock'] === 'true',
    sort: typeof req.query['sort'] === 'string' ? req.query['sort'] : undefined,
  });

  res.json(products);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params['id'] as string);
  res.json(product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const input = createProductSchema.parse(req.body);
  const product = await productService.createProduct(input);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const input = updateProductSchema.parse(req.body);
  const product = await productService.updateProduct(req.params['id'] as string, input);
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params['id'] as string);
  res.status(204).send();
});

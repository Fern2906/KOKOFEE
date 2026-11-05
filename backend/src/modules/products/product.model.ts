import { Schema, model } from 'mongoose';

export const PRODUCT_PROCESSES = [
  'Lavado',
  'Natural',
  'Honey',
  'Maceración Carbónica',
] as const;

export const PRODUCT_ROAST_LEVELS = [
  'Tueste Claro',
  'Tueste Medio',
  'Tueste Medio-Oscuro',
] as const;

export type ProductProcess = (typeof PRODUCT_PROCESSES)[number];
export type ProductRoastLevel = (typeof PRODUCT_ROAST_LEVELS)[number];

export interface ProductDocument {
  name: string;
  variety: string;
  origin: string;
  altitude: string;
  process: ProductProcess;
  roastLevel: ProductRoastLevel;
  tastingNotes: string[];
  scaScore: number;
  price: number;
  originalPrice?: number;
  weight: string;
  imageUrl: string;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  description: string;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    variety: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    altitude: { type: String, required: true, trim: true },
    process: {
      type: String,
      required: true,
      enum: PRODUCT_PROCESSES,
    },
    roastLevel: {
      type: String,
      required: true,
      enum: PRODUCT_ROAST_LEVELS,
    },
    tastingNotes: { type: [String], default: [] },
    scaScore: { type: Number, required: true, min: 0, max: 100 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    weight: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    badge: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
    // `isNew` forma parte del contrato del frontend, aunque Mongoose lo
    // considera una clave reservada para documentos.
    suppressReservedKeysWarning: true,
  }
);

/**
 * Expone `_id` como `id` para que el frontend consuma el mismo contrato
 * que ya usaban los modelos de Angular.
 */
productSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
});

export const ProductModel = model<ProductDocument>('Product', productSchema);

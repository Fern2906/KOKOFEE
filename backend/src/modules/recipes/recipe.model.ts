import { Schema, model } from 'mongoose';

export const RECIPE_METHODS = [
  'V60',
  'Chemex',
  'Aeropress',
  'Prensa Francesa',
  'Espresso',
] as const;

export const RECIPE_DIFFICULTIES = [
  'Iniciación',
  'Intermedio',
  'Avanzado',
] as const;

export type RecipeMethod = (typeof RECIPE_METHODS)[number];
export type RecipeDifficulty = (typeof RECIPE_DIFFICULTIES)[number];

export interface RecipeDocument {
  title: string;
  method: RecipeMethod;
  difficulty: RecipeDifficulty;
  timeDisplay: string;
  ratio: string;
  grindSize: string;
  temperature: string;
  description: string;
  recommendedCoffee: string;
  imageUrl: string;
  stepsCount: number;
  steps: string[];
}

const recipeSchema = new Schema<RecipeDocument>(
  {
    title: { type: String, required: true, trim: true },
    method: { type: String, required: true, enum: RECIPE_METHODS },
    difficulty: { type: String, required: true, enum: RECIPE_DIFFICULTIES },
    timeDisplay: { type: String, required: true, trim: true },
    ratio: { type: String, required: true, trim: true },
    grindSize: { type: String, required: true, trim: true },
    temperature: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    recommendedCoffee: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    stepsCount: { type: Number, required: true, min: 1, default: 1 },
    steps: {
      type: [String],
      required: true,
      validate: {
        validator: (steps: string[]) => steps.length > 0,
        message: 'La receta debe tener al menos un paso',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

recipeSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
});

export const RecipeModel = model<RecipeDocument>('Recipe', recipeSchema);

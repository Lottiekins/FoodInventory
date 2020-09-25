import { Brand } from "./brand.model";

export interface Item {
  id?: number;
  barcode: number;
  brand: Brand; // brandId FK
  name: string;
  total_weight: number | null;
  total_weight_format: string | null;
  image: string | null;
  portionable: boolean;
  group_serving: number | null;
  portion_weight: number | null;
  portion_weight_format: string | null;
  consume_within_x_days_of_opening: number | null;
  created_on?: Date;
  modified_on?: Date;
}

export interface ItemAdded {
  item: Item;
  item_created: boolean;
}

export enum WeightFormatEnum {
  GRAM = 'g',
  KILOGRAM = 'Kg',
  MILLILITRE = 'mL',
  LITRE = 'L'
}

export enum WeightFormatChoicesEnum {
  GRAM = 'Grams',
  KILOGRAM = 'Kilograms',
  MILLILITRE = 'Millilitre',
  LITRE = 'Litre'
}

export interface ProductQuery {
  product: Product;
  status_verbose: string;
  status: number;
  code: string;
}

export interface Product {
  id: number;
  brands: string;
  brands_tags: string[];
  product_name: string;
  product_name_en: string;
  product_name_fr: string;
  lang: string;
  lc: string;
  countries_lc: string;
  code: string;
  scans_n: number;
  unique_scans_n: number;
  categories: string;
  image_url: string;
  image_front_url: string;
  image_thumb_url: string;
  image_ingredients_url: string;
  selected_images: SelectedImages;
  states: string;
  states_tags: string[];
  popularity_tags: string[];
  data_quality_tags: string[];
  nutriments: Nutriments;
  nutrition_data_per: string;
  nutrition_data_prepared_per: string;
  ingredients: Ingredient[];
  ingredients_tags: string[];
  ingredients_original_tags: string[];
  ingredients_hierarchy: string[];
  ingredients_text_en: string;
  ingredients_text_with_allergens: string;
  ingredients_text_with_allergens_en: string;
  ingredients_from_palm_oil_n: number;
  ingredients_that_may_be_from_palm_oil_tags: string[];
  additives_tags: string[];
  quantity: string;
  _keywords: string[];
  created_t: number;
  last_modified_t: number;
}

export interface Nutriments {
  carbohydrates_value: number;
  carbohydrates_unit: string;
  'energy-kcal_100g': number;
  salt_unit: string;
  fat_value: number;
  carbohydrates: number;
  sugars_value: number;
  sodium_value: number;
  'energy-kcal_value': number;
  fat: number;
  fat_100g: number;
  proteins_value: number;
  energy: number;
  energy_100g: number;
  'saturated-fat': number;
  salt: number;
  proteins_unit: string;
  'nova-group_serving': number;
  'fruits-vegetables-nuts-estimate-from-ingredients_100g': number;
  salt_100g: number;
  proteins: number;
  'energy-kcal_unit': string;
  'nova-group_100g': number;
  sugars_unit: string;
  carbohydrates_100g: number;
  fat_unit: string;
  sodium_100g: number;
  energy_unit: string;
  'saturated-fat_100g': number;
  sugars_100g: number;
  'saturated-fat_value': number;
  sugars: number;
  'nova-group': number;
  'saturated-fat_unit': string;
  'energy-kcal': number;
  energy_value: number;
  sodium_unit: string;
  sodium: number;
  proteins_100g: number;
  salt_value: number;
}

export interface Ingredient {
  id: string;
  rank: number;
  text: string;
  percent_min: number;
  percent_max: number;
  vegan: string;
  vegetarian: string;
  from_palm_oil: string;
  has_sub_ingredients: string;
}

export interface SelectedImages {
  front: {
    display: {
      fr: string;
      en: string;
    },
    thumb: {
      fr: string;
      en: string;
    },
    small: {
      fr: string;
      en: string;
    }
  },
  nutrition: {
    display: {
      fr: string;
      en: string;
    },
    thumb: {
      fr: string;
      en: string;
    },
    small: {
      fr: string;
      en: string;
    }
  },
  ingredients: {
    display: {
      fr: string;
      en: string;
    },
    thumb: {
      fr: string;
      en: string;
    },
    small: {
      fr: string;
      en: string;
    }
  }
}

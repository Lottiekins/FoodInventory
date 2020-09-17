export interface Item {
  id: number;
  brandId: number;
  name: string;
  total_weight: number | null;
  total_weight_format: string | null;
  image: string | null;
  portionable: boolean;
  group_serving: number | null;
  portion_weight: number | null;
  portion_weight_format: string | null;
  consume_within_x_days_of_opening: number | null;
}

export interface ItemAdded {
  item_added: Item[]
}

export interface ItemNotAdded {
  item_not_added: {
    status_verbose: string,
    status: number,
    code: string
  }
}

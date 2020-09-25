export interface Inventory {
  id?: number;
  name: string;
  image: string;
  created_on?: Date;
  modified_on?: Date;
}

export interface InventoryAdded {
  inventory_name: string;
  inventory_created: boolean;
}

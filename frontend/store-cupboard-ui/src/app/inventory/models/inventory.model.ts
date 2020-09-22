export interface Inventory {
  id: number;
  name: string;
}

export interface InventoryAdded {
  inventory_name: string;
  inventory_created: boolean;
}

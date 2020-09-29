import { Item } from "../../item/models/item.model";
import { Inventory, InventoryAdded } from "./inventory.model";

export interface InventoryItem {
  id?: number;
  inventory: Inventory;
  item: Item;
  purchase_date: Date;
  expiration_date: Date;
  opened: boolean;
  opened_date: Date;
  opened_by_id: CustomUser;
  consumed: boolean;
  consumption_date: Date;
  consumed_by_id: CustomUser;
  created_on?: Date;
  modified_on?: Date;
}

export interface InventoryItemAdded {
  inventory_item_name: '',
  inventory_item_created: false,
}

export interface CustomUser {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

import { Manufacturer  } from "./manufacturer.model";

export interface Brand {
  id?: number;
  manufacturer: Manufacturer; // manufacturerId FK
  name: string;
  created_on?: Date;
  modified_on?: Date;
}

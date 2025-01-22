export interface Sunbed {
  date: Date;
  entries: entries[];
  createdAt: Date;
  updatedAt: Date;
}

interface entries {
  name: string;
  amount: number;
  price: number;
}

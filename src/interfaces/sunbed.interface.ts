export interface Sunbed {
  name: string;
  price: number;
  amount: number;
  status: "available" | "booked";
  createdAt: Date;
  updatedAt: Date;
}

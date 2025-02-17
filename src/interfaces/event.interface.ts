export interface Event {
  id?: string;
  title: string;
  description: string;
  menu: string;
  price: number;
  image?: string;
  date: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

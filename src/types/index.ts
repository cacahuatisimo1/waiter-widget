
export type User = {
  id: string;
  name: string;
  role: "waiter" | "chef";
};

export type OrderItem = {
  id: string;
  plateId: string;
  quantity: number;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
};

export type Order = {
  id: string;
  tableId: string;
  orderItems: OrderItem[];
  description?: string;
  status: "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
};

export type Table = {
  id: string;
  number: number;
  status: "available" | "occupied";
};

export type Plate = {
  id: string;
  name: string;
  price: number;
  category: string;
};

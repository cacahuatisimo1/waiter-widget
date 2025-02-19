
import { create } from "zustand";
import { OrderItem, Order, Table, User, Plate } from "@/types";
import { devtools } from "zustand/middleware";

interface AppState {
  user: User | null;
  orders: Order[];
  tables: Table[];
  plates: Plate[];
  activeTable: string | null;
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
  setTables: (tables: Table[]) => void;
  setPlates: (plates: Plate[]) => void;
  setActiveTable: (tableId: string | null) => void;
  addOrder: (order: Order) => void;
  updateOrderItem: (orderId: string, orderItem: OrderItem) => void;
  addOrderItem: (orderId: string, orderItem: OrderItem) => void;
}

export const useStore = create<AppState>()(
  devtools((set) => ({
    user: null,
    orders: [],
    tables: [],
    plates: [],
    activeTable: null,
    setUser: (user) => set({ user }),
    setOrders: (orders) => set({ orders }),
    setTables: (tables) => set({ tables }),
    setPlates: (plates) => set({ plates }),
    setActiveTable: (tableId) => set({ activeTable: tableId }),
    addOrder: (order) =>
      set((state) => ({ orders: [...state.orders, order] })),
    updateOrderItem: (orderId, orderItem) =>
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderItems: order.orderItems.map((item) =>
                  item.id === orderItem.id ? orderItem : item
                ),
              }
            : order
        ),
      })),
    addOrderItem: (orderId, orderItem) =>
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderItems: [...order.orderItems, orderItem],
              }
            : order
        ),
      })),
  }))
);

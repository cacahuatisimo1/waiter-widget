
import axios from "axios";
import { Table, Order } from "@/types";

const api = axios.create({
  baseURL: "YOUR_API_URL",
});

export const mockEnabled = {
  value: true, // Set default to true since we don't have a real API yet
  simulateErrors: false,
};

const MOCK_RESPONSE_DELAY = 500;

const mockTables: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: `table-${i + 1}`,
  number: i + 1,
  status: i % 2 === 0 ? "available" : "occupied",
}));

const mockOrders: Order[] = [];

const mockResponse = <T>(data: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockEnabled.simulateErrors) {
        reject(new Error("Simulated error"));
      } else {
        resolve(data);
      }
    }, MOCK_RESPONSE_DELAY);
  });
};

export const apiService = {
  getTables: async (restaurantId: string): Promise<Table[]> => {
    if (mockEnabled.value) {
      return mockResponse(mockTables);
    }
    try {
      const response = await api.get(`/restaurants/${restaurantId}/tables`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  getActiveOrder: async (tableId: string): Promise<Order | null> => {
    if (mockEnabled.value) {
      return mockResponse(
        mockOrders.find(
          (order) => order.tableId === tableId && order.status === "active"
        ) || null
      );
    }
    try {
      const response = await api.get(`/tables/${tableId}/active-order`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },
};

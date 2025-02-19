
import { io, Socket } from "socket.io-client";
import { Order, OrderItem } from "@/types";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId: string) {
    this.socket = io("YOUR_WEBSOCKET_SERVER_URL", {
      query: { userId },
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onOrderUpdate(callback: (order: Order) => void) {
    if (this.socket) {
      this.socket.on("orderUpdate", callback);
    }
  }

  onOrderItemUpdate(callback: (orderItem: OrderItem) => void) {
    if (this.socket) {
      this.socket.on("orderItemUpdate", callback);
    }
  }

  emitOrderUpdate(order: Order) {
    if (this.socket) {
      this.socket.emit("orderUpdate", order);
    }
  }

  emitOrderItemUpdate(orderItem: OrderItem) {
    if (this.socket) {
      this.socket.emit("orderItemUpdate", orderItem);
    }
  }
}

export const socketService = SocketService.getInstance();

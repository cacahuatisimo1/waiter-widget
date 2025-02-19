
import { io, Socket } from "socket.io-client";
import { Order, OrderItem } from "@/types";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;
  private userId: string | null = null;
  private RECONNECT_DELAY = 5 * 60 * 1000; // 5 minutos en milisegundos

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private clearReconnectTimeout() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private setupReconnectTimeout() {
    this.clearReconnectTimeout();
    this.reconnectTimeout = setTimeout(() => {
      console.log("Attempting to reconnect to WebSocket server...");
      this.connect(this.userId!);
    }, this.RECONNECT_DELAY);
  }

  connect(userId: string) {
    if (this.isConnecting || (this.socket?.connected && this.userId === userId)) {
      return;
    }

    this.userId = userId;
    this.isConnecting = true;
    this.clearReconnectTimeout();

    try {
      this.socket = io("YOUR_WEBSOCKET_SERVER_URL", {
        query: { userId },
        reconnection: false, // Desactivamos la reconexión automática
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
        this.isConnecting = false;
        this.clearReconnectTimeout();
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
        this.isConnecting = false;
        this.setupReconnectTimeout();
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        this.isConnecting = false;
        this.setupReconnectTimeout();
      });

    } catch (error) {
      console.error("Error creating socket connection:", error);
      this.isConnecting = false;
      this.setupReconnectTimeout();
    }
  }

  disconnect() {
    this.clearReconnectTimeout();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.userId = null;
    this.isConnecting = false;
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
    if (this.socket?.connected) {
      this.socket.emit("orderUpdate", order);
    } else {
      console.warn("Cannot emit orderUpdate: Socket not connected");
    }
  }

  emitOrderItemUpdate(orderItem: OrderItem) {
    if (this.socket?.connected) {
      this.socket.emit("orderItemUpdate", orderItem);
    } else {
      console.warn("Cannot emit orderItemUpdate: Socket not connected");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = SocketService.getInstance();

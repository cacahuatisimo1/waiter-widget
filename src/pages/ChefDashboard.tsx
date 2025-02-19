
import { useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useStore } from "@/store";
import { socketService } from "@/services/socket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToastManager } from "@/hooks/use-toast-manager";

const ChefDashboard = () => {
  const { user, orders } = useStore();
  const { showToast } = useToastManager();

  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const activeOrders = orders.filter((order) => order.status === "active");

  const handleStatusUpdate = (orderItemId: string, currentStatus: string) => {
    const newStatus =
      currentStatus === "pending"
        ? "in-progress"
        : currentStatus === "in-progress"
        ? "completed"
        : currentStatus;

    showToast("Status updated", `New status: ${newStatus}`, "default", "short");
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Kitchen Dashboard
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              useStore.getState().setUser(null);
            }}
          >
            Logout
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Table {order.tableId.replace("table-", "")}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {order.orderItems.map((item) => {
                    const handlers = useSwipeable({
                      onSwipedLeft: () => handleStatusUpdate(item.id, item.status),
                      trackMouse: true,
                    });

                    return (
                      <div key={item.id} {...handlers}>
                        <Card
                          className={`p-4 transform transition-transform ${
                            item.status === "pending"
                              ? "bg-orange-50 dark:bg-orange-900/20"
                              : item.status === "in-progress"
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : "bg-green-50 dark:bg-green-900/20"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-foreground">
                                {item.plateId} x{item.quantity}
                              </div>
                              <div
                                className={`text-sm ${
                                  item.status === "pending"
                                    ? "text-orange-600 dark:text-orange-400"
                                    : item.status === "in-progress"
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                {item.status}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleStatusUpdate(item.id, item.status)
                              }
                            >
                              Update Status
                            </Button>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;

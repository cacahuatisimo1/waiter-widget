
import { useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useStore } from "@/store";
import { socketService } from "@/services/socket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChefDashboard = () => {
  const { user, orders } = useStore();

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

    // Update order item status logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
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
                <h2 className="text-xl font-semibold">
                  Table{" "}
                  {order.tableId.replace("table-", "")}
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {order.orderItems.map((item) => {
                    const handlers = useSwipeable({
                      onSwipedLeft: () => handleStatusUpdate(item.id, item.status),
                      preventDefaultTouchmoveEvent: true,
                      trackMouse: true,
                    });

                    return (
                      <div key={item.id} {...handlers}>
                        <Card
                          className={`p-4 transform transition-transform ${
                            item.status === "pending"
                              ? "bg-orange-50"
                              : item.status === "in-progress"
                              ? "bg-blue-50"
                              : "bg-green-50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold">
                                {item.plateId} x{item.quantity}
                              </div>
                              <div
                                className={`text-sm ${
                                  item.status === "pending"
                                    ? "text-orange-600"
                                    : item.status === "in-progress"
                                    ? "text-blue-600"
                                    : "text-green-600"
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

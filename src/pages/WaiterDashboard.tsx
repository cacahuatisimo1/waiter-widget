
import { useEffect } from "react";
import { useStore } from "@/store";
import { socketService } from "@/services/socket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table } from "@/types";

const MOCK_TABLES: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: `table-${i + 1}`,
  number: i + 1,
  status: "available",
}));

const WaiterDashboard = () => {
  const { user, tables, setTables, activeTable, setActiveTable, orders } =
    useStore();

  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
      setTables(MOCK_TABLES);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, setTables]);

  const activeOrder = orders.find(
    (order) => order.tableId === activeTable && order.status === "active"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name}
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tables</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tables.map((table) => (
                <Button
                  key={table.id}
                  variant={activeTable === table.id ? "default" : "outline"}
                  onClick={() => setActiveTable(table.id)}
                  className="h-24"
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      Table {table.number}
                    </div>
                    <div
                      className={`text-sm ${
                        table.status === "available"
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {table.status}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {activeTable
                ? `Table ${
                    tables.find((t) => t.id === activeTable)?.number
                  } Order`
                : "Select a table"}
            </h2>
            {activeTable && (
              <ScrollArea className="h-[calc(100vh-300px)]">
                {activeOrder ? (
                  <div className="space-y-4">
                    {activeOrder.orderItems.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">
                              {item.plateId} x{item.quantity}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.status}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Handle update quantity
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      // Handle create new order
                    }}
                  >
                    Create New Order
                  </Button>
                )}
              </ScrollArea>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;

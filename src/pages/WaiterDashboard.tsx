
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { socketService } from "@/services/socket";
import { apiService } from "@/services/api";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToastManager } from "@/hooks/use-toast-manager";
import { DebugPanel } from "@/components/DebugPanel";
import { Table } from "@/types";

const WaiterDashboard = () => {
  const { user, tables, setTables, activeTable, setActiveTable, orders } =
    useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { showToast } = useToastManager();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchTables = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const fetchedTables = await apiService.getTables("restaurant-1");
        if (Array.isArray(fetchedTables)) {
          setTables(fetchedTables);
          showToast("Tables loaded", undefined, "default", "short");
        } else {
          console.error("Received invalid tables data:", fetchedTables);
          showToast(
            "Error loading tables",
            "Invalid data format",
            "destructive",
            "medium"
          );
          setTables([]); // Ensure tables is always an array
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
        showToast(
          "Error loading tables",
          "Please try again later",
          "destructive",
          "medium"
        );
        setTables([]); // Ensure tables is always an array
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      socketService.connect(user.id);
      fetchTables();
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, setTables, showToast]);

  const activeOrder = orders.find(
    (order) => order.tableId === activeTable && order.status === "active"
  );

  const handleTableSelect = async (tableId: string) => {
    setActiveTable(tableId);
    try {
      const order = await apiService.getActiveOrder(tableId);
      if (order) {
        showToast(
          "Active order found",
          `Order #${order.id}`,
          "default",
          "short"
        );
      }
    } catch (error) {
      console.error("Error fetching active order:", error);
      showToast(
        "Error loading order",
        "Please try again later",
        "destructive",
        "medium"
      );
    }
  };

  // Ensure tables is an array before mapping
  const tablesToRender = Array.isArray(tables) ? tables : [];

  return (
    <div className="min-h-screen bg-background transition-colors">
      <DebugPanel />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                useStore.getState().setUser(null);
              }}
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Tables</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center text-muted-foreground">
                  Loading tables...
                </div>
              ) : tablesToRender.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground">
                  No tables available
                </div>
              ) : (
                tablesToRender.map((table) => (
                  <Button
                    key={table.id}
                    variant={activeTable === table.id ? "default" : "outline"}
                    onClick={() => handleTableSelect(table.id)}
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
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
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
                            <div className="font-semibold text-foreground">
                              {item.plateId} x{item.quantity}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.status}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Handle update quantity
                              showToast(
                                "Update quantity",
                                "Feature coming soon",
                                "default",
                                "short"
                              );
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
                      showToast(
                        "Create order",
                        "Feature coming soon",
                        "default",
                        "short"
                      );
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

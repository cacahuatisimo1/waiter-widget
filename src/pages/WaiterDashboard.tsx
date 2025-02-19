
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { socketService } from "@/services/socket";
import { Card } from "@/components/ui/card";
import { DebugPanel } from "@/components/DebugPanel";
import { TableList } from "@/components/waiter/TableList";
import { OrderDetails } from "@/components/waiter/OrderDetails";
import { WaiterHeader } from "@/components/waiter/WaiterHeader";
import { useTableManagement } from "@/hooks/useTableManagement";

const WaiterDashboard = () => {
  const { user, tables, activeTable, orders } = useStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isLoading, fetchTables, handleTableSelect } = useTableManagement();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
      fetchTables("restaurant-1");
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, fetchTables]);

  const activeOrder = orders.find(
    (order) => order.tableId === activeTable && order.status === "active"
  );

  const tablesToRender = Array.isArray(tables) ? tables : [];

  return (
    <div className="min-h-screen bg-background transition-colors">
      <DebugPanel />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <WaiterHeader 
          user={user}
          isDarkMode={isDarkMode}
          onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Tables</h2>
            <TableList 
              tables={tablesToRender}
              isLoading={isLoading}
              activeTable={activeTable}
              onTableSelect={handleTableSelect}
            />
          </Card>

          <OrderDetails 
            activeTable={activeTable}
            tables={tablesToRender}
            activeOrder={activeOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;

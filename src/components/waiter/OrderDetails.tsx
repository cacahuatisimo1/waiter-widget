
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order, Table } from "@/types";
import { useToastManager } from "@/hooks/use-toast-manager";

interface OrderDetailsProps {
  activeTable: string | null;
  tables: Table[];
  activeOrder: Order | null;
}

export const OrderDetails = ({ activeTable, tables, activeOrder }: OrderDetailsProps) => {
  const { showToast } = useToastManager();

  if (!activeTable) {
    return null;
  }

  const tableNumber = tables.find((t) => t.id === activeTable)?.number;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        {activeTable ? `Table ${tableNumber} Order` : "Select a table"}
      </h2>
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
    </Card>
  );
};

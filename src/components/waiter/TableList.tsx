
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/types";

interface TableListProps {
  tables: Table[];
  isLoading: boolean;
  activeTable: string | null;
  onTableSelect: (tableId: string) => void;
}

export const TableList = ({ tables, isLoading, activeTable, onTableSelect }: TableListProps) => {
  if (isLoading) {
    return (
      <div className="col-span-full text-center text-muted-foreground">
        Loading tables...
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="col-span-full text-center text-muted-foreground">
        No tables available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {tables.map((table) => (
        <Button
          key={table.id}
          variant={activeTable === table.id ? "default" : "outline"}
          onClick={() => onTableSelect(table.id)}
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
  );
};

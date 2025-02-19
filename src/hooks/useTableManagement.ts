
import { useState, useCallback } from "react";
import { useStore } from "@/store";
import { apiService } from "@/services/api";
import { useToastManager } from "@/hooks/use-toast-manager";

export const useTableManagement = () => {
  const { setTables, setActiveTable } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastManager();

  const fetchTables = useCallback(async (restaurantId: string) => {
    setIsLoading(true);
    try {
      const fetchedTables = await apiService.getTables(restaurantId);
      if (Array.isArray(fetchedTables)) {
        setTables(fetchedTables);
        if (fetchedTables.length > 0) {
          showToast("Tables loaded", `${fetchedTables.length} tables found`, "default", "short");
        }
      } else {
        console.error("Received invalid tables data:", fetchedTables);
        showToast(
          "Error loading tables",
          "Invalid data format",
          "destructive",
          "medium"
        );
        setTables([]);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      showToast(
        "Error loading tables",
        "Please try again later",
        "destructive",
        "medium"
      );
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  }, [setTables, showToast]);

  const handleTableSelect = useCallback(async (tableId: string) => {
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
  }, [setActiveTable, showToast]);

  return {
    isLoading,
    fetchTables,
    handleTableSelect,
  };
};

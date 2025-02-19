
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToastManager } from "@/hooks/use-toast-manager";
import { mockEnabled } from "@/services/api";

export const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToastManager();

  return (
    <div
      className={`fixed right-0 top-1/4 transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-[calc(100%-2rem)]"
      }`}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-0 transform -translate-x-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      <Card className="p-4 w-72 bg-background/95 backdrop-blur-sm">
        <h3 className="font-semibold mb-4">Debug Panel</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mock-toggle">Enable Mock Services</Label>
            <Switch
              id="mock-toggle"
              checked={mockEnabled.value}
              onCheckedChange={(checked) => {
                mockEnabled.value = checked;
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="error-toggle">Simulate Errors</Label>
            <Switch
              id="error-toggle"
              checked={mockEnabled.simulateErrors}
              onCheckedChange={(checked) => {
                mockEnabled.simulateErrors = checked;
              }}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Test Toasts</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  showToast("Success", "Operation completed", "default", "short")
                }
              >
                Success
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  showToast("Error", "Something went wrong", "destructive", "long")
                }
              >
                Error
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

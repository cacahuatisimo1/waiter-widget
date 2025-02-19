
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useStore } from "@/store";

interface WaiterHeaderProps {
  user: User | null;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export const WaiterHeader = ({ user, isDarkMode, onDarkModeToggle }: WaiterHeaderProps) => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-foreground">
        Welcome, {user?.name}
      </h1>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onDarkModeToggle}
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
  );
};

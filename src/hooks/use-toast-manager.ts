
import { useToast } from "@/hooks/use-toast";

type ToastVariant = "default" | "destructive";
type ToastDuration = "short" | "medium" | "long";

const DURATIONS = {
  short: 3000,
  medium: 5000,
  long: 8000,
};

export const useToastManager = () => {
  const { toast } = useToast();

  const showToast = (
    title: string,
    message?: string,
    variant: ToastVariant = "default",
    duration: ToastDuration = "medium"
  ) => {
    toast({
      title,
      description: message,
      variant,
      duration: DURATIONS[duration],
    });
  };

  return { showToast };
};

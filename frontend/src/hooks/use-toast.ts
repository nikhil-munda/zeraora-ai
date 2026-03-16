type ToastVariant = "default" | "destructive";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    const prefix = variant === "destructive" ? "[Error]" : "[Info]";
    const message = [title, description].filter(Boolean).join(" - ");

    if (typeof window !== "undefined" && message) {
      console.log(`${prefix} ${message}`);
    }
  };

  return { toast };
}

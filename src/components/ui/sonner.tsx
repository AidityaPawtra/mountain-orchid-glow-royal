import { Toaster as Sonner, toast } from "sonner";

export { toast };

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "font-sans rounded-xl border border-border shadow-[var(--shadow-card)]",
        },
      }}
    />
  );
}
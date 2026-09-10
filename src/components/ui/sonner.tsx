import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "font-sans rounded-xl border border-border shadow-[var(--shadow-card)]",
        },
      }}
    />
  );
}

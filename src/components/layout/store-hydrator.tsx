import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/lib/store";

export function StoreHydrator({ children }: { children: ReactNode }) {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return children;
}

import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/lib/store";

export function StoreHydrator({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: any;
}) {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(initialData);

    if (!initialData) {
      fetch("/api/bootstrap")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data === "object") {
            hydrate(data);
          }
        })
        .catch(() => {});
    }
  }, [hydrate, initialData]);

  return <>{children}</>;
}

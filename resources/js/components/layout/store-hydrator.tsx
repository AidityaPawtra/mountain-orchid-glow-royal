import { useEffect, type ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import { useAppStore } from "@/lib/store";

export function StoreHydrator({ children }: { children: ReactNode }) {
  const auth = (usePage().props as { auth?: { user: unknown } }).auth;
  const hydrate = useAppStore((s) => s.hydrate);
  const user = (auth?.user ?? null) as Parameters<typeof hydrate>[0];

  useEffect(() => {
    hydrate(user);
  }, [user, hydrate]);

  return <>{children}</>;
}
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const ready = useAppStore((s) => s.ready);
  const session = useAppStore((s) => s.session);
  if (ready && session) return <Navigate to="/dashboard" />;
  return <Navigate to="/login" />;
}

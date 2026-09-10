import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/peminjaman")({
  component: PeminjamanLayout,
});

function PeminjamanLayout() {
  return <Outlet />;
}

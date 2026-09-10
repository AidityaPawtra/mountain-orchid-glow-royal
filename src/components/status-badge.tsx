import { Badge } from "@/components/ui/badge";
import type { LoanStatus } from "@/lib/types";

const LABEL: Record<LoanStatus, string> = {
  borrowed: "Dipinjam",
  returned: "Dikembalikan",
  overdue: "Terlambat",
};

const VARIANT: Record<LoanStatus, "warning" | "success" | "danger"> = {
  borrowed: "warning",
  returned: "success",
  overdue: "danger",
};

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  return <Badge variant={VARIANT[status]}>{LABEL[status]}</Badge>;
}

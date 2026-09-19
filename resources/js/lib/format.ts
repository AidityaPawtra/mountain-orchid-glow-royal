import { format, parseISO, isValid } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDate(iso: string) {
  if (!iso) return "—";
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return iso;
  return format(parsed, "dd/MM/yyyy");
}

export function formatDateLong(iso: string) {
  if (!iso) return "—";
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return iso;
  return format(parsed, "d MMMM yyyy", { locale: localeId });
}

export function formatDateTime(iso: string) {
  if (!iso) return "—";
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return iso;
  return format(parsed, "dd MMM yyyy, HH:mm", { locale: localeId });
}

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function parseAmount(raw: string) {
  const cleaned = raw.replace(/[^\d]/g, "");
  if (!cleaned) return NaN;
  return Number(cleaned);
}

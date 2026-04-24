import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function formatMonthLabel(month: string) {
  const monthDate = parse(`${month}-01`, "yyyy-MM-dd", new Date());
  return format(monthDate, "MMM yyyy");
}

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Not recorded";
  }

  return format(new Date(date), "dd MMM yyyy");
}

export function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return 0;
  }

  return Number(value) || 0;
}

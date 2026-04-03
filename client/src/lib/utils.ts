import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPower(kw: number): string {
  if (kw >= 1000) {
    return `${(kw / 1000).toFixed(2)} MW`;
  }
  return `${Math.round(kw)} kW`;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormValues<T extends Record<string, string>>(
  formData: FormData,
): T {
  return Object.fromEntries(formData.entries()) as T;
}

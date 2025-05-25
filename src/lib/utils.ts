import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Icon, icons } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const findIconByValue = (value: string): Icon | undefined => {
  return Object.values(icons).find(icon => icon.value === value)
}
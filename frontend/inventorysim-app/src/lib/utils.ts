import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to combine class names conditionally and handle Tailwind CSS merging.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

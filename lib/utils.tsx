import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

/**
 * Merges class names using clsx and tailwind-merge.
 * @param {ClassValue[]} inputs
 * @return {string}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Highlights a given text.
 * @param {string} text
 * @return {string}
 */
export function highlightingText(text: string): string {
  return `<span class='text-purple-500 italic font-semibold'>${text}</span>`;
}

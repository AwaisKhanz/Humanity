/**
 * A utility function that conditionally joins class names together
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(" ").trim()
}

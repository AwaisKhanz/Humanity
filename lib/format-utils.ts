/**
 * Formats an author's name with proper spacing and order
 */
export function formatAuthorName({
  firstName,
  lastName,
  preNominals = "",
  middleInitials = "",
}: {
  firstName: string
  lastName: string
  preNominals?: string
  middleInitials?: string
}) {
  return `${preNominals ? preNominals + " " : ""}${firstName} ${
    middleInitials ? middleInitials + " " : ""
  }${lastName}`.trim()
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

/**
 * Formats a date into a human-readable string
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Format a date.
 * @param timestamp string
 * @return string
 */
export function useFormatedDate(
  timestamp: string,
  timezone?: string,
  time: boolean = true
): string {
  if (!timestamp) return "Date inconnue";

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  if (time) {
    options.minute = "2-digit";
    options.hour = "2-digit";
  }

  const currentTimezone = timezone ?? "fr";

  return new Date(timestamp).toLocaleDateString(currentTimezone, options);
}

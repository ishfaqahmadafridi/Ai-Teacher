/**
 * Calculates a dynamic contextual greeting based on local system time.
 *
 * @param date Optional date instance (defaults to current date/time)
 * @returns "Good Morning", "Good Afternoon", or "Good Evening"
 */
export function getTimeGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  }
  if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

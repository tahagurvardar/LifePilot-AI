/**
 * Returns up to two uppercase initials for a name.
 * Safe against empty strings, extra spaces, and missing values.
 */
export function getInitials(name, fallback = "") {
  const initials = (name || "")
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return initials || fallback;
}

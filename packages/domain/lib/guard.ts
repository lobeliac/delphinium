/**
 * Checks if a value is null or undefined.
 * @param value - The value to check.
 * @returns True if the value is null or undefined, false otherwise.
 */
export function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Checks if a numeric value falls outside a specified range.
 * @param value - The number to check.
 * @param min - The minimum allowed value.
 * @param max - The maximum allowed value.
 * @returns True if the value is less than min or greater than max, false otherwise.
 */
export function isBetween(value: number, min: number, max: number): boolean {
  return value < min || value > max;
}

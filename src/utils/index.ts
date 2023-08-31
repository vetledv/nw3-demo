/**
 * Generic type predicate fn to filter falsy values.
 *
 * Usage: `someArray.filter(notEmpty)`
 *
 * @link https://stackoverflow.com/a/46700791
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) {
    return false;
  }
  return true;
}

/**
 * Checks if a date is older than specified interval `millis`
 * @param date the date to compare with now
 * @param millis amount of ms
 * @returns boolean
 */
export function olderThanMillis(date: Date, millis: number) {
  const msDiff = new Date().getTime() - date.getTime();
  return msDiff > millis;
}

/**
 * Remove duplicate objects by property
 * @param items array of objects
 * @param comparatorKey the property on the item to compare with
 * @returns [Array<T>, Set<T[K]>
 */
export function filterDuplicates<T extends object, K extends keyof T>(
  items: Array<T | undefined | null>,
  comparatorKey: K
): [Array<T>, Set<T[K]>] {
  const uniqueIds = new Set<T[K]>();
  const filteredItems: Array<T> = [];

  for (const item of items) {
    if (item === null || item === undefined) {
      continue;
    }
    const id = item[comparatorKey];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      filteredItems.push(item);
    }
  }
  return [filteredItems, uniqueIds];
}
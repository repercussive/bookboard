export default function exclude<T extends { [key: string]: any }, K extends keyof T>(
  original: T,
  ...keysToExclude: K[]
): Omit<T, K> {
  const result = { ...original }
  keysToExclude.forEach((key) => delete result[key])
  return result
}
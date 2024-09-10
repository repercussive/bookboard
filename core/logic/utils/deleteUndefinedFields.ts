/**
 * Deletes, in place, all of an object's fields that have a value of `undefined`.
 * @param obj The object whose undefined fields are to be deleted.
 * @returns The object with its undefined fields removed.
 */
export default function deleteUndefinedFields<T extends { [key: string]: any }>(obj: T) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  })
  return obj
}
export const getFreezeObj = (obj: any) => {
  if (!obj) {
    return obj
  }
  const objType = typeof obj;
  if (objType !== 'object' && objType !== 'function') {
    return obj
  }
  return Object.freeze(obj)
}
export function omit(obj, ...keysToOmit) {
    const newObj = { ...obj };
    for (const key of keysToOmit) {
      delete newObj[key];
    }
    return newObj;
}
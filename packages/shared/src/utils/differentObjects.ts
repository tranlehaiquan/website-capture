// get different between two objects
export const differentObjects = (obj1: any, obj2: any) => {
  const result: any = {};
  const keys = Object.keys(obj2);
  for (const key of keys) {
    if (obj1[key] !== obj2[key]) {
      result[key] = obj2[key];
    }
  }

  return result;
};
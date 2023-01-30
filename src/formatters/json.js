import _ from 'lodash';

const createItem = (key, change, value) => ({
  key,
  change,
  value,
});
const createUpdatedItem = (key, change, oldValue, value) => ({
  key,
  change,
  oldValue,
  value,
});

const isObject = (value, iter) => {
  if (_.isObject(value)) return iter(value);
  return value;
};

export default (diff) => {
  const iter = (tree) => {
    const keys = Object.keys(tree);
    const result = keys.reduce((acc, key, index) => {
      const splitedKey = key.split(' ');
      const sign = splitedKey[0];
      const actualKey = splitedKey[splitedKey.length - 1];
      const value = tree[key];

      const nextSplitedKey = keys[index + 1] ? keys[index + 1].split(' ') : [];
      const nextActualKey = nextSplitedKey[nextSplitedKey.length - 1];
      const nextValue = tree[nextSplitedKey.join(' ')];

      const previousSplitedKey = keys[index - 1] ? keys[index - 1].split(' ') : [];
      const previousActualKey = previousSplitedKey[previousSplitedKey.length - 1];

      if (actualKey === previousActualKey) return acc;

      if (actualKey === nextActualKey) return [...acc, createUpdatedItem(actualKey, 'updated', isObject(value, iter), isObject(nextValue, iter))];
      if (actualKey !== nextActualKey) {
        if (sign === '-' || sign === '+') {
          return sign === '-' ? [...acc, createItem(actualKey, 'removed', isObject(value, iter))] : [...acc, createItem(actualKey, 'added', isObject(value, iter))];
        }
      }
      return [...acc, createItem(actualKey, null, isObject(value, iter))];
    }, []);
    return result;
  };

  return JSON.stringify(iter(diff));
};

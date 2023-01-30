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
    let result = [];
    const keys = Object.keys(tree);
    keys.forEach((key, index) => {
      const splitedKey = key.split(' ');
      const sign = splitedKey[0];
      const actualKey = splitedKey[splitedKey.length - 1];
      const value = tree[key];

      const nextSplitedKey = keys[index + 1] ? keys[index + 1].split(' ') : [];
      const nextActualKey = nextSplitedKey[nextSplitedKey.length - 1];
      const nextValue = tree[nextSplitedKey.join(' ')];

      const previousSplitedKey = keys[index - 1] ? keys[index - 1].split(' ') : [];
      const previousActualKey = previousSplitedKey[previousSplitedKey.length - 1];

      if (actualKey === previousActualKey) return;

      if (actualKey === nextActualKey) result = [...result, createUpdatedItem(actualKey, 'updated', isObject(value, iter), isObject(nextValue, iter))];
      if (sign !== '+' && sign !== '-') result = [...result, createItem(actualKey, null, isObject(value, iter))];
      if (sign === '-' && actualKey !== nextActualKey) result = [...result, createItem(actualKey, 'removed', isObject(value, iter))];
      if (sign === '+' && actualKey !== nextActualKey) result = [...result, createItem(actualKey, 'added', isObject(value, iter))];
    });
    return result;
  };

  return JSON.stringify(iter(diff));
};

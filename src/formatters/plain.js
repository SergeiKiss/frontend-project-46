import _ from 'lodash';

export default (diff) => {
  const startPhrase = (path) => `Property '${path}'`;
  const added = (addedValue = '[complex value]') => {
    if (addedValue === '[complex value]') return ` was added with value: ${addedValue}`;
    if (_.isString(addedValue)) return ` was added with value: '${addedValue}'`;
    return ` was added with value: ${addedValue}`;
  };
  const removed = ' was removed';
  const updated = (oldValue, newValue) => {
    const values = [oldValue, newValue];
    const newValues = values.reduce((acc, val) => {
      if (_.isObject(val)) return [...acc, '[complex value]'];
      if (_.isString(val)) return [...acc, `'${val}'`];
      return [...acc, `${val}`];
    }, []);
    return ` was updated. From ${newValues[0]} to ${newValues[1]}`;
  };
  const createPhrase = (start, condition) => `${start}${condition}\n`;

  const iter = (tree, currentPath) => {
    let result = '';
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

      const newCurrentPath = [...currentPath, actualKey];
      const strPath = newCurrentPath.join('.');

      if (actualKey === nextActualKey) {
        result += createPhrase(startPhrase(strPath), updated(value, nextValue));
      }
      if (sign !== '+' && sign !== '-' && _.isObject(value)) result += iter(value, newCurrentPath);
      if (sign === '-' && actualKey !== nextActualKey) result += createPhrase(startPhrase(strPath), removed);
      if (sign === '+' && actualKey !== nextActualKey) result += createPhrase(startPhrase(strPath), _.isObject(value) ? added() : added(value));
    });
    return result;
  };

  return iter(diff, []).trimEnd();
};

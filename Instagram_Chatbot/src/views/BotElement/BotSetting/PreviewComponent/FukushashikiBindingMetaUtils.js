import { FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX } from '../../../../variables/amazonPayConstants';

export { FUKUSHIASHIKI_SELECTOR_VALUE_SUFFIX };

export const splitSourceSelectors = (rawValue) => {
  if (typeof rawValue !== 'string') return [];
  return rawValue
    .split(',')
    .map((selector) => selector.trim())
    .filter(Boolean);
};

export const buildBindingsFromSelectorKey = ({ selectorKeyType, rawValue, valuePath }) => {
  if (!selectorKeyType || !valuePath) return [];

  return splitSourceSelectors(rawValue).map((sourceSelector) => ({
    selectorKeyType,
    sourceSelector,
    valuePath,
  }));
};

export const bindingsFromFieldTypes = ({
  content,
  fieldTypes,
  getSelectorKeyType,
  getValuePath,
  shouldIncludeField = () => true,
}) => {
  const bindings = [];

  fieldTypes.forEach((fieldType) => {
    if (!shouldIncludeField(fieldType, content)) return;

    const selectorKeyType = getSelectorKeyType(fieldType);
    const valuePath = getValuePath(fieldType);
    const rawValue = content[selectorKeyType];

    bindings.push(...buildBindingsFromSelectorKey({ selectorKeyType, rawValue, valuePath }));
  });

  return bindings;
};

export const appendBinding = (bindings, seen, binding) => {
  if (!binding?.selectorKeyType || !binding?.sourceSelector || !binding?.valuePath) return;

  const dedupeKey = `${binding.selectorKeyType}::${binding.sourceSelector}`;
  if (seen.has(dedupeKey)) return;

  seen.add(dedupeKey);
  bindings.push(binding);
};

export const appendBindings = (bindings, seen, newBindings) => {
  (newBindings || []).forEach((binding) => appendBinding(bindings, seen, binding));
};

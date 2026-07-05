import _ from 'lodash';
import {
  collectSelectorValuesFromBindings,
  extractSelectorBindingsFromMessages,
} from './AmazonPaySelectorUtils';

export const mapAmazonPayDataBySelector = (payload, messagesList) => {
  const { selectorValues = [] } = payload || {};
  if (!selectorValues.length) {
    return { messagesList, changed: false };
  }

  const newMessages = _.cloneDeep(messagesList);
  let changed = false;

  newMessages.forEach((msg) => {
    if (msg.belong_to !== 'user' || !msg.is_used_when_amazon_pay) return;

    (msg.message_content || []).forEach((content) => {
      selectorValues.forEach(({ selectorKeyType, sourceSelector, valuePath, value }) => {
        if (!selectorKeyType || !sourceSelector || !valuePath) return;
        if (String(value || '').trim() === '') return;
        if (content[selectorKeyType] !== sourceSelector) return;

        const currentValue = _.get(content, valuePath);
        if (currentValue === value) return;

        _.set(content, valuePath, value);
        changed = true;
      });
    });
  });

  return { messagesList: newMessages, changed };
};

export const buildAmazonSelectorPayloadFromMessages = ({
  scenarioMessages,
  selectorBindings,
  cartSystem,
  domain,
  documentRef = typeof document !== 'undefined' ? document : null,
}) => {
  const bindings = selectorBindings?.length
    ? selectorBindings
    : extractSelectorBindingsFromMessages(scenarioMessages);

  const selectorValues = collectSelectorValuesFromBindings({
    bindings,
    documentRef,
  });

  return {
    meta: {
      cartSystem,
      domain,
      configVersion: 1,
      source: 'sdk-v2',
    },
    selectorValues,
  };
};

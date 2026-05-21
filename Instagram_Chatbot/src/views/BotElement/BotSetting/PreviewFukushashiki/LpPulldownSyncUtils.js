import _ from 'lodash';
import { MESSAGE_CONTENT_TYPES } from '../PreviewComponent/Constants.jsx';

const LP_INTEGRATION_OPTION = MESSAGE_CONTENT_TYPES.PULLDOWN.LP_INTEGRATION_OPTION;

const matchesBinding = (content, searchMode, searchAddress) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.PULL_DOWN) return false;
  const pullDown = content.pull_down;
  if (!pullDown || pullDown.type !== LP_INTEGRATION_OPTION) return false;

  const mode = pullDown.lp_element_search_mode;
  const address = pullDown.lp_element_search_value;
  if (mode == null || address == null) return false;

  return String(mode) === String(searchMode) && String(address) === String(searchAddress);
};

/**
 * Apply LP select value to matching lp_integration_option pull_down contents.
 * @returns {{ messagesList: object[], changed: boolean }}
 */
const applyLpPulldownValue = (messagesList, { searchMode, searchAddress, value, pulldownType }) => {
  if (pulldownType && pulldownType !== LP_INTEGRATION_OPTION) {
    return { messagesList, changed: false };
  }
  if (searchMode == null || searchAddress == null || searchAddress === '') {
    return { messagesList, changed: false };
  }

  const normalizedValue = value == null ? '' : String(value);
  const nextList = _.cloneDeep(messagesList);
  let changed = false;

  nextList.forEach((message) => {
    if (!message?.message_content?.length) return;

    message.message_content.forEach((content) => {
      if (!matchesBinding(content, searchMode, searchAddress)) return;

      const current = content.pull_down.lp_integration_option?.value ?? '';
      if (String(current) === normalizedValue) return;

      content.pull_down.lp_integration_option.value = normalizedValue;
      changed = true;
    });
  });

  return { messagesList: nextList, changed };
};

export { applyLpPulldownValue, matchesBinding };

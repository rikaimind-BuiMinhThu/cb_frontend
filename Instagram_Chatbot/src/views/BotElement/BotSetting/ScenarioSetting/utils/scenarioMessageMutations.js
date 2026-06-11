/**
 * Mutates message content in-place (matches legacy Scenario.jsx behavior).
 * Caller must spread the messages array when updating React state.
 */
export const mutateMessageContent = (
  dataMessages,
  indexMessage,
  indexContent,
  type,
  value,
  name,
  subField,
  indexSubField,
  subName,
  variable,
) => {
  if (variable !== undefined) {
    if (dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName] === undefined) {
      dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName] = {};
    }
    dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName][variable] = value;
  } else if (subName !== undefined) {
    if (dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] === undefined) {
      dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] = {};
    }
    dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField][subName] = value;
  } else if (indexSubField !== undefined) {
    if (dataMessages[indexMessage].message_content[indexContent][type][name][subField] === undefined) {
      dataMessages[indexMessage].message_content[indexContent][type][name][subField] = {};
    }
    dataMessages[indexMessage].message_content[indexContent][type][name][subField][indexSubField] = value;
  } else if (subField !== undefined) {
    if (dataMessages[indexMessage].message_content[indexContent][type][name] === undefined) {
      dataMessages[indexMessage].message_content[indexContent][type][name] = {};
    }
    dataMessages[indexMessage].message_content[indexContent][type][name][subField] = value;
  } else if (name !== undefined) {
    if (name === 'card_linked_setting') {
      if (dataMessages[indexMessage].message_content[indexContent][type] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type] = {};
        dataMessages[indexMessage].message_content[indexContent][type][name] = [];
      }
      if (!Array.isArray(dataMessages[indexMessage].message_content[indexContent][type][name])) {
        const checkBoxValue = dataMessages[indexMessage].message_content[indexContent][type][name];
        dataMessages[indexMessage].message_content[indexContent][type][name] = [];
        dataMessages[indexMessage].message_content[indexContent][type][name].push(checkBoxValue);
      }
      if (dataMessages[indexMessage].message_content[indexContent][type][name].includes(value)) {
        dataMessages[indexMessage].message_content[indexContent][type][name] = dataMessages[indexMessage].message_content[indexContent][type][name].filter((el) => el !== value);
      } else {
        dataMessages[indexMessage].message_content[indexContent][type][name].push(value);
      }
    } else {
      if (dataMessages[indexMessage].message_content[indexContent][type] === undefined) {
        dataMessages[indexMessage].message_content[indexContent][type] = {};
      }
      dataMessages[indexMessage].message_content[indexContent][type][name] = value;
    }
  } else {
    dataMessages[indexMessage].message_content[indexContent][type] = value;
  }
};

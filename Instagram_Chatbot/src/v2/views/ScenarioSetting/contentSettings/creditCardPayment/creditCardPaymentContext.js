export const buildCreditCardPaymentContext = (props) => {
  const { indexMessageSelect, indexContent, content, onChangeValueMessageContent, dataMessages } = props;
  const creditCardPayment = content.credit_card_payment;

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const changeMessageContentField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const getMessageContentField = (field) =>
    dataMessages[indexMessageSelect]?.message_content[indexContent]?.[field];

  return {
    creditCardPayment,
    changeField,
    changeMessageContentField,
    getMessageContentField,
  };
};

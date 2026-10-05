export const buildCardPaymentRadioContext = (props) => {
  const { content } = props;
  return {
    cardPaymentRadioButton: content.card_payment_radio_button,
  };
};

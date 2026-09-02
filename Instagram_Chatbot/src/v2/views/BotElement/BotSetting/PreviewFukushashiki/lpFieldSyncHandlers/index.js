import { MESSAGE_CONTENT_TYPES } from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants.jsx';
import cardPaymentRadioButtonHandler from './cardPaymentRadioButtonHandler';

const getLpFieldSyncHandler = (contentType) => {
  switch (contentType) {
    case MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON:
      return cardPaymentRadioButtonHandler;
    default:
      return null;
  }
};

export { getLpFieldSyncHandler, cardPaymentRadioButtonHandler };

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { CARD_PAYMENT_RADIO_TYPES } from '../../constants/contentTypeConstants';
import { SETTING_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import { buildCardPaymentRadioContext } from './cardPaymentRadioButtonContext';

const CardPaymentAddButton = (props) => {
  const { indexMessageSelect, indexContent, content, dataMessages, setDataMessages } = props;
  const { cardPaymentRadioButton } = buildCardPaymentRadioContext(props);

  const renderAddDefault = () => {
    const arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
    const idMax = arrMess.length !== 0 ? Math.max(...arrMess.map((item) => item.id)) + 1 : 1;
    dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents.push({ id: idMax });
    setDataMessages([...dataMessages]);
  };

  const renderAddPicture = () => {
    const arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img];
    const idMax = arrMess.length !== 0 ? Math.max(...arrMess.map((item) => item.id)) + 1 : 1;
    dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img.push({
      id: idMax,
      contents: [{ id: 1 }],
    });
    setDataMessages([...dataMessages]);
  };

  const renderOnClick = () => {
    switch (cardPaymentRadioButton.type) {
      case CARD_PAYMENT_RADIO_TYPES.PICTURE_RADIO:
        renderAddPicture();
        break;
      case CARD_PAYMENT_RADIO_TYPES.DEFAULT:
      case CARD_PAYMENT_RADIO_TYPES.CUSTOMIZED_STYLE:
      default:
        renderAddDefault();
        break;
    }
  };

  return (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-card-payment-radio-setting__add-wrap">
        <Button className="ss-card-payment-radio-setting__add-btn" onClick={renderOnClick}>
          {SETTING_BUTTON_LABELS.add}
        </Button>
      </div>
    </div>
  );
};

CardPaymentAddButton.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
};

export default CardPaymentAddButton;

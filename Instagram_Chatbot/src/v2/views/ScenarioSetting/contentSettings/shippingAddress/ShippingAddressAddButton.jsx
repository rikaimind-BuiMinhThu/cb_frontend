import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { SETTING_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import { buildShippingAddressContext } from './shippingAddressContext';

const ShippingAddressAddButton = (props) => {
  const { indexMessageSelect, indexContent, content, dataMessages, setDataMessages } = props;
  buildShippingAddressContext(props);

  const renderAddButton = () => (
    <Button
      className="ss-shipping-address-setting__add-btn"
      onClick={() => {
        const arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
        const idMax = arrMess.length !== 0 ? Math.max(...arrMess.map((item) => item.id)) + 1 : 1;
        dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents.push({ id: idMax });
        setDataMessages([...dataMessages]);
      }}
    >
      {SETTING_BUTTON_LABELS.add}
    </Button>
  );

  return (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-shipping-address-setting__add-wrap">{renderAddButton()}</div>
    </div>
  );
};

ShippingAddressAddButton.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
};

export default ShippingAddressAddButton;

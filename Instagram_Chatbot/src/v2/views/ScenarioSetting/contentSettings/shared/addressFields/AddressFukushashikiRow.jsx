import React from 'react';
import PropTypes from 'prop-types';
import FukushashikiSearchRow from '../FukushashikiSearchRow';
import { FUKUSHASHIKI_VARIANTS } from '../../../constants/scenarioSettingLabels';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';

const AddressFukushashikiRow = ({ modeKey, valueKey, selectId, ...props }) => {
  const { isUseFukushashiki, getFukushashikiProps } = buildAddressFieldSettingContext(props);

  if (!isUseFukushashiki) return null;

  const fukushashikiProps = getFukushashikiProps(modeKey, valueKey, selectId);

  return (
    <FukushashikiSearchRow
      {...fukushashikiProps}
      variant={FUKUSHASHIKI_VARIANTS.TEXT_INPUT_ROW}
      useFukushashiki
      maxLength={250}
      rowClassName="ss-address-field-section__fukushashiki"
    />
  );
};

AddressFukushashikiRow.propTypes = {
  modeKey: PropTypes.string.isRequired,
  valueKey: PropTypes.string.isRequired,
  selectId: PropTypes.string.isRequired,
};

export default AddressFukushashikiRow;

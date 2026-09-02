import React from 'react';
import PropTypes from 'prop-types';
import FukushashikiSearchRow from '../../shared/FukushashikiSearchRow';
import { FUKUSHASHIKI_VARIANTS } from '../../../constants/scenarioSettingLabels';

const CreditCardFukushashikiField = ({
  prefix,
  isUseFukushashiki,
  getMessageContentField,
  changeMessageContentField,
}) => {
  if (!isUseFukushashiki) return null;

  const renderFukushashikiRow = () => (
    <FukushashikiSearchRow
      variant={FUKUSHASHIKI_VARIANTS.COMPACT}
      rowClassName="ss-credit-card-setting__fukushashiki-row"
      mode={getMessageContentField(`${prefix}_fukushashiki_search_mode`)}
      inputValue={getMessageContentField(`${prefix}_fukushashiki_search_value`)}
      onModeChange={changeMessageContentField(`${prefix}_fukushashiki_search_mode`)}
      onInputChange={changeMessageContentField(`${prefix}_fukushashiki_search_value`)}
      useFukushashiki
    />
  );

  return renderFukushashikiRow();
};

CreditCardFukushashikiField.propTypes = {
  prefix: PropTypes.string.isRequired,
  isUseFukushashiki: PropTypes.bool,
  getMessageContentField: PropTypes.func.isRequired,
  changeMessageContentField: PropTypes.func.isRequired,
};

export default CreditCardFukushashikiField;

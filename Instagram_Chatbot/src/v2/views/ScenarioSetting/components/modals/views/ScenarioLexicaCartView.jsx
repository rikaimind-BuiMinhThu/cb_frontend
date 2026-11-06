import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from '../../../scenarioCommon/InputCustom';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import { LEXICA_CART_LABELS } from '../../../constants/scenarioSettingLabels';
import {
  LEXICA_ORDER_RESULT_MODE_ASYNC,
  LEXICA_ORDER_RESULT_MODE_WAIT,
} from '../../../utils/lexicaScenario';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalCheckbox from '../shared/ScenarioModalCheckbox';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const ScenarioLexicaCartView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { lexica, merchandiseId } = state;
  const { setLexicaField, setMerchandiseId } = actions;

  return (
    <div className="ss-settings-lexica-cart-view">
      <ScenarioFormRow
        label={LEXICA_CART_LABELS.orderResult}
        tooltip={SCENARIO_MODAL_TOOLTIPS.lexicaOrderResult}
      >
        <select
          className="ss-input-value"
          value={lexica.orderResultMode}
          onChange={(event) => setLexicaField('orderResultMode', event.target.value)}
        >
          <option value={LEXICA_ORDER_RESULT_MODE_WAIT}>
            {LEXICA_CART_LABELS.orderResultWait}
          </option>
          <option value={LEXICA_ORDER_RESULT_MODE_ASYNC}>
            {LEXICA_CART_LABELS.orderResultAsync}
          </option>
        </select>
      </ScenarioFormRow>
      <ScenarioFormRow
        label={LEXICA_CART_LABELS.productSku}
        tooltip={SCENARIO_MODAL_TOOLTIPS.lexicaProductSku}
      >
        <InputCustom
          value={merchandiseId}
          onChange={(value) => setMerchandiseId(value)}
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label={LEXICA_CART_LABELS.cartUrl}
        tooltip={SCENARIO_MODAL_TOOLTIPS.lexicaCartUrl}
      >
        <InputCustom
          value={lexica.lexicaCartUrl}
          onChange={(value) => setLexicaField('lexicaCartUrl', value)}
          placeholder={LEXICA_CART_LABELS.cartUrlPlaceholder}
        />
      </ScenarioFormRow>
      <div className="ss-layout-checkbox-item">
        <ScenarioModalCheckbox
          checked={lexica.lexicaOfferConfirmUpsell}
          onChange={(checked) => setLexicaField('lexicaOfferConfirmUpsell', checked)}
          label={LEXICA_CART_LABELS.confirmUpsell}
        />
      </div>
      <div className="ss-layout-checkbox-item">
        <ScenarioModalCheckbox
          checked={lexica.lexicaOfferConfirmCrossSell}
          onChange={(checked) => setLexicaField('lexicaOfferConfirmCrossSell', checked)}
          label={LEXICA_CART_LABELS.confirmCrossSell}
        />
      </div>
      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

ScenarioLexicaCartView.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ScenarioLexicaCartView;

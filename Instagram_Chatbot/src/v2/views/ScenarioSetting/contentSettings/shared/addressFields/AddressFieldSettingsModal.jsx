import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import ScenarioModalShell from '../../../components/modals/shared/ScenarioModalShell';
import ScenarioModalFooter from '../../../components/modals/shared/ScenarioModalFooter';
import AddressLayoutOptions from './AddressLayoutOptions';
import AddressRequireOptions from './AddressRequireOptions';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';
import { ADDRESS_FIELD_MODAL_LABELS } from '../../../constants/scenarioSettingLabels';

const REQUIRE_LABELS = {
  require: ADDRESS_FIELD_MODAL_LABELS.require,
  all_items_require: ADDRESS_FIELD_MODAL_LABELS.allItemsRequire,
  set_required_for_each_item: ADDRESS_FIELD_MODAL_LABELS.setRequiredForEachItem,
};

const LAYOUT_LABELS = {
  split_postal_code: ADDRESS_FIELD_MODAL_LABELS.splitPostalCode,
  compact_municipality_and_address: ADDRESS_FIELD_MODAL_LABELS.compactMunicipalityAndAddress,
  is_display_address_field: ADDRESS_FIELD_MODAL_LABELS.displayAddressField,
  compact_municipality_and_address_and_building_name: ADDRESS_FIELD_MODAL_LABELS.compactAll,
};

const getActiveSettingLabels = (addressData, showDisplayAddressField) => {
  const labels = [];

  if (addressData.isCheckRequire) {
    labels.push(REQUIRE_LABELS[addressData.isCheckRequire] || addressData.isCheckRequire);
  }

  if (addressData.split_postal_code) labels.push(LAYOUT_LABELS.split_postal_code);
  if (addressData.compact_municipality_and_address) labels.push(LAYOUT_LABELS.compact_municipality_and_address);
  if (showDisplayAddressField && addressData.compact_municipality_and_address && addressData.is_display_address_field) {
    labels.push(LAYOUT_LABELS.is_display_address_field);
  }
  if (addressData.compact_municipality_and_address_and_building_name) {
    labels.push(LAYOUT_LABELS.compact_municipality_and_address_and_building_name);
  }

  return labels;
};

const AddressFieldSettingsModal = ({
  title = ADDRESS_FIELD_MODAL_LABELS.title,
  buttonLabel = ADDRESS_FIELD_MODAL_LABELS.buttonLabel,
  showDisplayAddressField = false,
  requireExtra,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const { addressData } = buildAddressFieldSettingContext(props);

  const activeLabels = useMemo(
    () => getActiveSettingLabels(addressData, showDisplayAddressField),
    [addressData, showDisplayAddressField],
  );

  const closeModal = () => setOpen(false);

  return (
    <>
      <div className="ss-address-field-settings-modal__trigger-row">
        <Button
          type="button"
          className="ss-address-field-settings-modal__trigger-btn"
          onClick={() => setOpen(true)}
        >
          {buttonLabel}
        </Button>
        {activeLabels.length > 0 && (
          <div className="ss-address-field-settings-modal__summary">
            {activeLabels.map((label) => (
              <span key={label} className="ss-address-field-settings-modal__summary-tag">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <ScenarioModalShell
        open={open}
        onClose={closeModal}
        title={title}
        width={560}
        className="ss-address-field-settings-modal"
        footer={(
          <ScenarioModalFooter
            onClose={closeModal}
            showConfirm={false}
          />
        )}
      >
        <div className="ss-address-field-settings-modal__body">
          <section className="ss-address-field-settings-modal__section">
            <h5 className="ss-address-field-settings-modal__section-title">{ADDRESS_FIELD_MODAL_LABELS.requireSection}</h5>
            <AddressRequireOptions {...props}>
              {requireExtra}
            </AddressRequireOptions>
          </section>
          <section className="ss-address-field-settings-modal__section">
            <h5 className="ss-address-field-settings-modal__section-title">{ADDRESS_FIELD_MODAL_LABELS.layoutSection}</h5>
            <AddressLayoutOptions {...props} showDisplayAddressField={showDisplayAddressField} />
          </section>
        </div>
      </ScenarioModalShell>
    </>
  );
};

AddressFieldSettingsModal.propTypes = {
  title: PropTypes.string,
  buttonLabel: PropTypes.string,
  showDisplayAddressField: PropTypes.bool,
  requireExtra: PropTypes.node,
};

export default AddressFieldSettingsModal;

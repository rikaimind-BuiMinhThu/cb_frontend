import React from 'react';
import PropTypes from 'prop-types';
import ConsumptionTaxSection from './settings/ConsumptionTaxSection';
import SpecifyGatewaySection from './settings/SpecifyGatewaySection';
import SettlementFeeSection from './settings/SettlementFeeSection';
import ShippingFeeSection from './settings/ShippingFeeSection';
import NpDeferredSection from './settings/NpDeferredSection';

const PaymentSettingsTab = ({ settings }) => (
  <div className="payment-settings-wrap">
    <ConsumptionTaxSection
      openTax={settings.openTax}
      setOpenTax={settings.setOpenTax}
      saleTaxRate={settings.saleTaxRate}
      setSaleTaxRate={settings.setSaleTaxRate}
      calculateOneYen={settings.calculateOneYen}
      setCalculateOneYen={settings.setCalculateOneYen}
      taxSaving={settings.taxSaving}
      onSave={settings.onSaveConsumptionTax}
    />
    <SpecifyGatewaySection
      noCan={settings.noCan}
      setNoCan={settings.setNoCan}
      listvar={settings.listvar}
      paymentGateway={settings.paymentGateway}
      specifyVariableId={settings.specifyVariableId}
      setSpecifyVariableId={settings.setSpecifyVariableId}
      specifyRows={settings.specifyRows}
      specifyErrors={settings.specifyErrors}
      onUpdateSpecifyRow={settings.onUpdateSpecifyRow}
      onAdd={settings.onAddSpecifyPaymentGW}
      onDelete={settings.onDeleteSpecifyPaymentGW}
      onSave={settings.onSaveSpecifyPaymentGateway}
    />
    <SettlementFeeSection
      noPaid={settings.noPaid}
      setNoPaid={settings.setNoPaid}
      listvar={settings.listvar}
      settlementVariableId={settings.settlementVariableId}
      setSettlementVariableId={settings.setSettlementVariableId}
      settlementRows={settings.settlementRows}
      settlementErrors={settings.settlementErrors}
      onUpdateSettlementRow={settings.onUpdateSettlementRow}
      onAdd={settings.onAddSettlementPaymentGW}
      onDelete={settings.onDeleteSettlementPaymentGW}
      onSave={settings.onSaveSettlementPaymentGateway}
    />
    <ShippingFeeSection
      noShip={settings.noShip}
      setNoShip={settings.setNoShip}
      listvar={settings.listvar}
      prefectures={settings.prefectures}
      shippingVariableId={settings.shippingVariableId}
      setShippingVariableId={settings.setShippingVariableId}
      shippingRows={settings.shippingRows}
      shippingErrors={settings.shippingErrors}
      onUpdateShippingRow={settings.onUpdateShippingRow}
      onSave={settings.onSavePrefecturesTax}
    />
    <NpDeferredSection
      noNP={settings.noNP}
      setNoNP={settings.setNoNP}
      npInvoiceIncluded={settings.npInvoiceIncluded}
      setNpInvoiceIncluded={settings.setNpInvoiceIncluded}
      npMaximumAmount={settings.npMaximumAmount}
      setNpMaximumAmount={settings.setNpMaximumAmount}
      npMaxAmountError={settings.npMaxAmountError}
      npRows={settings.npRows}
      npErrors={settings.npErrors}
      onUpdateNpRow={settings.onUpdateNpRow}
      onAdd={settings.onAddSettlementFee}
      onDelete={settings.onDeleteSettlementFee}
      onSave={settings.onSaveNPDeferredPayment}
    />
  </div>
);

PaymentSettingsTab.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default PaymentSettingsTab;

import React from 'react';
import ConsumptionTaxSection from './settings/ConsumptionTaxSection';
import SpecifyGatewaySection from './settings/SpecifyGatewaySection';
import SettlementFeeSection from './settings/SettlementFeeSection';
import ShippingFeeSection from './settings/ShippingFeeSection';
import NpDeferredSection from './settings/NpDeferredSection';

function PaymentSettingsTab({
  openTax,
  setOpenTax,
  saleTaxRate,
  setSaleTaxRate,
  calculateOneYen,
  setCalculateOneYen,
  taxSaving,
  noCan,
  setNoCan,
  noPaid,
  setNoPaid,
  noShip,
  setNoShip,
  noNP,
  setNoNP,
  listvar,
  payment,
  paymentGateway,
  prefectures,
  customDivSpecifyPaymentGW,
  customDivSettlementPaymentGW,
  customDivSettlementFee,
  onAddSpecifyPaymentGW,
  onDeleteSpecifyPaymentGW,
  onAddSettlementPaymentGW,
  onDeleteSettlementPaymentGW,
  onAddSettlementFee,
  onDeleteSettlementFee,
  onSaveConsumptionTax,
  onSaveSpecifyPaymentGateway,
  onSaveSettlementPaymentGateway,
  onSavePrefecturesTax,
  onSaveNPDeferredPayment,
}) {
  return (
    <div className="payment-settings-wrap">
      <ConsumptionTaxSection
        openTax={openTax}
        setOpenTax={setOpenTax}
        saleTaxRate={saleTaxRate}
        setSaleTaxRate={setSaleTaxRate}
        calculateOneYen={calculateOneYen}
        setCalculateOneYen={setCalculateOneYen}
        taxSaving={taxSaving}
        onSave={onSaveConsumptionTax}
      />
      <SpecifyGatewaySection
        noCan={noCan}
        setNoCan={setNoCan}
        listvar={listvar}
        payment={payment}
        paymentGateway={paymentGateway}
        customDivSpecifyPaymentGW={customDivSpecifyPaymentGW}
        onAdd={onAddSpecifyPaymentGW}
        onDelete={onDeleteSpecifyPaymentGW}
        onSave={onSaveSpecifyPaymentGateway}
      />
      <SettlementFeeSection
        noPaid={noPaid}
        setNoPaid={setNoPaid}
        listvar={listvar}
        payment={payment}
        customDivSettlementPaymentGW={customDivSettlementPaymentGW}
        onAdd={onAddSettlementPaymentGW}
        onDelete={onDeleteSettlementPaymentGW}
        onSave={onSaveSettlementPaymentGateway}
      />
      <ShippingFeeSection
        noShip={noShip}
        setNoShip={setNoShip}
        listvar={listvar}
        payment={payment}
        prefectures={prefectures}
        onSave={onSavePrefecturesTax}
      />
      <NpDeferredSection
        noNP={noNP}
        setNoNP={setNoNP}
        payment={payment}
        customDivSettlementFee={customDivSettlementFee}
        onAdd={onAddSettlementFee}
        onDelete={onDeleteSettlementFee}
        onSave={onSaveNPDeferredPayment}
      />
    </div>
  );
}

export default PaymentSettingsTab;

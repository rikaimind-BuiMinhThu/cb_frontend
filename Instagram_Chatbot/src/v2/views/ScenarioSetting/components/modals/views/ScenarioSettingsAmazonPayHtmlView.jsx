import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { AMAZON_PAY_HTML_LABELS } from '../../../constants/amazonPayHtmlLabels';
import {
  amazonPayHtmlModeLabel,
  listAmazonPayHtmlRows,
} from '../../../utils/amazonPayHtmlMappingUtils';

const ScenarioSettingsAmazonPayHtmlView = ({ onBack }) => {
  const { state } = useScenarioEditor();
  const { dataMessages } = state;
  const rows = listAmazonPayHtmlRows(dataMessages);

  return (
    <div className="ss-amazon-pay-html-view">
      <p className="ss-settings-help-text">{AMAZON_PAY_HTML_LABELS.description}</p>
      {rows.length === 0 && (
        <p className="ss-amazon-pay-html-view__empty">{AMAZON_PAY_HTML_LABELS.emptyState}</p>
      )}
      {rows.length > 0 && (
        <div className="ss-amazon-pay-html-table">
          <div className="ss-amazon-pay-html-table__header">
            <span>{AMAZON_PAY_HTML_LABELS.chatField}</span>
            <span>{AMAZON_PAY_HTML_LABELS.searchMode}</span>
            <span>{AMAZON_PAY_HTML_LABELS.lpSelector}</span>
          </div>
          {rows.map((row) => (
            <div key={row.rowKey} className="ss-amazon-pay-html-table__row">
              <span className="ss-amazon-pay-html-table__label">{row.label}</span>
              <span className="ss-amazon-pay-html-table__mode">{amazonPayHtmlModeLabel(row.mode)}</span>
              <span className="ss-amazon-pay-html-table__value">
                {row.value || AMAZON_PAY_HTML_LABELS.emptySelector}
              </span>
            </div>
          ))}
        </div>
      )}
      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioSettingsAmazonPayHtmlView;

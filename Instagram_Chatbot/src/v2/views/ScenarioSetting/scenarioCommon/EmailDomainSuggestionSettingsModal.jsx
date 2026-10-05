import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OverviewCheckboxRow from '../components/OverviewCheckboxRow';
import ScenarioModalShell from '../components/modals/shared/ScenarioModalShell';
import ScenarioModalFooter from '../components/modals/shared/ScenarioModalFooter';
import { EmailDomainSuggestionListContent } from './EmailDomainSuggestionSetting';

const EmailDomainSuggestionSettingsModal = ({
  domainSuggestion,
  onToggleEnabled,
  onChangeMode,
  onChangeDomain,
  onAddDomain,
  onRemoveDomain,
  onResetDomains,
  linkLabel = '設定する →',
  title = 'ドメインサジェスト設定',
}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const isEnabled = Boolean(domainSuggestion?.enabled);

  return (
    <div className="ss-user-setting__item-bottom">
      <OverviewCheckboxRow
        checked={isEnabled}
        onChange={onToggleEnabled}
        label="ドメインサジェストを使用"
        actionButton={isEnabled && (
          <button
            type="button"
            className="ss-settings-modal-action-link"
            onClick={() => setOpen(true)}
          >
            {linkLabel}
          </button>
        )}
      />

      {isEnabled && (
        <ScenarioModalShell
          open={open}
          onClose={closeModal}
          title={title}
          width={560}
          className="ss-email-domain-suggestion-settings-modal"
          footer={(
            <ScenarioModalFooter
              onClose={closeModal}
              showConfirm={false}
            />
          )}
        >
          <EmailDomainSuggestionListContent
            domainSuggestion={domainSuggestion}
            onChangeMode={onChangeMode}
            onChangeDomain={onChangeDomain}
            onAddDomain={onAddDomain}
            onRemoveDomain={onRemoveDomain}
            onResetDomains={onResetDomains}
          />
        </ScenarioModalShell>
      )}
    </div>
  );
}

EmailDomainSuggestionSettingsModal.propTypes = {
  domainSuggestion: PropTypes.object,
  onToggleEnabled: PropTypes.func.isRequired,
  onChangeMode: PropTypes.func.isRequired,
  onChangeDomain: PropTypes.func.isRequired,
  onAddDomain: PropTypes.func.isRequired,
  onRemoveDomain: PropTypes.func.isRequired,
  onResetDomains: PropTypes.func.isRequired,
  linkLabel: PropTypes.string,
  title: PropTypes.string,
};

export default EmailDomainSuggestionSettingsModal;

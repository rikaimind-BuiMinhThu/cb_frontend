import React from 'react';
import { MDBIcon } from 'mdbreact';
import { Button } from 'reactstrap';
import SelectCustom from './SelectCustom';
import InputCustom from './InputCustom';
import { EMAIL_DOMAIN_SUGGESTION_MODES } from 'v2/views/BotElement/BotSetting/PreviewComponent/emailDomainDefaults';

const DOMAIN_MODE_OPTIONS = [
  { key: EMAIL_DOMAIN_SUGGESTION_MODES.SUGGEST, value: 'サジェストのみ' },
  { key: EMAIL_DOMAIN_SUGGESTION_MODES.RESTRICT, value: '指定ドメインのみ' },
];

/** Mode select + domain list + add/reset actions (for use inside a modal). */
export const EmailDomainSuggestionListContent = ({
  domainSuggestion,
  onChangeMode,
  onChangeDomain,
  onAddDomain,
  onRemoveDomain,
  onResetDomains,
}) => {
  const domains = domainSuggestion?.domains || [];

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <SelectCustom
          className="ss-select--full"
          value={domainSuggestion?.mode || EMAIL_DOMAIN_SUGGESTION_MODES.SUGGEST}
          data={DOMAIN_MODE_OPTIONS}
          onChange={onChangeMode}
          keyValue="key"
          allowClear={false}
        />
      </div>
      <div className="ss-email-domain-list">
        {domains.map((item, index) => (
          <div
            key={item.id ?? index}
            className="ss-email-domain-list__row"
          >
            <InputCustom
              className="ss-input--full-mb0"
              placeholder="example.com"
              value={item.domain || ''}
              onChange={(value) => onChangeDomain(index, value)}
            />
            {domains.length > 1 && (
              <MDBIcon
                fas
                className="ss-icon-remove--lg"
                icon="times-circle"
                onClick={() => onRemoveDomain(index)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="ss-email-domain-list__actions">
        <Button
          className="ss-user-setting__select-btn-add ss-email-domain-list__btn"
          onClick={onAddDomain}
        >
          ドメイン追加
        </Button>
        <Button
          className="ss-email-domain-list__btn"
          color="secondary"
          outline
          onClick={onResetDomains}
        >
          デフォルトに戻す
        </Button>
      </div>
    </>
  );
};

export default EmailDomainSuggestionListContent;

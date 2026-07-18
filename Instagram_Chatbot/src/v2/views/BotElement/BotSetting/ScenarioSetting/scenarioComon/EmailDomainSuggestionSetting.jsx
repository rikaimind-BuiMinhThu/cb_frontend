import React from 'react';
import { MDBIcon } from 'mdbreact';
import { Button } from 'reactstrap';
import SelectCustom from './SelectCustom';
import InputCustom from './InputCustom';
import { EMAIL_DOMAIN_SUGGESTION_MODES } from '../../PreviewComponent/emailDomainDefaults';

const DOMAIN_MODE_OPTIONS = [
  { key: EMAIL_DOMAIN_SUGGESTION_MODES.SUGGEST, value: 'サジェストのみ' },
  { key: EMAIL_DOMAIN_SUGGESTION_MODES.RESTRICT, value: '指定ドメインのみ' },
];

/** Mode select + domain list + add/reset actions (for use inside a modal). */
export function EmailDomainSuggestionListContent({
  domainSuggestion,
  onChangeMode,
  onChangeDomain,
  onAddDomain,
  onRemoveDomain,
  onResetDomains,
}) {
  const domains = domainSuggestion?.domains || [];

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <SelectCustom
          style={{ width: '100%' }}
          value={domainSuggestion?.mode || EMAIL_DOMAIN_SUGGESTION_MODES.SUGGEST}
          data={DOMAIN_MODE_OPTIONS}
          onChange={onChangeMode}
          keyValue="key"
          allowClear={false}
        />
      </div>
      <div
        style={{
          backgroundColor: '#F8F9FA',
          width: '100%',
          padding: '5px',
          marginBottom: '10px',
          maxHeight: '320px',
          overflowY: 'auto',
        }}
      >
        {domains.map((item, index) => (
          <div
            key={item.id ?? index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <InputCustom
              style={{ width: '100%', marginBottom: 0 }}
              placeholder="example.com"
              value={item.domain || ''}
              onChange={(value) => onChangeDomain(index, value)}
            />
            {domains.length > 1 && (
              <MDBIcon
                fas
                style={{ fontSize: '22px', cursor: 'pointer' }}
                icon="times-circle"
                onClick={() => onRemoveDomain(index)}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <Button
          style={{ margin: 0, lineHeight: 'normal' }}
          className="ss-user-setting__select-btn-add"
          onClick={onAddDomain}
        >
          ドメイン追加
        </Button>
        <Button
          style={{ margin: 0, lineHeight: 'normal' }}
          color="secondary"
          outline
          onClick={onResetDomains}
        >
          デフォルトに戻す
        </Button>
      </div>
    </>
  );
}

export default EmailDomainSuggestionListContent;

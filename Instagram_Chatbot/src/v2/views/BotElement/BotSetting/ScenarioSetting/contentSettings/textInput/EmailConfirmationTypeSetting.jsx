import React from 'react';
import InputCustom from '../../scenarioComon/InputCustom';
import EmailDomainSuggestionSettingsModal from '../../scenarioComon/EmailDomainSuggestionSettingsModal';
import { buildTextInputSettingContext } from './textInputSettingContext';

const EmailConfirmationTypeSetting = (props) => {
  const { textInput, isUseFukushashiki } = props;
  const {
    typeConfig,
    changeContent,
    renderFukushashikiRow,
    handleChangeEmailDomainSuggestion,
    handleChangeEmailDomainValue,
    handleAddEmailDomain,
    handleRemoveEmailDomain,
    handleResetEmailDomains,
  } = buildTextInputSettingContext(props);

  const emailType = textInput.type;

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          placeholder="プレースホルダ"
          onChange={changeContent(textInput.type, 'cfEmlAdd_email')}
          value={typeConfig?.cfEmlAdd_email || ''}
        />
      </div>
      {isUseFukushashiki &&
        renderFukushashikiRow('value_fukushashiki_search_mode', 'value_fukushashiki_search_value', {
          variant: 'compact',
        })}
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          placeholder="プレースホルダ"
          onChange={changeContent(textInput.type, 'cfEmlAdd_confirm_email')}
          value={typeConfig?.cfEmlAdd_confirm_email || ''}
        />
      </div>
      {isUseFukushashiki &&
        renderFukushashikiRow(
          'valueConfirm_fukushashiki_search_mode',
          'valueConfirm_fukushashiki_search_value',
          {
            variant: 'compact',
          },
        )}
      <EmailDomainSuggestionSettingsModal
        domainSuggestion={typeConfig?.domain_suggestion}
        onToggleEnabled={(value) =>
          handleChangeEmailDomainSuggestion(emailType, 'enabled', value)
        }
        onChangeMode={(value) =>
          handleChangeEmailDomainSuggestion(emailType, 'mode', value)
        }
        onChangeDomain={(indexDomain, value) =>
          handleChangeEmailDomainValue(emailType, indexDomain, value)
        }
        onAddDomain={() => handleAddEmailDomain(emailType)}
        onRemoveDomain={(indexDomain) =>
          handleRemoveEmailDomain(emailType, indexDomain)
        }
        onResetDomains={() => handleResetEmailDomains(emailType)}
      />
    </>
  );
};

export default EmailConfirmationTypeSetting;

import React from 'react';
import InputCustom from '../../scenarioComon/InputCustom';
import EmailDomainSuggestionSettingsModal from '../../scenarioComon/EmailDomainSuggestionSettingsModal';
import { buildTextInputSettingContext } from './textInputSettingContext';

const EmailAddressTypeSetting = (props) => {
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
          onChange={changeContent(textInput.type, 'placeholder')}
          value={typeConfig?.placeholder}
        />
      </div>
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
      {isUseFukushashiki &&
        renderFukushashikiRow('fukushashiki_search_mode', 'fukushashiki_search_value', {
          variant: 'compact',
        })}
    </>
  );
};

export default EmailAddressTypeSetting;

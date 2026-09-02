import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import InputCustom from '../../scenarioComon/InputCustom';
import { convertTextType, rangeText } from '../../constants/scenarioFormConstants';
import { buildTextInputSettingContext } from './textInputSettingContext';
import CharacterLimitRow from './CharacterLimitRow';

const TextTypeSetting = (props) => {
  const { textInput, isUseFukushashiki } = props;
  const {
    messageContent,
    typeConfig,
    changeContent,
    changeMessageField,
    renderFukushashikiRow,
  } = buildTextInputSettingContext(props);

  return (
  <>
    <div className="ss-user-setting-option-row">
      <div className="ss-user-setting-option-row__checkbox">
        <CheckboxCustom
          label="文字を自動変換する"
          onChange={changeContent('isUseConvertText')}
          value={textInput.isUseConvertText}
        />
      </div>
      {textInput.isUseConvertText && (
        <div className="ss-user-setting-option-row__controls">
          <SelectCustom
            id="convertTextTypeSelect"
            allowClear={false}
            value={textInput.convertTextTypeValue}
            data={convertTextType}
            onChange={changeContent('convertTextTypeValue')}
            keyValue="key"
            placeholder="変換タイプを選択"
          />
          {textInput.text.isSplitInput ? (
            <>
              <InputCustom
                placeholder="セル1受信点ID"
                labelClassName="ss-input-custom-label--full"
                maxLength={250}
                useFukushashiki={true}
                onChange={changeMessageField('convertTextDestination1')}
                value={messageContent?.convertTextDestination1}
              />
              <InputCustom
                placeholder="セル2受信点ID"
                labelClassName="ss-input-custom-label--full"
                maxLength={250}
                useFukushashiki={true}
                onChange={changeMessageField('convertTextDestination2')}
                value={messageContent?.convertTextDestination2}
              />
            </>
          ) : (
            <InputCustom
              placeholder="受信反射ポイントIDを入力してください"
              labelClassName="ss-input-custom-label--full"
              maxLength={250}
              useFukushashiki={true}
              onChange={changeMessageField('convertTextDestination')}
              value={messageContent?.convertTextDestination}
            />
          )}
        </div>
      )}
    </div>
    <div className="ss-user-setting-option-row">
      <div className="ss-user-setting-option-row__checkbox">
        <CheckboxCustom
          label="IDのカスタマイズ"
          onChange={changeContent('isCustomID')}
          value={textInput.isCustomID}
        />
      </div>
      {textInput.isCustomID && (
        <div className="ss-user-setting-option-row__controls">
          {textInput.text.isSplitInput ? (
            <>
              <InputCustom
                placeholder="セル 1 のオプション ID"
                labelClassName="ss-input-custom-label--full"
                maxLength={250}
                useFukushashiki={true}
                onChange={changeMessageField('customId1')}
                value={messageContent?.customId1}
              />
              <InputCustom
                placeholder="セル 2 のオプション ID"
                labelClassName="ss-input-custom-label--full"
                maxLength={250}
                useFukushashiki={true}
                onChange={changeMessageField('customId2')}
                value={messageContent?.customId2}
              />
            </>
          ) : (
            <InputCustom
              placeholder="オプションIDを入力してください"
              labelClassName="ss-input-custom-label--full"
              maxLength={250}
              useFukushashiki={true}
              onChange={changeMessageField('customId')}
              value={messageContent?.customId}
            />
          )}
        </div>
      )}
    </div>
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        id="range"
        value={textInput?.text?.range || 'no_input'}
        data={rangeText}
        onChange={changeContent(textInput.type, 'range')}
        keyValue="key"
      />
    </div>
    <CharacterLimitRow
      typeConfig={typeConfig}
      onChangeFrom={changeContent(textInput.type, 'character_limit_from')}
      onChangeTo={changeContent(textInput.type, 'character_limit_to')}
    />
    <div className="ss-user-setting__item-bottom">
      <InputDouble
        showSecondInput={!!typeConfig?.isSplitInput}
        classCustom={typeConfig?.isSplitInput ? 'ss-user-setting-double-input--split' : ''}
        icon={typeConfig?.isSplitInput ? 'minus-circle' : 'plus-circle'}
        valueLeft={typeConfig?.placeholderLeft}
        valueRight={typeConfig?.placeholderRight}
        onChange={(value, name) =>
          changeContent(textInput.type, name === 'left' ? 'placeholderLeft' : 'placeholderRight')(value)
        }
        onClickIcon={() =>
          changeContent(textInput.type, 'isSplitInput')(!typeConfig?.isSplitInput)
        }
        placeholder={['プレースホルダ', 'プレースホルダ']}
      />
    </div>
    {isUseFukushashiki && textInput.text.isSplitInput && (
      <>
        {renderFukushashikiRow('left_fukushashiki_search_mode', 'left_fukushashiki_search_value', {
          variant: 'textInputRow',
          selectId: 'left-fukushashiki-mode',
        })}
        {renderFukushashikiRow('right_fukushashiki_search_mode', 'right_fukushashiki_search_value', {
          variant: 'textInputRow',
          selectId: 'right-fukushashiki-mode',
        })}
      </>
    )}
    {isUseFukushashiki && !textInput.text.isSplitInput && (
      renderFukushashikiRow('fukushashiki_search_mode', 'fukushashiki_search_value', {
        variant: 'textInputRow',
        selectId: 'fukushashiki-mode',
      })
    )}
  </>
  );
};

export default TextTypeSetting;

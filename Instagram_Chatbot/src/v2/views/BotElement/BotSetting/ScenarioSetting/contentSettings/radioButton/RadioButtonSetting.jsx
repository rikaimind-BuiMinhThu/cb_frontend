import React from 'react';
import ContentSettingShell from '../shared/ContentSettingShell';
import { RADIO_BUTTON_TYPES } from '../../constants/contentTypeConstants';
import RadioButtonCommonHeader from './RadioButtonCommonHeader';
import RadioButtonFukushashikiSection from './RadioButtonFukushashikiSection';
import DefaultTypeSetting from './DefaultTypeSetting';
import RadioButtonImgTypeSetting from './RadioButtonImgTypeSetting';
import BlockStyleTypeSetting from './BlockStyleTypeSetting';
import UpsellButtonTypeSetting from './UpsellButtonTypeSetting';
import ConsumeApiResponseTypeSetting from './ConsumeApiResponseTypeSetting';
import '../../styles/contentSettings/radioButton.css';

const RadioButtonSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    radioButton,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
    isUseFukushashiki,
  } = props;

  const renderTypeBody = () => {
    switch (radioButton.type) {
      case RADIO_BUTTON_TYPES.DEFAULT:
        return <DefaultTypeSetting {...props} />;
      case RADIO_BUTTON_TYPES.RADIO_BUTTON_IMG:
        return <RadioButtonImgTypeSetting {...props} />;
      case RADIO_BUTTON_TYPES.UPSELL_BUTTON:
        return <UpsellButtonTypeSetting {...props} />;
      case RADIO_BUTTON_TYPES.BLOCK_STYLE:
        return <BlockStyleTypeSetting {...props} />;
      default:
        return null;
    }
  };

  return (
    <ContentSettingShell
      contentType="radio_button"
      contentData={radioButton}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-radio-button-setting"
    >
      <RadioButtonCommonHeader {...props} />
      {radioButton.type === RADIO_BUTTON_TYPES.CONSUME_API_RESPONSE && (
        <ConsumeApiResponseTypeSetting {...props} />
      )}
      {isUseFukushashiki && <RadioButtonFukushashikiSection {...props} />}
      {renderTypeBody()}
    </ContentSettingShell>
  );
};

export default RadioButtonSetting;

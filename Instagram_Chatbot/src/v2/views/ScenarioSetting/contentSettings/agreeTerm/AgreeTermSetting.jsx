import React from 'react';
import ContentSettingShell from '../shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { AGREE_TERM_TYPES } from '../../constants/contentTypeConstants';
import { agreeTermType } from '../../constants/scenarioFormConstants';
import {
  buildAgreeTermSettingContext,
  renderAgreeTermCheckbox,
  renderAgreeTermFukushashikiRow,
} from './agreeTermSettingContext';
import DetailContentTypeSetting from './DetailContentTypeSetting';
import PostLinkOnlyTypeSetting from './PostLinkOnlyTypeSetting';
import '../../styles/contentSettings/agreeTerm.css';

const AgreeTermSetting = (props) => {
  const {
    content,
    indexMessageSelect,
    indexContent,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    isUseFukushashiki,
    handleRemoveItemContent,
    handleAddItemAgreeTerm,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  if (content.type !== 'agree_term') return null;

  const ctx = buildAgreeTermSettingContext(props);
  const { agreeTerm, changeContent } = ctx;

  const renderTypeSelector = () => (
    <div className="ss-user-setting__item-bottom">
      <ContentTypeSelector
        titleRequire={agreeTerm?.title_require}
        typeValue={agreeTerm?.type}
        typeOptions={agreeTermType}
        onTitleRequireChange={changeContent('title_require')}
        onTypeChange={changeContent('type')}
      />
    </div>
  );

  const renderTitle = () => {
    if (agreeTerm.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={agreeTerm.title}
        onChange={changeContent('title')}
      />
    );
  };

  const renderTypeBody = () => {
    switch (agreeTerm.type) {
      case AGREE_TERM_TYPES.DETAIL_CONTENT:
        return <DetailContentTypeSetting {...props} />;
      case AGREE_TERM_TYPES.POST_LINK_ONLY:
        return (
          <PostLinkOnlyTypeSetting
            {...props}
            handleRemoveItemContent={handleRemoveItemContent}
            handleAddItemAgreeTerm={handleAddItemAgreeTerm}
          />
        );
      default:
        return null;
    }
  };

  const renderFukushashiki = () => {
    if (!isUseFukushashiki) return null;
    return renderAgreeTermFukushashikiRow(ctx);
  };

  return (
    <ContentSettingShell
      contentType="agree_term"
      contentData={agreeTerm}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderTypeSelector()}
      {renderTitle()}
      {renderTypeBody()}
      {renderAgreeTermCheckbox(ctx)}
      {renderFukushashiki()}
    </ContentSettingShell>
  );
};

export default AgreeTermSetting;

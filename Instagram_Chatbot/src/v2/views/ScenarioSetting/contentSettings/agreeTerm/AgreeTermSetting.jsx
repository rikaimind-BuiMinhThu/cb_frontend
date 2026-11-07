import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {
  AGREE_TERM_CONTENT_TYPE,
  canEnableAgreeTermCollapse,
} from 'v2/components/BotMessages/agreeTermDesign';
import { agreeTermContentPropType } from 'v2/components/BotMessages/agreeTermPropTypes';
import { mutateMessageContent } from 'v2/views/ScenarioSetting/utils/scenarioMessageMutations';
import ContentSettingShell from '../shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { AGREE_TERM_TYPES } from '../../constants/contentTypeConstants';
import { agreeTermType } from '../../constants/scenarioFormConstants';
import { AGREE_TERM_LABELS } from '../../constants/scenarioSettingLabels';
import {
  applyAgreeTermDesign,
  clearAgreeTermCollapse,
} from '../../utils/agreeTermDesignSync';
import {
  buildAgreeTermSettingContext,
  renderAgreeTermCheckbox,
  renderAgreeTermFukushashikiRow,
} from './agreeTermSettingContext';
import AgreeTermDesignModal from './AgreeTermDesignModal';
import DetailContentTypeSetting from './DetailContentTypeSetting';
import PostLinkOnlyTypeSetting from './PostLinkOnlyTypeSetting';
import '../../styles/contentSettings/agreeTerm.css';

const TITLE_REQUIRE_FIELD = 'title_require';
const TITLE_FIELD = 'title';

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
  const [designOpen, setDesignOpen] = useState(false);
  const detailType = content?.agree_term?.type;

  useEffect(() => {
    if (detailType === AGREE_TERM_TYPES.DETAIL_CONTENT) return;
    setDesignOpen(false);
  }, [detailType]);

  if (content.type !== AGREE_TERM_CONTENT_TYPE) return null;

  const ctx = buildAgreeTermSettingContext(props);
  const { agreeTerm, changeContent } = ctx;
  const showDesign = agreeTerm.type === AGREE_TERM_TYPES.DETAIL_CONTENT;

  const updateAgreeTermField = (field, value) => {
    setDataMessages((current) => {
      const next = cloneDeep(current);
      mutateMessageContent(
        next,
        indexMessageSelect,
        indexContent,
        content.type,
        value,
        field,
      );
      if (field === TITLE_REQUIRE_FIELD && value !== true) {
        return clearAgreeTermCollapse(next);
      }
      if (field === TITLE_FIELD && String(value ?? '').trim() === '') {
        return clearAgreeTermCollapse(next);
      }
      return next;
    });
  };

  const handleDesignChange = (nextDesign) => {
    setDataMessages((current) => applyAgreeTermDesign(current, nextDesign));
  };

  const renderTypeSelector = () => (
    <div className="ss-user-setting__item-bottom">
      <ContentTypeSelector
        titleRequire={agreeTerm?.title_require}
        typeValue={agreeTerm?.type}
        typeOptions={agreeTermType}
        onTitleRequireChange={(value) => updateAgreeTermField(TITLE_REQUIRE_FIELD, value)}
        onTypeChange={changeContent('type')}
      />
    </div>
  );

  const renderDesignButton = () => {
    if (!showDesign) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <button
          type="button"
          className="ss-agree-term-setting__design-btn"
          onClick={() => setDesignOpen(true)}
        >
          {AGREE_TERM_LABELS.designButton}
        </button>
      </div>
    );
  };

  const renderTitle = () => {
    if (agreeTerm.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={agreeTerm.title}
        onChange={(value) => updateAgreeTermField(TITLE_FIELD, value)}
      />
    );
  };

  const renderTypeBody = () => {
    if (agreeTerm.type === AGREE_TERM_TYPES.DETAIL_CONTENT) {
      return <DetailContentTypeSetting {...props} />;
    }
    if (agreeTerm.type === AGREE_TERM_TYPES.POST_LINK_ONLY) {
      return (
        <PostLinkOnlyTypeSetting
          {...props}
          handleRemoveItemContent={handleRemoveItemContent}
          handleAddItemAgreeTerm={handleAddItemAgreeTerm}
        />
      );
    }
    return null;
  };

  const renderFukushashiki = () => {
    if (!isUseFukushashiki) return null;
    return renderAgreeTermFukushashikiRow(ctx);
  };

  return (
    <ContentSettingShell
      contentType={AGREE_TERM_CONTENT_TYPE}
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
      {renderDesignButton()}
      {renderTitle()}
      {renderTypeBody()}
      {renderAgreeTermCheckbox(ctx)}
      {renderFukushashiki()}
      <AgreeTermDesignModal
        open={designOpen && showDesign}
        onClose={() => setDesignOpen(false)}
        design={agreeTerm.design}
        title={agreeTerm.title ?? ''}
        term={agreeTerm.term ?? ''}
        termsText={agreeTerm.detail_content?.content ?? ''}
        canCollapse={canEnableAgreeTermCollapse(agreeTerm)}
        onChange={handleDesignChange}
      />
    </ContentSettingShell>
  );
};

AgreeTermSetting.propTypes = {
  content: agreeTermContentPropType.isRequired,
  indexMessageSelect: PropTypes.number,
  indexContent: PropTypes.number,
  dataMessages: PropTypes.arrayOf(PropTypes.object),
  setDataMessages: PropTypes.func,
  onChangeValueMessageContent: PropTypes.func,
  isUseFukushashiki: PropTypes.bool,
  handleRemoveItemContent: PropTypes.func,
  handleAddItemAgreeTerm: PropTypes.func,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.arrayOf(PropTypes.object),
  setIsOpenAddVariable: PropTypes.func,
};

export default AgreeTermSetting;

import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioCommon/InputCustom';
import InputNum from '../scenarioCommon/InputNum';
import { CONTENT_SETTING_MAP } from '../contentSettings';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioMessageSettingsAccordion from './ScenarioMessageSettingsAccordion';
import CombineBotBlockSetting from './CombineBotBlockSetting';
import CombineBlockHeader from './CombineBlockHeader';
import { COMBINE_CONTENT_ROLES, COMBINE_MESSAGE_DEFAULTS } from 'v2/views/Preview/PreviewComponent/Constants';
import {
  COMBINE_BOT_TYPE_OPTIONS,
  COMBINE_USER_TYPE_OPTIONS,
} from 'v2/views/ScenarioSetting/utils/combineContentDefaults';
import { SETTING_BUTTON_LABELS, SETTING_LABELS, SETTING_PLACEHOLDERS } from '../constants/scenarioSettingLabels';

const COMBINE_PANEL_LABELS = {
  botContent: 'ボットコンテンツ',
  userContent: 'ユーザーコンテンツ',
};
const COMBINE_DEFAULT_BOT_TYPE = 'text_input';
const COMBINE_DROPPABLE_ID = 'combine-messages';
const BELONG_TO_COMBINE = 'combine';

const AddBlockSelect = ({ options, defaultType, onAdd, label }) => {
  const [blockType, setBlockType] = useState(defaultType);

  return (
    <div className="ss-user-setting__select-wrapper ss-combine-setting__add-wrapper">
      <span className="ss-combine-setting__add-label">{label}</span>
      <select
        className="ss-input-value"
        value={blockType}
        onChange={(e) => setBlockType(e.target.value)}
      >
        {options.map(([value, optionLabel]) => (
          <option key={value} value={value}>{optionLabel}</option>
        ))}
      </select>
      <Button className="ss-user-setting__select-btn-add ss-user-setting__select-btn-add--padded" onClick={() => onAdd(blockType)}>
        {SETTING_BUTTON_LABELS.add}
      </Button>
    </div>
  );
};

const ScenarioCombineSettingsPanel = () => {
  const {
    belongTo,
    messageType,
    indexMessageSelect,
    dataMessages,
    setDataMessages,
    onChangeValueNameMessage,
    onChangeValueMessageContent,
    handleDragEnd,
    handleSelectContentMessage,
    handleDeleteMessageContent,
    handleAddCombineBlock,
    handleChangeCombineBlockType,
    handleChangeCombineContentGap,
    handleChangeCombineBlockPadding,
    renderRootFaqOption,
    getBaseUrl,
    fileError,
    setIsOpenFileReference,
    setVarFileReference,
    botUploadFile,
    isUseFukushashiki,
  } = useScenarioPanelDestructuring();

  const selectedMessage = dataMessages?.[indexMessageSelect];

  if (!selectedMessage || belongTo !== BELONG_TO_COMBINE) {
    return null;
  }

  return (
    <div id="combine-chat" className="ss-combine-chat-detail-setting ss-combine-setting ss-layout-combine-setting">
      <div className="ss-combine-setting__top">
        <div className="ss-user-setting__name-wrapper">
          <div>
            <span>{SETTING_LABELS.name}</span>
            <span className="ss-user-setting__name-error">{SETTING_LABELS.requiredMark}</span>
          </div>
          <InputCustom
            placeholder={SETTING_PLACEHOLDERS.messageName}
            className={selectedMessage.message_name ? '' : 'ss-input--invalid'}
            onChange={(value) => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
            value={selectedMessage.message_name}
          />
          {!selectedMessage.message_name && (
            <div className="ss-field-required-error">{SETTING_LABELS.requiredFieldError}</div>
          )}
        </div>
        <div className="ss-combine-setting__gap-wrapper">
          <span className="ss-combine-setting__gap-label">{SETTING_LABELS.contentGap}</span>
          <InputNum
            min={0}
            max={100}
            className="ss-combine-setting__gap-input"
            value={selectedMessage.combine_message?.content_gap ?? COMBINE_MESSAGE_DEFAULTS.CONTENT_GAP}
            onChange={(value) => handleChangeCombineContentGap(value)}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={COMBINE_DROPPABLE_ID}>
          {(provided) => (
            <div className="ss-combine-setting__main ss-user-setting__main" {...provided.droppableProps} ref={provided.innerRef}>
              {selectedMessage.message_content.map((content, indexContent, arr) => (
                <Draggable key={content.id} draggableId={content.id?.toString()} index={indexContent}>
                  {(dragProvided) => (
                    <div {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} ref={dragProvided.innerRef}>
                      <div
                        className={`ss-combine-setting__item ss-user-setting__item ss-user-setting__item-${indexContent}${indexContent === (arr.length - 1) ? ' ss-user-setting__item--active' : ''}`}
                        onClick={() => handleSelectContentMessage(indexContent, content.type)}
                      >
                        <MDBIcon
                          fas
                          icon="times-circle"
                          className="ss-user-setting__item-delete-btn"
                          onClick={(e) => handleDeleteMessageContent(indexMessageSelect, indexContent, e)}
                        />
                        <CombineBlockHeader
                          content={content}
                          indexContent={indexContent}
                          onChangeBlockType={handleChangeCombineBlockType}
                          onChangeBlockPadding={handleChangeCombineBlockPadding}
                        />
                        <div className="ss-combine-setting__item-body">
                          {content.role === COMBINE_CONTENT_ROLES.BOT ? (
                            <CombineBotBlockSetting
                              content={content}
                              indexContent={indexContent}
                              indexMessageSelect={indexMessageSelect}
                              onChangeValueMessageContent={onChangeValueMessageContent}
                              renderRootFaqOption={renderRootFaqOption}
                              getBaseUrl={getBaseUrl}
                              fileError={fileError}
                              setIsOpenFileReference={setIsOpenFileReference}
                              setVarFileReference={setVarFileReference}
                              botUploadFile={botUploadFile}
                              dataMessages={dataMessages}
                              setDataMessages={setDataMessages}
                              isUseFukushashiki={isUseFukushashiki}
                            />
                          ) : (
                            CONTENT_SETTING_MAP[content.type] ? React.createElement(CONTENT_SETTING_MAP[content.type], {
                              indexMessageSelect,
                              indexContent,
                              content,
                            }) : null
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="ss-combine-setting__bottom ss-user-setting__bottom">
        <AddBlockSelect
          label={COMBINE_PANEL_LABELS.botContent}
          options={COMBINE_BOT_TYPE_OPTIONS}
          defaultType={COMBINE_DEFAULT_BOT_TYPE}
          onAdd={(type) => handleAddCombineBlock(COMBINE_CONTENT_ROLES.BOT, type)}
        />
        <AddBlockSelect
          label={COMBINE_PANEL_LABELS.userContent}
          options={COMBINE_USER_TYPE_OPTIONS}
          defaultType={messageType || COMBINE_DEFAULT_BOT_TYPE}
          onAdd={(type) => handleAddCombineBlock(COMBINE_CONTENT_ROLES.USER, type)}
        />
        <ScenarioMessageSettingsAccordion
          variant="combine"
          selectedMessage={selectedMessage}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
          indexMessageSelect={indexMessageSelect}
        />
      </div>
    </div>
  );
};

export default ScenarioCombineSettingsPanel;

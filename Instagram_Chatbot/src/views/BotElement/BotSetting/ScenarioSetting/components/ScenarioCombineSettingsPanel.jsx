import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import InputNum from '../scenarioComon/InputNum';
import { CONTENT_SETTING_MAP } from '../contentSettings';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioConditionsPanel from './ScenarioConditionsPanel';
import CombineBotBlockSetting from './CombineBotBlockSetting';
import CombineBlockHeader from './CombineBlockHeader';
import { COMBINE_CONTENT_ROLES } from '../../PreviewComponent/Constants';
import {
  COMBINE_BOT_TYPE_OPTIONS,
  COMBINE_USER_TYPE_OPTIONS,
} from '../utils/combineContentDefaults';

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
      <Button className="ss-user-setting__select-btn-add" style={{ padding: '9px 23px' }} onClick={() => onAdd(blockType)}>
        追加
      </Button>
    </div>
  );
};

const RegisterButtonConfig = ({ selectedMessage, dataMessages, setDataMessages }) => {
  const updateMessage = (updates) => {
    Object.assign(selectedMessage, updates);
    setDataMessages([...dataMessages]);
  };

  return (
    <div className="ss-user-register-button-settings">
      <div className="ss-user-register-button-settings__main">
        <label>
          <input
            type="checkbox"
            checked={!!selectedMessage.not_use_button}
            onChange={(e) => updateMessage({ not_use_button: e.target.checked })}
          />
          <span style={{ marginLeft: '8px' }}>次へボタンを使用しない</span>
        </label>
        {!selectedMessage.not_use_button && (
          <div style={{ marginTop: '10px' }}>
            <span>ボタン名称</span>
            <InputCustom
              style={{ width: '100%' }}
              placeholder="例：次へ"
              value={selectedMessage.buttonName || ''}
              maxLength={30}
              onChange={(value) => updateMessage({ buttonName: value })}
            />
          </div>
        )}
      </div>
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
    botUploadFile,
  } = useScenarioPanelDestructuring();

  const selectedMessage = dataMessages?.[indexMessageSelect];

  if (!selectedMessage || belongTo !== 'combine') {
    return null;
  }

  return (
    <div id="combine-chat" className="ss-combine-chat-detail-setting ss-combine-setting ss-layout-combine-setting">
      <div className="ss-combine-setting__top">
        <div className="ss-user-setting__name-wrapper">
          <div>
            <span>名称</span>
            <span className="ss-user-setting__name-error" style={{ marginLeft: '5px' }}>※必須</span>
          </div>
          <InputCustom
            placeholder="名称を入力"
            style={selectedMessage.message_name ? {} : { borderColor: 'red' }}
            onChange={(value) => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
            value={selectedMessage.message_name}
          />
          {!selectedMessage.message_name && (
            <div style={{ color: 'rgb(185, 74, 72)' }}>必ず指定してください。</div>
          )}
        </div>
        <div className="ss-combine-setting__gap-wrapper">
          <span className="ss-combine-setting__gap-label">コンテンツ間の余白 (px)</span>
          <InputNum
            min={0}
            max={100}
            className="ss-combine-setting__gap-input"
            style={{ width: 72, height: 32 }}
            value={selectedMessage.combine_message?.content_gap ?? 10}
            onChange={(value) => handleChangeCombineContentGap(value)}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="combine-messages">
          {(provided) => (
            <div className="ss-combine-setting__main ss-user-setting__main" {...provided.droppableProps} ref={provided.innerRef}>
              {selectedMessage.message_content.map((content, indexContent, arr) => (
                <Draggable key={content.id} draggableId={content.id?.toString()} index={indexContent}>
                  {(dragProvided) => (
                    <div {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} ref={dragProvided.innerRef}>
                      <div
                        className={`ss-combine-setting__item ss-user-setting__item ss-user-setting__item-${indexContent} ${indexContent === (arr.length - 1) ? 'ss-user-setting__item--active' : ''}`}
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
                              botUploadFile={botUploadFile}
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
          label="ボットコンテンツ"
          options={COMBINE_BOT_TYPE_OPTIONS}
          defaultType="text_input"
          onAdd={(type) => handleAddCombineBlock(COMBINE_CONTENT_ROLES.BOT, type)}
        />
        <AddBlockSelect
          label="ユーザーコンテンツ"
          options={COMBINE_USER_TYPE_OPTIONS}
          defaultType={messageType || 'text_input'}
          onAdd={(type) => handleAddCombineBlock(COMBINE_CONTENT_ROLES.USER, type)}
        />
        <RegisterButtonConfig
          selectedMessage={selectedMessage}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
        />
        <ScenarioConditionsPanel variant="user" />
      </div>
    </div>
  );
};

export default ScenarioCombineSettingsPanel;

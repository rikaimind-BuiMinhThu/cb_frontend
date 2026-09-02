import React from 'react';
import { Button } from 'reactstrap';
import SelectCustom from '../scenarioComon/SelectCustom';
import ContentSettingShell from './shared/ContentSettingShell';
import { dataTypeFile } from '../constants/scenarioFormConstants';
import { PREVIEW_LABELS } from '../constants/scenarioSettingLabels';
import '../styles/contentSettings/attachingFile.css';

const AttachingFileSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
}) => {
  const attachingFile = content.attaching_file;

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const renderFileTypeSelect = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        className="ss-setting-width-90"
        data={dataTypeFile}
        mode="multiple"
        onChange={changeField('file_type')}
        value={attachingFile.file_type}
      />
    </div>
  );

  const renderSelectFileButton = () => (
    <div className="ss-user-setting__item-bottom">
      <Button
        className="ss-user-setting__select-btn-add ss-attaching-file__select-btn"
        type="button"
      >
        {PREVIEW_LABELS.selectFile}
      </Button>
    </div>
  );

  return (
    <ContentSettingShell
      contentType="attaching_file"
      contentData={attachingFile}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderFileTypeSelect()}
      {renderSelectFileButton()}
    </ContentSettingShell>
  );
};

export default AttachingFileSetting;

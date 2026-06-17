import React from 'react';
import { Button } from 'reactstrap';
import ContentSettingShell from './shared/ContentSettingShell';
import { ContentTitleInput } from './shared/ContentTypeSelector';
import { SETTING_BUTTON_LABELS } from '../constants/scenarioSettingLabels';
import '../styles/contentSettings/image.css';

const ImageSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
  setIsOpenFileReference,
  setVarFileReference,
  carouselUploadFile,
  getBaseUrl,
}) => {
  const image = content.image;

  const renderPreviewImage = () => (
    <div className="ss-user-setting__item-bottom">
      <img
        className="ss-image-setting__preview"
        src={image.imageURL}
        width={image.image_width}
        height={image.image_height}
        alt=""
      />
    </div>
  );

  const renderFileActions = () => (
    <div className="ss-setting-file-upload-wrapper ss-file-upload-wrapper">
      <Button
        className="ss-bot-file-reference-btn ss-setting-file-upload-btn--spaced"
        onClick={() => {
          setIsOpenFileReference(true);
          setVarFileReference({
            indexContent,
            contentType: 'image',
            subContentType: 'imageURL',
            childSubContentType: undefined,
            indexSubContent: undefined,
            img: undefined,
          });
        }}
      >
        {SETTING_BUTTON_LABELS.fileReference}
      </Button>
      <input
        type="file"
        id="ss-carouse-file-upload"
        name="carouse-file-upload"
        hidden
        onChange={(e) => getBaseUrl(e, indexContent)}
      />
      <Button
        className="ss-bot-file-upload-btn ss-setting-file-upload-btn"
        onClick={carouselUploadFile}
      >
        {SETTING_BUTTON_LABELS.upload}
      </Button>
    </div>
  );

  return (
    <ContentSettingShell
      contentType="image"
      contentData={image}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderPreviewImage()}
      {renderFileActions()}
    </ContentSettingShell>
  );
};

export default ImageSetting;

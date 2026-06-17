import React from 'react';
import { Button } from 'reactstrap';
import UserContentCommonOptions from './shared/UserContentCommonOptions';

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
  return (
    <>
      {
        content.type === 'image' && (
          <React.Fragment>
            <UserContentCommonOptions
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
            />
            {/*
            Edit Width, Height
             <div className='d-flex mt-2 mb-2'>
              <div>
                <label>幅</label>
                <div>
                <InputCustom
                placeholder="プレースホルダ"
                value={image.image_width}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'image_width')}
              />
                </div>
              </div>
              <div>
                <label>標高ン</label>
                <div>
                <InputCustom
                placeholder="プレースホルダ"
                value={image.image_height}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'image_height')}
              />
                </div>
              </div>
            </div> */}
            <div className="ss-user-setting__item-bottom">
              <img src={image.imageURL} style={{ width: image.image_width, height: image.image_height }} alt="" />
            </div>

            <div className="ss-file-upload-wrapper" style={{ width: '90%' }}>
              <Button style={{ margin: '0px', marginRight: '15px' }} className="ss-bot-file-reference-btn" onClick={() => {
                setIsOpenFileReference(true);
                setVarFileReference({ indexContent, contentType: 'image', subContentType: 'imageURL', childSubContentType: undefined, indexSubContent: undefined, img: undefined })
              }}>
                ファイル参照
              </Button>
              <input
                type="file"
                id="ss-carouse-file-upload"
                name="carouse-file-upload"
                hidden
                onChange={(e) => getBaseUrl(e, indexContent)}
              />
              <Button style={{ margin: '0px' }} className="ss-bot-file-upload-btn" onClick={carouselUploadFile}>
                追加
              </Button>
            </div>
          </React.Fragment>

        )
      }
    </>
  );
};

export default ImageSetting;

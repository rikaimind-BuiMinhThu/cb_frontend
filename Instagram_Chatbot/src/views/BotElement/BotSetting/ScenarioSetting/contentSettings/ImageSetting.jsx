import React from 'react';
import { Button } from 'reactstrap';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';

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
            <div className="ss-user-setting__item-text_input-top">
              <CheckboxCustom
                label="ログイン済み時に表示しない"
                onChange={(value) => {
                  dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                  setDataMessages([...dataMessages]);
                }}
                value={dataMessages[indexMessageSelect].not_display_when_logged_in}
              />
              <CheckboxCustom
                label="エラー発生の時に表示しない"
                onChange={(value) => {
                  dataMessages[indexMessageSelect].not_display_when_have_error = value;
                  setDataMessages([...dataMessages]);
                }}
                value={dataMessages[indexMessageSelect].not_display_when_have_error}
              />
              {renderRootFaqOption()}
              <CheckboxCustom
                label="自動スクロールしない"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_not_auto_scroll')}
                value={image.is_not_auto_scroll || false}
              />
              <CheckboxCustom
                label="入力された内容を変数に保存する。"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                value={image.is_save_input_content}
              />
              {image.is_save_input_content &&
                <div className="ss-user-setting__item-bottom">
                  <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                    <SelectCustom
                      style={{ width: '100%', marginRight: '10px' }}
                      id="title"
                      value={image?.save_input_content}
                      data={dataInputVar}
                      keyValue="variable_name"
                      nameValue="variable_name"
                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                    />
                    <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                  </div>
                </div>
              }
              <div className="ss-user-setting__item-text_input-use-api-wrapper">
                <CheckboxCustom
                  label="入力値の検証にAPIを利用する"
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                  value={image.use_api_input_value}
                />
              </div>
              {image.use_api_input_value &&
                <div className="ss-user-setting__item-bottom">
                  <SelectCustom
                    style={{ width: '90%' }}
                    id="title"
                    value={image?.use_api_input_value}
                    data={dataInputVar}
                    keyValue="variable_name"
                    nameValue="variable_name"
                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                  />
                </div>
              }
              <CheckboxCustom
                label="「続行」ボタンを表示する"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'displayButtonNext')}
                value={image.displayButtonNext}
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
                <img src={image.imageURL} style={{ width: image.image_width, height: image.image_height }}></img>
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
            </div>
          </React.Fragment>

        )
      }
    </>
  );
};

export default ImageSetting;

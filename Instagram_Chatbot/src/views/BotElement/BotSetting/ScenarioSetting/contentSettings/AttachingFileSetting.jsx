import React from 'react';
import { Button } from 'reactstrap';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import { dataTypeFile } from '../constants/scenarioFormConstants';

const AttachingFileSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  dataInputVar,
  setIsOpenAddVariable,
}) => {
  const attachingFile = content.attaching_file;
  return (
    <>
      {content.type === 'attaching_file' && (
        <React.Fragment>
          <div className="ss-user-setting__item-text_input-top">
            <CheckboxCustom
              label="エラー発生の時に表示しない"
              onChange={(value) => {
                dataMessages[indexMessageSelect].not_display_when_have_error = value;
                setDataMessages([...dataMessages]);
              }}
              value={dataMessages[indexMessageSelect].not_display_when_have_error}
            />
            <CheckboxCustom
              label="入力された内容を変数に保存する。"
              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
              value={attachingFile.is_save_input_content}
            />
            {attachingFile.is_save_input_content &&
              <div className="ss-user-setting__item-bottom">
                <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                  <SelectCustom
                    id="title"
                    style={{ width: '100%', marginRight: '10px' }}
                    value={attachingFile?.save_input_content}
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
              <div>
                <CheckboxCustom
                  label="必須"
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                  value={attachingFile.require}
                />
              </div>
              {/* <div className="ss-user-setting__item-text_input-use-api-required">
                <CheckboxCustom
                  label="Multiple file upload"
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'multifile_upload')}
                  value={attachingFile.multifile_upload}
                />
              </div> */}
            </div>
            <div className="ss-user-setting__item-bottom">
              <SelectCustom
                style={{ width: '90%' }}
                data={dataTypeFile}
                mode="multiple"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'file_type')}
                value={attachingFile.file_type}
              />
            </div>
            <div className="ss-user-setting__item-bottom">
              <Button className="ss-user-setting__select-btn-add" style={{ backgroundColor: '#A3B1BF', margin: '0px' }} onClick={() => console.log('Click select file')}>ファイルを選択</Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </>
  );
};

export default AttachingFileSetting;

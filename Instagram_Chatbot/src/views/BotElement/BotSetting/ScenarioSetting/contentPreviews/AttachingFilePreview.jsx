import '../styles/base/preview-common.css';
import React from 'react';
import { Button } from 'reactstrap';

const AttachingFilePreview = ({
  content,
  message,
  indexContent,
}) => {
  const attachingFile = content.attaching_file;
  return (
    <>
      {
        content.type === 'attaching_file' && (
          <div className="ss-content-preview">
            {(attachingFile.require) &&
              <div className="ss-message__content--user-attaching_file-top">
                {attachingFile.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            {!attachingFile.file_content && <span className="ss-content-preview__unselected-text">未選択</span>}
            <div className="ss-message__content--user-attaching_file">
              <Button className="ss-message__content--user-attaching_file-btn ss-content-preview__attaching-btn">
                ファイルを選択
              </Button>
            </div>
          </div>
        )
      }
    </>
  );
};

export default AttachingFilePreview;

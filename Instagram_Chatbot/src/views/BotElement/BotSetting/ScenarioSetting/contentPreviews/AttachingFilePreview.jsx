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
          <div style={{ marginBottom: '10px' }}>
            {(attachingFile.require) &&
              <div className="ss-message__content--user-attaching_file-top">
                {attachingFile.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            {!attachingFile.file_content && <span style={{ fontWeight: '400', fontSize: '12px' }}>未選択</span>}
            <div className="ss-message__content--user-attaching_file">
              <Button className="ss-message__content--user-attaching_file-btn" style={{ backgroundColor: '#A3B1BF', marginTop: '0px' }}>
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

import '../styles/base/preview-common.css';
import React from 'react';
import { Button } from 'reactstrap';
import { PREVIEW_LABELS } from '../constants/scenarioSettingLabels';

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
                    {PREVIEW_LABELS.requiredMark}
                  </span>
                }
              </div>
            }
            {!attachingFile.file_content && <span className="ss-content-preview__unselected-text">{PREVIEW_LABELS.unselected}</span>}
            <div className="ss-message__content--user-attaching_file">
              <Button className="ss-message__content--user-attaching_file-btn ss-content-preview__attaching-btn">
                {PREVIEW_LABELS.selectFile}
              </Button>
            </div>
          </div>
        )
      }
    </>
  );
};

export default AttachingFilePreview;

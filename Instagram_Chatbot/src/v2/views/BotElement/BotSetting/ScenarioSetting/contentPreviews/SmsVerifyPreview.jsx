import '../styles/base/preview-common.css';
import React from 'react';

const SmsVerifyPreview = ({
  content,
  message,
  indexContent,
}) => {
  const smsVerify = content.sms_verify;
  return (
    <>
      {content.type === 'sms_verify' && (
        <div className="ss-content-preview">
          {smsVerify.title_require &&
            <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
              {smsVerify.title_require &&
                <span className="ss-message__content--user-checkbox-title">
                  {smsVerify.title}
                </span>
              }
            </div>
          }
        </div>
      )}
    </>
  );
};

export default SmsVerifyPreview;

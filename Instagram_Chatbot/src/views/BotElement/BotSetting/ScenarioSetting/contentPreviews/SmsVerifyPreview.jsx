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
        <div style={{ marginBottom: '10px' }}>
          {smsVerify.title_require &&
            <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
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

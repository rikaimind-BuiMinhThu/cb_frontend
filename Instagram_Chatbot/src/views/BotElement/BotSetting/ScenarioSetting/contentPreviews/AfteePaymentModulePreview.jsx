import React from 'react';

const AfteePaymentModulePreview = ({
  content,
  message,
  indexContent,
}) => {
  const afteePaymentModule = content.AFTEE_payment_module;
  return (
    <>
      {content.type === 'AFTEE_payment_module' && (
        afteePaymentModule.content &&
        <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '10px' }}>
          {afteePaymentModule.content}
        </div>
      )}
    </>
  );
};

export default AfteePaymentModulePreview;

import React from 'react';

const CapturePreview = ({
  content,
  message,
  indexContent,
}) => {
  const capture = content.capture;
  return (
    <>
      {
        content.type === 'capture' && (
          <div style={{ color: '#6989A6', fontSize: '14px' }}>キャプチャ</div>
        )
      }
    </>
  );
};

export default CapturePreview;

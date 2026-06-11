import React from 'react';

const ImagePreview = ({
  content,
  message,
  indexContent,
}) => {
  const image = content.image;
  return (
    <>
      {
        content.type === 'image' && (
          <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
            <img src={image.imageURL} style={{ width: image.image_width, height: image.image_height }} />
          </div>
        )
      }
    </>
  );
};

export default ImagePreview;

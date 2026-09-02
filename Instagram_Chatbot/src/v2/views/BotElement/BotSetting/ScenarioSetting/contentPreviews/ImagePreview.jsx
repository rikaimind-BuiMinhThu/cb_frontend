import '../styles/base/preview-common.css';
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
          <div className="ss-message__content--user-text-input-top ss-content-preview__header--no-mb">
            <img src={image.imageURL} alt="" width={image.image_width} height={image.image_height} />
          </div>
        )
      }
    </>
  );
};

export default ImagePreview;

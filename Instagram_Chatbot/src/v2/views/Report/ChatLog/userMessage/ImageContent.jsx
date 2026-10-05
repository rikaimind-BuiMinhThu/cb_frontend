/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ALT_EMPTY,
} from './constants';

const ImageContent = ({
  content,
}) => {
  if (!content?.image) {
    return null;
  }

  return (
                  <img src={content?.image?.imageURL} alt={ALT_EMPTY} className="chat-log-um-image" style={{ '--um-img-w': content?.image?.image_width, '--um-img-h': content?.image?.image_height }} />
  );
};

ImageContent.propTypes = {
  content: PropTypes.object,
};

export default ImageContent;

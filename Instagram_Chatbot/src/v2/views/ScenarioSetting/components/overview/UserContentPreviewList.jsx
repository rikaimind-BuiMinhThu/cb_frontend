import React from 'react';
import { PREVIEW_MAP } from '../../contentPreviews';

const UserContentPreviewList = ({ message, index }) => (
  <>
    {message?.message_content.map((content, indexContent) => {
      const Preview = PREVIEW_MAP[content.type];
      return Preview ? (
        <Preview
          key={indexContent}
          content={content}
          message={message}
          indexMessage={index}
          indexContent={indexContent}
        />
      ) : null;
    })}
  </>
);

export default UserContentPreviewList;

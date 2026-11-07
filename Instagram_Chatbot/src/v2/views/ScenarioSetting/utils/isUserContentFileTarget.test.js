import { COMBINE_CONTENT_ROLES } from 'v2/views/Preview/PreviewComponent/Constants';
import { mutateMessageContent } from './scenarioMessageMutations';
import { isUserContentFileTarget } from './isUserContentFileTarget';

const IMAGE_FILE_REFERENCE = {
  indexContent: 1,
  contentType: 'image',
  subContentType: 'imageURL',
};

const FILE_URL = 'https://cdn.example.com/uploads/e2e/e2e-marker.png';

describe('isUserContentFileTarget', () => {
  it('returns true for a standalone user message', () => {
    const message = {
      belong_to: 'user',
      message_content: [{ type: 'image', image: { imageURL: '' } }],
    };

    expect(isUserContentFileTarget(message, IMAGE_FILE_REFERENCE)).toBe(true);
  });

  it('returns true for a user-image block inside a combine message', () => {
    const message = {
      belong_to: 'combine',
      message_content: [
        { id: 1, role: COMBINE_CONTENT_ROLES.BOT, type: 'text_input' },
        {
          id: 2,
          role: COMBINE_CONTENT_ROLES.USER,
          type: 'image',
          image: { imageURL: '' },
        },
      ],
    };

    expect(isUserContentFileTarget(message, IMAGE_FILE_REFERENCE)).toBe(true);
  });

  it('returns false for a bot message', () => {
    const message = {
      belong_to: 'bot',
      message_content: [{ type: 'file', file: { content: '' } }],
    };

    expect(isUserContentFileTarget(message, { fieldName: 'content' })).toBe(false);
  });

  it('returns false for a bot block inside a combine message', () => {
    const message = {
      belong_to: 'combine',
      message_content: [
        { id: 1, role: COMBINE_CONTENT_ROLES.BOT, type: 'file', file: { content: '' } },
      ],
    };

    expect(isUserContentFileTarget(message, {
      indexContent: 0,
      contentType: 'file',
      fieldName: 'content',
    })).toBe(false);
  });

  it('writes imageURL onto the combine user-image block when referring a file', () => {
    const messages = [{
      belong_to: 'combine',
      message_content: [
        { id: 1, role: COMBINE_CONTENT_ROLES.BOT, type: 'text_input', text_input: { content: '' } },
        {
          id: 2,
          role: COMBINE_CONTENT_ROLES.USER,
          type: 'image',
          image: { imageURL: '', image_width: '100%', image_height: '100%' },
        },
      ],
    }];

    expect(isUserContentFileTarget(messages[0], IMAGE_FILE_REFERENCE)).toBe(true);

    mutateMessageContent(
      messages,
      0,
      IMAGE_FILE_REFERENCE.indexContent,
      IMAGE_FILE_REFERENCE.contentType,
      FILE_URL,
      IMAGE_FILE_REFERENCE.subContentType,
      IMAGE_FILE_REFERENCE.indexSubContent,
      IMAGE_FILE_REFERENCE.img,
    );

    expect(messages[0].message_content[1].image.imageURL).toBe(FILE_URL);
    expect(messages[0].message_content[0].text_input.content).toBe('');
  });
});

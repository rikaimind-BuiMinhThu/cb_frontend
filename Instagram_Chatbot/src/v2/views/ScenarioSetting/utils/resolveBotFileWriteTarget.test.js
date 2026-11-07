import { resolveBotFileWriteTarget } from './resolveBotFileWriteTarget';
import { mutateMessageContent } from './scenarioMessageMutations';

const FILE_URL = 'https://cdn.example.com/uploads/e2e/e2e-marker.png';

describe('resolveBotFileWriteTarget', () => {
  it('defaults to index 0 and content field for standalone bot messages', () => {
    expect(resolveBotFileWriteTarget({}, 'file')).toEqual({
      indexContent: 0,
      contentType: 'file',
      fieldName: 'content',
    });
  });

  it('uses combine block index and content type from varFileReference', () => {
    expect(resolveBotFileWriteTarget({
      indexContent: 2,
      contentType: 'file',
      fieldName: 'content',
    }, 'text_input')).toEqual({
      indexContent: 2,
      contentType: 'file',
      fieldName: 'content',
    });
  });

  it('writes file content onto the combine bot block index', () => {
    const messages = [{
      belong_to: 'combine',
      message_content: [
        { id: 1, role: 'bot', type: 'text_input', text_input: { content: '' } },
        { id: 2, role: 'bot', type: 'file', file: { content: '' } },
      ],
    }];
    const target = resolveBotFileWriteTarget({
      indexContent: 1,
      contentType: 'file',
      fieldName: 'content',
    }, 'file');

    mutateMessageContent(
      messages,
      0,
      target.indexContent,
      target.contentType,
      FILE_URL,
      target.fieldName,
    );

    expect(messages[0].message_content[1].file.content).toBe(FILE_URL);
    expect(messages[0].message_content[0].text_input.content).toBe('');
  });
});

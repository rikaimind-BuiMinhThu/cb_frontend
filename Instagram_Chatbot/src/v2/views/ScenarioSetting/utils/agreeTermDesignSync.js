import {
  AGREE_TERM_CONTENT_TYPE,
  AGREE_TERM_DETAIL_TYPE,
  resolveAgreeTermDesign,
} from 'v2/components/BotMessages/agreeTermDesign';

const isDetailAgreeTerm = (content) => {
  if (content?.type !== AGREE_TERM_CONTENT_TYPE) return false;
  return content.agree_term?.type === AGREE_TERM_DETAIL_TYPE;
};

export const applyAgreeTermDesign = (messages, design) => {
  const normalized = resolveAgreeTermDesign(design);
  return messages.map((message) => {
    const contents = message.message_content;
    if (!Array.isArray(contents)) return message;
    return {
      ...message,
      message_content: contents.map((content) => {
        if (!isDetailAgreeTerm(content)) return content;
        return {
          ...content,
          agree_term: {
            ...content.agree_term,
            design: normalized,
          },
        };
      }),
    };
  });
};

export const clearAgreeTermCollapse = (messages) => messages.map((message) => {
  const contents = message.message_content;
  if (!Array.isArray(contents)) return message;
  return {
    ...message,
    message_content: contents.map((content) => {
      if (!isDetailAgreeTerm(content) || !content.agree_term.design) return content;
      return {
        ...content,
        agree_term: {
          ...content.agree_term,
          design: {
            ...content.agree_term.design,
            collapse: {
              ...content.agree_term.design.collapse,
              enabled: false,
            },
          },
        },
      };
    }),
  };
});

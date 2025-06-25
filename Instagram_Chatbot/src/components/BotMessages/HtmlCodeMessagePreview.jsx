import React from 'react';

const HtmlCodeMessagePreview = ({
  content,
  index,
  botInfor
}) => {
  const defaultHtmlContent = '<p style="color: #999; font-style: italic;">HTMLコードを入力してください</p>';
  const htmlContent = content[content.type]?.content || defaultHtmlContent;

  return (
    <div className="position-relative">
      <div
        className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value position-relative html-code-message-preview`}
        style={{
          backgroundColor: botInfor?.message_color,
          color: botInfor?.font_color
        }}
        dangerouslySetInnerHTML={{
          __html: htmlContent
        }}
      />
      <div
        className="html-code-message-icon"
        style={{
          backgroundColor: botInfor?.message_color,
          background: `url(${botInfor?.icon_mess})`
        }}
      >
        {!botInfor?.icon_mess && (
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="18" viewBox="0 0 37 54">
            <path
              d="M0 0 C7.59 0 15.18 0 23 0 C23.18 6.32 23.34 12.63 23.44 18.95 C23.48 21.1 23.53 23.25 23.6 25.4 C23.7 28.49 23.75 31.58 23.78 34.67 C23.82 35.63 23.86 36.58 23.91 37.57 C23.91 40.27 23.83 42.43 23 45 C20.61 47.35 18.05 48.68 15 50 C13.61 50.67 13.61 50.67 12.19 51.36 C3.42 54.53 -4.81 54.39 -14 54 C-14 53.34 -14 52.68 -14 52 C-13.31 51.7 -12.63 51.39 -11.92 51.08 C-11.02 50.66 -10.12 50.24 -9.19 49.81 C-8.29 49.41 -7.4 49 -6.48 48.58 C-3.39 46.61 -2.53 45.34 -1 42 C-0.54 38.78 -0.51 35.58 -0.49 32.32 C-0.47 31.4 -0.45 30.47 -0.43 29.52 C-0.38 26.58 -0.35 23.63 -0.31 20.69 C-0.28 18.69 -0.24 16.69 -0.21 14.69 C-0.12 9.79 -0.06 4.9 0 0 Z "
              fill={botInfor?.message_color} 
              transform="translate(14,0)" 
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default HtmlCodeMessagePreview;

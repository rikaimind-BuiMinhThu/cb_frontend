import React, { useEffect, useRef } from 'react';

const HtmlCodeMessagePreview = ({
  content,
  contentIndex,
  botInfor
}) => {
  const defaultHtmlContent = '<p style="color: #999; font-style: italic;">HTMLコードを入力してください</p>';
  const htmlContent = content[content.type]?.content || defaultHtmlContent;
  const isUseForUgc = !!content[content.type]?.use_for_ugc;
  const hasProcessed = useRef(false);

  const messageColor = botInfor?.message_color || '#3CACEF';
  const fontColor = botInfor?.font_color || '#fff';
  const iconMess = botInfor?.icon_mess;

  useEffect(() => {
    if (
      hasProcessed.current ||
      !htmlContent ||
      htmlContent === defaultHtmlContent
    )
      return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const addedLinks = [];
    const addedScripts = [];
    const addedInputs = [];

    try {
      // 1. Inject <link> tags (CSS)
      doc.querySelectorAll('link[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (href && !document.querySelector(`link[href="${href}"]`)) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = href;
          document.head.appendChild(newLink);
          addedLinks.push(newLink);
        }
      });

      // 2️. Inject <script> tags (only external JS)
      doc.querySelectorAll('script[src]').forEach((script) => {
        const src = script.getAttribute('src');
        if (src && !document.querySelector(`script[src="${src}"]`)) {
          const newScript = document.createElement('script');
          newScript.src = src;
          Array.from(script.attributes).forEach((attr) => {
            if (attr.name !== 'src')
              newScript.setAttribute(attr.name, attr.value);
          });
          newScript.async = false; // đảm bảo thứ tự thực thi
          document.body.appendChild(newScript);
          addedScripts.push(newScript);
        }
      });

      // 3️. Inject hidden <input>
      doc.querySelectorAll('input[type="hidden"][id]').forEach((el) => {
        const id = el.getAttribute('id');
        if (id && !document.getElementById(id)) {
          const newInput = el.cloneNode(true);
          document.body.appendChild(newInput);
          addedInputs.push(newInput);
        }
      });

      hasProcessed.current = true;
    } catch (error) {
      console.error('Failed to process HTML code:', error);
    }

    return () => {
      addedLinks.forEach((el) => el.remove());
      addedScripts.forEach((el) => el.remove());
      addedInputs.forEach((el) => el.remove());
    };
  }, [htmlContent, defaultHtmlContent]);

  const getVisibleHtmlContent = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      doc.querySelectorAll('link, script, input[type="hidden"]').forEach(el => el.remove());
      return doc.body.innerHTML || htmlContent;
    } catch (error) {
      return htmlContent;
    }
  };

  return (
    <div className="position-relative">
      <div
        className={`ss-bot-chat-overview-${contentIndex} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value position-relative html-code-message-preview ${isUseForUgc ? 'display_ugc' : ""}`}
        style={{
          backgroundColor: messageColor,
          color: fontColor
        }}
        dangerouslySetInnerHTML={{
          __html: getVisibleHtmlContent()
        }}
      />
      <div
        className="html-code-message-icon"
        style={{
          backgroundColor: messageColor,
          background: iconMess ? `url(${iconMess})` : undefined
        }}
      >
        {!iconMess && (
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="18" viewBox="0 0 37 54">
            <path
              d="M0 0 C7.59 0 15.18 0 23 0 C23.18 6.32 23.34 12.63 23.44 18.95 C23.48 21.1 23.53 23.25 23.6 25.4 C23.7 28.49 23.75 31.58 23.78 34.67 C23.82 35.63 23.86 36.58 23.91 37.57 C23.91 40.27 23.83 42.43 23 45 C20.61 47.35 18.05 48.68 15 50 C13.61 50.67 13.61 50.67 12.19 51.36 C3.42 54.53 -4.81 54.39 -14 54 C-14 53.34 -14 52.68 -14 52 C-13.31 51.7 -12.63 51.39 -11.92 51.08 C-11.02 50.66 -10.12 50.24 -9.19 49.81 C-8.29 49.41 -7.4 49 -6.48 48.58 C-3.39 46.61 -2.53 45.34 -1 42 C-0.54 38.78 -0.51 35.58 -0.49 32.32 C-0.47 31.4 -0.45 30.47 -0.43 29.52 C-0.38 26.58 -0.35 23.63 -0.31 20.69 C-0.28 18.69 -0.24 16.69 -0.21 14.69 C-0.12 9.79 -0.06 4.9 0 0 Z "
              fill={messageColor}
              transform="translate(14,0)"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default HtmlCodeMessagePreview;

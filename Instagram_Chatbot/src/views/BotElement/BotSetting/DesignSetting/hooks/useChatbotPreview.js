import { useCallback, useState } from 'react';

const applyOpenPreviewStyles = ({ heightPc, rightMarginPc, bottomMarginPc }) => {
  const container = document.getElementById('sp-container');
  const header = document.getElementById('sp-header');
  const body = document.getElementById('sp-body');
  if (!container || !header || !body) return;

  container.style.height = heightPc ? `${heightPc}px` : '620px';
  container.style.marginBottom = bottomMarginPc ? `${bottomMarginPc}px` : '0px';
  container.style.marginRight = rightMarginPc ? `${rightMarginPc}px` : '10px';
  header.style.position = 'static';
  header.style.borderBottomLeftRadius = '0px';
  header.style.borderBottomRightRadius = '0px';
  body.style.display = 'block';
};

const applyCollapsedPreviewStyles = () => {
  const container = document.getElementById('sp-container');
  const header = document.getElementById('sp-header');
  const body = document.getElementById('sp-body');
  if (!container || !header || !body) return;

  container.style.height = '0px';
  body.style.display = 'none';
  header.style.borderBottomLeftRadius = '25px';
  header.style.borderBottomRightRadius = '25px';
  header.style.position = 'absolute';
  header.style.bottom = '13px';
};

export const useChatbotPreview = (designSettings) => {
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isOpenPreviewBot, setIsOpenPreviewBot] = useState(true);

  const openPreview = useCallback(() => {
    applyOpenPreviewStyles(designSettings);
    setIsOpenPreview(true);
    setIsOpenPreviewBot(true);
  }, [designSettings]);

  const handlePreview = useCallback((validateBasicInfo) => {
    if (validateBasicInfo()) {
      openPreview();
      return true;
    }
    return false;
  }, [openPreview]);

  const handleTogglePreview = useCallback(() => {
    const body = document.getElementById('sp-body');
    if (!body) return;

    if (body.style.display === 'none') {
      applyOpenPreviewStyles(designSettings);
    } else {
      applyCollapsedPreviewStyles();
    }
    setIsOpenPreviewBot((prev) => !prev);
  }, [designSettings]);

  return {
    isOpenPreview,
    isOpenPreviewBot,
    handlePreview,
    handleTogglePreview,
  };
};

export default useChatbotPreview;

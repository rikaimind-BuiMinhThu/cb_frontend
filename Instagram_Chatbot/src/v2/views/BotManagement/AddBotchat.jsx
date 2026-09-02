import React, { useRef, useState } from 'react';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderActions } from 'v2/components/AdminShell';
import 'v2/assets/css/bot/add-bot.css';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MDBIcon } from 'mdbreact';
import { message } from 'antd';
import {
  ACCEPT_IMAGE,
  ADD_ICON_PLUS,
  API_SUCCESS_CODE,
  API_SUCCESS_CODE_STRING,
  API_WARNING_CODE,
  API_WARNING_CODE_STRING,
  BOT_ICONS,
  BOT_ID_COOKIE_KEY,
  BOT_LIST_PATH,
  BOT_NAME_HINT,
  BOT_TYPE_BOT,
  BOT_TYPE_COOKIE_KEY,
  CHATBOTS_API_PATH,
  COLOR_MAP,
  CREATE_BOT_LABEL,
  CREATE_REDIRECT_DELAY_MS,
  CSS_VAR_BOT_MAIN_COLOR,
  CUSTOM_COLOR_INDEX,
  DATA_URL_PNG_TOKEN,
  DEFAULT_BOT_ICON,
  DEFAULT_COLOR_INDEX,
  DEFAULT_DESIGN_TYPE,
  DEFAULT_ICON_INDEX,
  DEFAULT_MAIN_COLOR,
  DESIGN_TYPE_FLAT,
  DESIGN_TYPE_FLAT_LABEL,
  DESIGN_TYPE_MATERIAL,
  DESIGN_TYPE_MATERIAL_LABEL,
  DESIGN_TYPE_POP,
  DESIGN_TYPE_POP_LABEL,
  EMPTY_STRING,
  ERROR_BOT_IMAGE_REQUIRED,
  ERROR_BOT_NAME_REQUIRED,
  ERROR_SUBTITLE_REQUIRED,
  ERROR_TITLE_REQUIRED,
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_JPG,
  IMAGE_TYPE_PNG,
  INPUT_ID_BOT_IMAGE,
  INPUT_ID_BOT_NAME,
  INPUT_ID_SUBTITLE,
  INPUT_ID_TITLE,
  INPUT_NAME_BOT_IMAGE,
  INPUT_NAME_TITLE,
  LABEL_BOT_NAME,
  LABEL_CUSTOM_COLOR,
  LABEL_DESIGN_TYPE,
  LABEL_ICON,
  LABEL_MAIN_COLOR,
  LABEL_SUBTITLE,
  LABEL_TITLE,
  MAIN_COLORS,
  PLACEHOLDER_BOT_NAME,
  PLACEHOLDER_SUBTITLE,
  PLACEHOLDER_TITLE,
  PREVIEW_BUTTON,
  SCL_BUTTON_LABEL,
  SCENARIO_LIST_PATH,
  SUCCESS_BOT_CREATED,
  TOKEN_EXPIRED_CODE,
} from './addBotConstants';

const toDataURL = (url) => fetch(url)
  .then((response) => response.blob())
  .then((blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

const resolveColorKey = (mainColor) => Object.entries(COLOR_MAP)
  .find(([, val]) => mainColor === val)?.[0];

const AddBotchat = () => {
  const [mainColor, setMainColor] = useState(DEFAULT_MAIN_COLOR);
  const [title, setTitle] = useState(EMPTY_STRING);
  const [subtitle, setSubtitle] = useState(EMPTY_STRING);
  const [designType, setDesignType] = useState(DEFAULT_DESIGN_TYPE);
  const [botImage, setBotImage] = useState(DEFAULT_BOT_ICON);
  const [botName, setBotName] = useState(EMPTY_STRING);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: EMPTY_STRING,
    subtitle: EMPTY_STRING,
    botName: EMPTY_STRING,
    botImage: EMPTY_STRING,
  });
  const [saving, setSaving] = useState(false);
  const [colorIndex, setColorIndex] = useState(DEFAULT_COLOR_INDEX);
  const [iconIndex, setIconIndex] = useState(DEFAULT_ICON_INDEX);
  const botImageInputRef = useRef(null);
  const customColorRef = useRef(null);

  const designTypeClick = (value) => {
    setDesignType(value);
  };

  const handleColorClick = (index, color) => {
    setColorIndex(index);
    if (color) {
      setMainColor(color);
    } else {
      customColorRef.current?.click();
    }
  };

  const handleIconClick = (index, imageDefault) => {
    setIconIndex(index);
    if (!imageDefault.includes(DATA_URL_PNG_TOKEN)) {
      toDataURL(imageDefault)
        .then((dataUrl) => {
          setBotImage(dataUrl);
        });
    } else {
      setBotImage(imageDefault);
    }
  };

  const getBaseUrlAdd = () => {
    const file = botImageInputRef.current?.files[0];
    if (file?.type === IMAGE_TYPE_PNG || file?.type === IMAGE_TYPE_JPEG || file?.type === IMAGE_TYPE_JPG) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const baseString = reader.result;
        setBotImage(baseString);
        if (baseString !== undefined || baseString !== EMPTY_STRING) {
          setFieldErrors((prev) => ({ ...prev, botImage: EMPTY_STRING }));
        }
      };
      reader.readAsDataURL(file);
      return true;
    }
    setBotImage(EMPTY_STRING);
    setFieldErrors((prev) => ({ ...prev, botImage: ERROR_BOT_IMAGE_REQUIRED }));
    return false;
  };

  const addNewBotChat = () => {
    if (saving) return;
    if (title && subtitle && botName) {
      const iconBot = botImage === EMPTY_STRING ? DEFAULT_BOT_ICON : botImage;
      const color = resolveColorKey(mainColor);
      const bot = {
        chatbot: {
          title,
          subtitle,
          design_type: designType,
          icon: iconBot,
          bot_name: botName,
          ...(color ? { main_color: color } : { main_color_other: mainColor }),
        },
      };

      setSaving(true);
      api
        .post(CHATBOTS_API_PATH, bot)
        .then((res) => {
          if (res.data.code === API_SUCCESS_CODE || res.data.code === API_SUCCESS_CODE_STRING) {
            Cookies.set(BOT_ID_COOKIE_KEY, res.data.data.id);
            Cookies.set(BOT_TYPE_COOKIE_KEY, BOT_TYPE_BOT);
            message.success(SUCCESS_BOT_CREATED);
            setTimeout(() => {
              window.location.href = SCENARIO_LIST_PATH;
            }, CREATE_REDIRECT_DELAY_MS);
          } else if (res.data?.code === API_WARNING_CODE || res.data?.code === API_WARNING_CODE_STRING) {
            setSaving(false);
            message.warning(res.data.message);
          } else {
            setSaving(false);
          }
        })
        .catch((error) => {
          setSaving(false);
          if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
            tokenExpired();
          }
        });
    } else {
      setFieldErrors({
        title: title ? EMPTY_STRING : ERROR_TITLE_REQUIRED,
        subtitle: subtitle ? EMPTY_STRING : ERROR_SUBTITLE_REQUIRED,
        botName: botName ? EMPTY_STRING : ERROR_BOT_NAME_REQUIRED,
        botImage: fieldErrors.botImage,
      });
    }
  };

  const handlePreview = () => {
    if (title && subtitle) {
      setIsOpenPreview(true);
      setIsChatExpanded(true);
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        title: title ? EMPTY_STRING : ERROR_TITLE_REQUIRED,
        subtitle: subtitle ? EMPTY_STRING : ERROR_SUBTITLE_REQUIRED,
      }));
    }
  };

  const handleTogglePreview = () => {
    setIsChatExpanded((prev) => !prev);
  };

  const previewClassName = [
    'sp-container',
    !isOpenPreview ? 'add-bot-preview--hidden' : '',
    isOpenPreview && isChatExpanded ? 'add-bot-preview--expanded' : '',
    isOpenPreview && !isChatExpanded ? 'add-bot-preview--collapsed' : '',
  ].filter(Boolean).join(' ');

  useAdminHeaderActions(
    <>
      <AdminActionButton
        action="back"
        onClick={() => { window.location.href = BOT_LIST_PATH; }}
      />
      <AdminActionButton action="create" label={CREATE_BOT_LABEL} loading={saving} onClick={addNewBotChat} />
    </>
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
          <form action="">
            <div className="add-bot-container">
              <div className="bot-left">
                <AdminFormRow label={LABEL_TITLE} required htmlFor={INPUT_ID_TITLE} error={fieldErrors.title}>
                  <input
                    id={INPUT_ID_TITLE}
                    type="text"
                    name={INPUT_NAME_TITLE}
                    className="input-field"
                    placeholder={PLACEHOLDER_TITLE}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, title: EMPTY_STRING }));
                    }}
                  />
                </AdminFormRow>
                <AdminFormRow label={LABEL_SUBTITLE} required htmlFor={INPUT_ID_SUBTITLE} error={fieldErrors.subtitle}>
                  <input
                    id={INPUT_ID_SUBTITLE}
                    type="text"
                    className="input-field"
                    placeholder={PLACEHOLDER_SUBTITLE}
                    onChange={(e) => {
                      setSubtitle(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, subtitle: EMPTY_STRING }));
                    }}
                  />
                </AdminFormRow>
                <AdminFormRow label={LABEL_DESIGN_TYPE}>
                  <div className="design-types">
                    <div
                      className={`type${designType === DESIGN_TYPE_POP ? ' active' : ''}`}
                      onClick={() => designTypeClick(DESIGN_TYPE_POP)}
                    >
                      <span>{DESIGN_TYPE_POP_LABEL}</span>
                    </div>
                    <div
                      className={`type${designType === DESIGN_TYPE_FLAT ? ' active' : ''}`}
                      onClick={() => designTypeClick(DESIGN_TYPE_FLAT)}
                    >
                      <span>{DESIGN_TYPE_FLAT_LABEL}</span>
                    </div>
                    <div
                      className={`type${designType === DESIGN_TYPE_MATERIAL ? ' active' : ''}`}
                      onClick={() => designTypeClick(DESIGN_TYPE_MATERIAL)}
                    >
                      <span>{DESIGN_TYPE_MATERIAL_LABEL}</span>
                    </div>
                  </div>
                </AdminFormRow>
                <AdminFormRow label={LABEL_MAIN_COLOR}>
                  <div className="main-colors">
                    {MAIN_COLORS.map((color, index) => (
                      <div
                        key={color}
                        className={`color color-${index}${colorIndex === index ? ' active' : ''}`}
                        onClick={() => handleColorClick(index, color)}
                      >
                        <span
                          className="add-bot-color-swatch"
                          style={{ [CSS_VAR_BOT_MAIN_COLOR]: color }}
                        />
                      </div>
                    ))}
                    <div
                      className={`color color-${CUSTOM_COLOR_INDEX} add-bot-custom-color${colorIndex === CUSTOM_COLOR_INDEX ? ' active' : ''}`}
                      onClick={() => handleColorClick(CUSTOM_COLOR_INDEX)}
                    >
                      <span
                        className="add-bot-color-swatch"
                        style={{ [CSS_VAR_BOT_MAIN_COLOR]: mainColor }}
                      />
                      <span className="add-bot-custom-label">{LABEL_CUSTOM_COLOR}</span>
                    </div>
                    <input
                      ref={customColorRef}
                      type="color"
                      value={mainColor}
                      onChange={(e) => { setMainColor(e.target.value); }}
                      className="add-bot-color-input"
                    />
                  </div>
                </AdminFormRow>
                <div className="btn-wrapper">
                  <button type="button" className="btn btn-preview" onClick={handlePreview}>
                    {PREVIEW_BUTTON}
                  </button>
                </div>
              </div>
              <div className="bot-right">
                <div>
                  <AdminFormRow label={LABEL_ICON} error={fieldErrors.botImage}>
                    <div className="icons">
                      {BOT_ICONS.map((icon, index) => (
                        <div
                          key={icon}
                          className={`icon icon-${index}${iconIndex === index ? ' active' : ''}`}
                          onClick={() => handleIconClick(index, icon)}
                        >
                          <img src={icon} alt="" />
                        </div>
                      ))}
                    </div>
                    <div className="add-icon">
                      <span>{ADD_ICON_PLUS}</span>
                      <input
                        type="file"
                        id={INPUT_ID_BOT_IMAGE}
                        ref={botImageInputRef}
                        onChange={getBaseUrlAdd}
                        name={INPUT_NAME_BOT_IMAGE}
                        accept={ACCEPT_IMAGE}
                      />
                    </div>
                  </AdminFormRow>
                  {botImage && (
                    <div className="field-add-bot">
                      <div className="image-show">
                        <img src={botImage} alt="" />
                      </div>
                    </div>
                  )}
                  <AdminFormRow
                    label={LABEL_BOT_NAME}
                    required
                    htmlFor={INPUT_ID_BOT_NAME}
                    error={fieldErrors.botName}
                    hint={BOT_NAME_HINT}
                  >
                    <input
                      id={INPUT_ID_BOT_NAME}
                      type="text"
                      name={INPUT_NAME_TITLE}
                      className="input-field"
                      placeholder={PLACEHOLDER_BOT_NAME}
                      onChange={(e) => {
                        setBotName(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, botName: EMPTY_STRING }));
                      }}
                    />
                  </AdminFormRow>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div
          className={previewClassName}
          style={{ [CSS_VAR_BOT_MAIN_COLOR]: mainColor }}
        >
          <div
            className="sp-header add-bot-preview-header"
            onClick={handleTogglePreview}
          >
            <div className="sp-header-left">
              <div className="sp-header-left-avatar sp-avatar">
                <img src={botImage} alt="" />
              </div>
              <div className="sp-header-left-label">
                <div className="sp-header-left-label-sub-title">{subtitle}</div>
                <div className="sp-header-left-label-title">{title}</div>
              </div>
            </div>
            <div className="sp-header-right">
              <div className="sp-header-right-arrow">
                {isChatExpanded ? (
                  <MDBIcon fas icon="chevron-down" />
                ) : (
                  <MDBIcon fas icon="chevron-up" />
                )}
              </div>
            </div>
          </div>
          <div className="sp-body" />
        </div>
        <Link to={SCENARIO_LIST_PATH}>
          <button type="button" className="admin-visually-hidden">{SCL_BUTTON_LABEL}</button>
        </Link>
      </AdminPage>
    </>
  );
};

export default AddBotchat;

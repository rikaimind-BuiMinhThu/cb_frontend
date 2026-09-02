import React, { useCallback, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../assets/css/bot/add-bot.css';
import './../../assets/css/bot/add-bot-management.css';
import api from 'api/api-management';
import IconManDefault from '../../assets/img/bot-icon/man1_new.png';
import ModalNoti from '../../views/Popup/ModalNoti';
import { Link } from 'react-router-dom';
import { tokenExpired } from 'v2/api/tokenExpired';
import Cookies from 'js-cookie';
import DesignTypePicker from './BotSetting/DesignSetting/components/DesignTypePicker';
import MainColorPicker from './BotSetting/DesignSetting/components/MainColorPicker';
import { DEFAULT_IMAGES } from './BotSetting/DesignSetting/constants/designChatbotConstants';
import {
  convertImageToDataUrl,
  isTempImage,
  resolveMainColorKey,
} from './BotSetting/DesignSetting/utils/designChatbotUtils';

// Maps click/upload/remove `type` to an independent preset slot.
// Each type updates only its own Message / Opening / Closing index.
const PRESET_INDEX_BY_ICON_TYPE = {
  bot: 'bot',
  bot_image: 'bot',
  opening: 'opening',
  opening_bot_icon: 'opening',
  closing: 'closing',
  closing_bot_icon: 'closing',
};

const resolvePreviewIcon = (...candidates) => candidates.find(Boolean) || '';

// Add Bot V2 local icon group. Not DesignBotIcons — avoids loading DesignBotIcons.css
// into the AddBotchat module graph (that CSS reordered cascade on Design Settings).
function AddBotIconGroup({
  label,
  iconUrl,
  activeIndex,
  images,
  onPresetClick,
  onUpload,
  onRemove,
  inputId,
}) {
  return (
    <div className="add-bot-icon-section">
      <span className="add-bot-icon-label">{label}</span>
      <div className="add-bot-icon-preview-row">
        <div className="add-bot-icon-preview">
          {iconUrl ? (
            <div className="add-bot-icon-preview-image">
              <img src={iconUrl} alt="" />
              <div className="add-bot-icon-clear" onClick={onRemove}>
                <span>×</span>
              </div>
            </div>
          ) : (
            <div className="add-bot-icon-placeholder">
              <span>アイコンを選択</span>
            </div>
          )}
        </div>
        <div className="add-bot-icon-selection">
          <div className="add-bot-icon-grid">
            {images.map((icon, index) => (
              <div
                key={`${inputId}-${index}`}
                className={`add-bot-icon-item${activeIndex === index ? ' is-active' : ''}`}
                onClick={() => onPresetClick(index, icon)}
              >
                <img src={icon} alt="" />
              </div>
            ))}
          </div>
          <div className="add-bot-icon-upload">
            <span>+</span>
            <input
              type="file"
              id={inputId}
              name={inputId}
              className="add-bot-icon-file"
              accept="image/png, image/jpeg"
              onChange={onUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AddBotchat() {
  const [mainColor, setMainColor] = useState('#327AED');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [designType, setDesignType] = useState('flat');
  // Message icon → chatbot.icon. Keep existing Add Bot V2 default.
  // Independent from openingBotIcon and closingBotIcon.
  const [botImage, setBotImage] = useState(IconManDefault);
  // Opening bot icon → chatbot.opening_bot_icon. Independent from the other two.
  const [openingBotIcon, setOpeningBotIcon] = useState('');
  // Closing bot icon → chatbot.closing_bot_icon. Independent from the other two.
  const [closingBotIcon, setClosingBotIcon] = useState('');
  // Preset highlight per group. bot: 0 matches IconManDefault.
  const [iconPresetIndices, setIconPresetIndices] = useState({
    bot: 0,
    opening: null,
    closing: null,
  });
  const [botName, setBotName] = useState('');
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');

  const setPresetIndexForType = useCallback((type, index) => {
    const presetKey = PRESET_INDEX_BY_ICON_TYPE[type];
    if (!presetKey) return;
    setIconPresetIndices((prev) => ({ ...prev, [presetKey]: index }));
  }, []);

  // Writes exactly one of the three independent icon states.
  const setBotIconByType = useCallback((type, url) => {
    const methodMap = {
      bot: setBotImage,
      opening: setOpeningBotIcon,
      closing: setClosingBotIcon,
      bot_image: setBotImage,
      opening_bot_icon: setOpeningBotIcon,
      closing_bot_icon: setClosingBotIcon,
    };
    methodMap[type]?.(url);
  }, []);

  const hideIconError = () => {
    const errorEl = document.querySelector('.add-bot-management .error-message.bot-image');
    if (errorEl) errorEl.style.display = 'none';
  };

  const showIconError = (message) => {
    const errorEl = document.querySelector('.add-bot-management .error-message.bot-image');
    if (!errorEl) return;
    errorEl.innerHTML = message;
    errorEl.style.display = 'block';
  };

  // Convert preset to data URL and update only the targeted Message / Opening / Closing state.
  const handleIconClickForType = async (index, imageDefault, type) => {
    setPresetIndexForType(type, index);
    try {
      const dataUrl = await convertImageToDataUrl(imageDefault);
      setBotIconByType(type, dataUrl);
      hideIconError();
    } catch {
      setPresetIndexForType(type, null);
      setMsgNoti('アイコンの読み込みに失敗しました。');
      setIsOpenNoti(true);
    }
  };

  const handleRemoveImage = (type) => () => {
    setBotIconByType(type, null);
    setPresetIndexForType(type, null);
  };

  // Custom "+" upload for one icon group only (Message / Opening / Closing).
  const handleIconUpload = (iconType) => (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (file?.type === 'image/png' || file?.type === 'image/jpeg' || file?.type === 'image/jpg') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBotIconByType(iconType, reader.result);
        setPresetIndexForType(iconType, null);
        hideIconError();
      };
      reader.readAsDataURL(file);
      return true;
    }

    setBotIconByType(iconType, '');
    setPresetIndexForType(iconType, null);
    showIconError('画像を選択してください。');
    return false;
  };

  const addNewBotChat = () => {
    if (title && subtitle && botName) {
      // Message icon → chatbot.icon. Keep IconManDefault when the field is empty after remove.
      const iconBot = botImage === '' || botImage == null ? IconManDefault : botImage;
      const { main_color, main_color_other } = resolveMainColorKey(mainColor);

      const bot = {
        chatbot: {
          title: title,
          subtitle: subtitle,
          design_type: designType,
          icon: iconBot,
          bot_name: botName,
        },
      };

      if (main_color) bot.chatbot.main_color = main_color;
      else bot.chatbot.main_color_other = main_color_other;

      // Opening bot icon → chatbot.opening_bot_icon. CREATE only; no remove_* flags.
      if (isTempImage(openingBotIcon)) {
        bot.chatbot.opening_bot_icon = openingBotIcon;
      }
      // Closing bot icon → chatbot.closing_bot_icon. Independent of the other two.
      if (isTempImage(closingBotIcon)) {
        bot.chatbot.closing_bot_icon = closingBotIcon;
      }

      api
        .post(`api/v1/managements/chatbots`, bot)
        .then((res) => {
          if (res.data.code === 1 || res.data.code === '1') {
            Cookies.set('bot_id', res.data.data.id);
            Cookies.set('bot_type', 'bot');
            setMsgNoti('ボットを正常に作成されました！');
            setIsOpenNoti(true);
            setTimeout(() => {
              setMsgNoti('');
              setIsOpenNoti(false);

              window.location.href = '/v2/admin/scenario-list';
            }, 1500);
          } else if (res.data?.code === 2 || res.data?.code === '2') {
            setMsgNoti(res.data.message);
            setIsOpenNoti(true);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      if (!title) {
        document.querySelector('.add-bot-management .error-message.title').innerHTML =
          'タイトルは、必ず指定してください。';
        document.querySelector('.add-bot-management .error-message.title').style.display = 'block';
      }
      if (!subtitle) {
        document.querySelector('.add-bot-management .error-message.subtile').innerHTML =
          'サブタイトルは、必ず指定ください。';
        document.querySelector('.add-bot-management .error-message.subtile').style.display = 'block';
      }
      if (!botName) {
        document.querySelector('.add-bot-management .error-message.bot-name').innerHTML =
          'ボット名は、必ず指定してください。';
        document.querySelector('.add-bot-management .error-message.bot-name').style.display = 'block';
      }
    }
  };

  // Preview fallbacks match Design Settings display rules, without importing its preview CSS.
  const openingPreviewIcon = resolvePreviewIcon(openingBotIcon, botImage);
  const closingPreviewIcon = resolvePreviewIcon(closingBotIcon, openingBotIcon, botImage);
  const messagePreviewIcon = resolvePreviewIcon(botImage, openingBotIcon, closingBotIcon);

  return (
    <>
      <div className="content add-bot-management">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 style={{ margin: '10px 0' }}>ボット追加</h4>
              </CardHeader>
              <CardBody>
                <form action="">
                  <div className="add-bot-container">
                    <div className="bot-left">
                      <div className="field-add-bot">
                        <div className="add-bot_field-container">
                          <span className="label-field">
                            タイトル <span style={{ color: 'red' }}>*</span>
                          </span>
                          <input
                            type="text"
                            name="title"
                            className="input-field"
                            placeholder="サービス名など（例：BOTCHAN）"
                            onChange={(e) => {
                              setTitle(e.target.value);
                              document.querySelector(
                                '.add-bot-management .error-message.title',
                              ).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="error-message title"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="add-bot_field-container">
                          <span className="label-field">
                            サブタイトル <span style={{ color: 'red' }}>*</span>
                          </span>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="フォームの目的（例：資料請求フォーム）"
                            onChange={(e) => {
                              setSubtitle(e.target.value);
                              document.querySelector(
                                '.add-bot-management .error-message.subtile',
                              ).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="error-message subtile"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="add-bot_field-container">
                          <span className="label-field">デザインタイプ</span>
                          <DesignTypePicker
                            designType={designType}
                            onChange={setDesignType}
                          />
                        </div>
                        <span className="error-message design-types"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="add-bot_field-container">
                          <span className="label-field">メインカラー</span>
                          <MainColorPicker
                            mainColor={mainColor}
                            onChange={setMainColor}
                          />
                        </div>
                        <span className="error-message main-colors"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="add-bot_field-container">
                          <span className="label-field">
                            ボット名称 <span style={{ color: 'red' }}>*</span>
                          </span>
                          <input
                            type="text"
                            name="botName"
                            className="input-field"
                            placeholder="サンプルボット..."
                            onChange={(e) => {
                              setBotName(e.target.value);
                              document.querySelector(
                                '.add-bot-management .error-message.bot-name',
                              ).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="subtitle-field">
                          ※EC-CHAT管理用の名称です。ボット内で表示されることはありません。
                        </span>
                        <span className="error-message bot-name"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="add-bot-icon-holder">
                          <AddBotIconGroup
                            label="メッセージアイコン"
                            iconUrl={botImage}
                            activeIndex={iconPresetIndices.bot}
                            images={DEFAULT_IMAGES}
                            inputId="add-bot-message-icon"
                            onPresetClick={(index, icon) => handleIconClickForType(index, icon, 'bot')}
                            onUpload={handleIconUpload('bot_image')}
                            onRemove={handleRemoveImage('bot_image')}
                          />
                          <AddBotIconGroup
                            label="開く時のボットアイコン"
                            iconUrl={openingBotIcon}
                            activeIndex={iconPresetIndices.opening}
                            images={DEFAULT_IMAGES}
                            inputId="add-bot-opening-icon"
                            onPresetClick={(index, icon) => handleIconClickForType(index, icon, 'opening')}
                            onUpload={handleIconUpload('opening_bot_icon')}
                            onRemove={handleRemoveImage('opening_bot_icon')}
                          />
                          <AddBotIconGroup
                            label="閉じる時のボットアイコン"
                            iconUrl={closingBotIcon}
                            activeIndex={iconPresetIndices.closing}
                            images={DEFAULT_IMAGES}
                            inputId="add-bot-closing-icon"
                            onPresetClick={(index, icon) => handleIconClickForType(index, icon, 'closing')}
                            onUpload={handleIconUpload('closing_bot_icon')}
                            onRemove={handleRemoveImage('closing_bot_icon')}
                          />
                        </div>
                        <span className="error-message bot-image"></span>
                      </div>
                      <div className="btn-wrapper">
                        <Link to={'/v2/admin/bot'}>
                          <button type="button" className="btn btn-close">
                            閉じる
                          </button>
                        </Link>
                        <button type="button" className="btn btn-new-bot" onClick={addNewBotChat}>
                          ボット新規作成
                        </button>
                      </div>
                    </div>
                    <div className="bot-right">
                      <div className="add-bot-preview">
                        <div>
                          <h6 className="add-bot-preview__title">チャットを閉じたとき</h6>
                          <div className="add-bot-preview__frame add-bot-preview__frame--close">
                            <div className="add-bot-preview__launcher">
                              {closingPreviewIcon ? (
                                <img src={closingPreviewIcon} alt="" />
                              ) : (
                                <span className="add-bot-preview__launcher-placeholder">アイコン</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h6 className="add-bot-preview__title">チャットを開いたとき</h6>
                          <div className="add-bot-preview__frame add-bot-preview__frame--open">
                            <div className="add-bot-preview__widget">
                              <div
                                className="add-bot-preview__header"
                                style={{ backgroundColor: mainColor }}
                              >
                                <div className="add-bot-preview__header-left">
                                  <div className="add-bot-preview__header-avatar">
                                    {openingPreviewIcon ? (
                                      <img src={openingPreviewIcon} alt="" />
                                    ) : null}
                                  </div>
                                  <div>
                                    <div className="add-bot-preview__header-subtitle">
                                      {subtitle || 'サブタイトル'}
                                    </div>
                                    <div className="add-bot-preview__header-title">
                                      {title || 'タイトル'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="add-bot-preview__body">
                                <div className="add-bot-preview__message">
                                  <div className="add-bot-preview__message-avatar">
                                    {messagePreviewIcon ? (
                                      <img src={messagePreviewIcon} alt="" />
                                    ) : null}
                                  </div>
                                  <div className="add-bot-preview__message-bubble">メッセージ</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
        <Link to={'/v2/admin/scenario-list'}>
          <button style={{ display: 'none' }}>SCL</button>
        </Link>
      </div>
    </>
  );
}

export default AddBotchat;

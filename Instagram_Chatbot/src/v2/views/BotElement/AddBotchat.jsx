import React, { useState } from 'react';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderActions } from '../../components/AdminShell';
import './../../assets/css/bot/add-bot.css';
import api from 'v2/api/api-management';
// icons
import IconManDefault from '../../assets/img/bot-icon/man1_new.png';
import IconWomenDefault from '../../assets/img/bot-icon/women1_new.png';
import IconWomen4 from '../../assets/img/bot-icon/women4_new.png';
import IconWomen5 from '../../assets/img/bot-icon/women5_new.png';
import IconWomen6 from '../../assets/img/bot-icon/women6_new.png';
import IconWomen7 from '../../assets/img/bot-icon/women7_new.png';
import IconWomen8 from '../../assets/img/bot-icon/women8_new.png';
import IconWomen9 from '../../assets/img/bot-icon/women9_new.png';
import IconWomen10 from '../../assets/img/bot-icon/women10_new.png';
import IconWomen11 from '../../assets/img/bot-icon/women11_new.png';
import { tokenExpired } from 'v2/api/tokenExpired';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MDBIcon } from 'mdbreact';
import { message } from 'antd';

const colors = [
  '#327AED',
  '#26B197',
  '#fC7E02',
  '#F6CA21',
  '#F16FAA',
  '#8C66D9',
  '#7C8290',
  '#D8E2EF',
];
const images = [
  IconManDefault,
  IconWomenDefault,
  IconWomen4,
  IconWomen5,
  IconWomen6,
  IconWomen7,
  IconWomen8,
  IconWomen9,
  IconWomen10,
  IconWomen11,
];

function AddBotchat() {
  // states
  // const [scenario, setScenario] = useState('');
  // const [urlExistForm, setUrlExistForm] = useState('');
  const [mainColor, setMainColor] = useState('#327AED');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [designType, setDesignType] = useState('flat');
  const [botImage, setBotImage] = useState(IconManDefault);
  const [botName, setBotName] = useState('');
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    subtitle: '',
    botName: '',
    botImage: '',
  });
  const [saving, setSaving] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  // design type: handle click
  const designTypeClick = (value) => {
    setDesignType(value);
  };

  const handleColorClick = (index, color) => {
    setColorIndex(index);
    if (color) {
      setMainColor(color);
    } else {
      const customColor = document.querySelector('#custom-color');
      customColor.click();
    }
  };

  const handleIconClick = (index, imageDefault) => {
    setIconIndex(index);
    if (!imageDefault.includes('image/png;base64')) {
      toDataURL(imageDefault)
        .then(dataUrl => {
          setBotImage(dataUrl);
        });
    } else {
      setBotImage(imageDefault);
    }
  };

  // get base url image add
  const getBaseUrlAdd = () => {
    const file = document.getElementById('bot_image')?.files[0];
    if (file?.type === 'image/png' || file?.type === 'image/jpeg' || file?.type === 'image/jpg') {
      let reader = new FileReader();
      let baseString;
      reader.onloadend = function () {
        baseString = reader.result;
        setBotImage(baseString);
        if (baseString !== undefined || baseString !== '') {
          setFieldErrors((prev) => ({ ...prev, botImage: '' }));
        }
      };
      reader.readAsDataURL(file);
      return true;
    } else {
      setBotImage('');
      setFieldErrors((prev) => ({ ...prev, botImage: '画像を選択してください。' }));
      return false;
    }
  };

  const [defaultIcon, setDefaultIcon] = useState('')

  const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))


  // add new bot chat
  const addNewBotChat = () => {
    if (saving) return;
    if (title && subtitle && botName) {
      let iconBot = '';
      if (botImage === '') {
        iconBot = IconManDefault;
      } else {
        iconBot = botImage;
      }
      let main_color = {
        blue: '#327AED',
        green: '#26B197',
        orange: '#fC7E02',
        yellow: '#F6CA21',
        pink: '#F16FAA',
        purple: '#8C66D9',
        black: '#7C8290',
        white: '#D8E2EF',
      };
      let color;
      Object.entries(main_color).forEach(([key, val]) => {
        if (mainColor === val) {
          color = key;
        }
      });

      let bot = {
        chatbot: {
          title: title,
          subtitle: subtitle,
          design_type: designType,
          // main_color: color,
          // main_color: mainColor,
          icon: iconBot,
          bot_name: botName,
        },
      };

      if (color) bot.chatbot.main_color = color
      else bot.chatbot.main_color_other = mainColor

      setSaving(true);
      api
        .post(`api/v1/managements/chatbots`, bot)
        .then((res) => {
          if (res.data.code === 1 || res.data.code === '1') {
            Cookies.set('bot_id', res.data.data.id);
            Cookies.set('bot_type', 'bot');
            message.success('ボットを正常に作成されました！');
            setTimeout(() => {
              window.location.href = '/v2/admin/scenario-list';
            }, 1500);
          } else if (res.data?.code === 2 || res.data?.code === '2') {
            setSaving(false);
            message.warning(res.data.message);
          } else {
            setSaving(false);
          }
        })
        .catch((error) => {
          setSaving(false);
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      setFieldErrors({
        title: title ? '' : 'タイトルは、必ず指定してください。',
        subtitle: subtitle ? '' : 'サブタイトルは、必ず指定してください。',
        botName: botName ? '' : 'ボット名は、必ず指定してください。',
        botImage: fieldErrors.botImage,
      });
    }
  };

  // handle preview
  const handlePreview = () => {
    if (title && subtitle) {
      document.getElementById('sp-container').style.height = '620px';
      document.getElementById('sp-header').style.position = 'static';
      document.getElementById('sp-header').style.borderBottomLeftRadius = '0px';
      document.getElementById('sp-header').style.borderBottomRightRadius = '0px';
      document.getElementById('sp-body').style.display = 'block';
      setIsOpenPreview(true);
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        title: title ? '' : 'タイトルは、必ず指定してください。',
        subtitle: subtitle ? '' : 'サブタイトルは、必ず指定してください。',
      }));
    }
  };

  // handle toggle preview
  const handleTogglePreview = () => {
    if (document.getElementById('sp-body').style.display === 'none') {
      document.getElementById('sp-container').style.height = '620px';
      document.getElementById('sp-header').style.position = 'static';
      document.getElementById('sp-header').style.borderBottomLeftRadius = '0px';
      document.getElementById('sp-header').style.borderBottomRightRadius = '0px';
      document.getElementById('sp-body').style.display = 'block';
    } else {
      document.getElementById('sp-container').style.height = '0px';
      document.getElementById('sp-body').style.display = 'none';
      document.getElementById('sp-header').style.borderBottomLeftRadius = '25px';
      document.getElementById('sp-header').style.borderBottomRightRadius = '25px';
      document.getElementById('sp-header').style.position = 'absolute';
      document.getElementById('sp-header').style.bottom = '13px';
    }
  };

  useAdminHeaderActions(
    <>
      <AdminActionButton
        action="back"
        onClick={() => { window.location.href = '/v2/admin/bot'; }}
      />
      <AdminActionButton action="create" label="ボット作成" loading={saving} onClick={addNewBotChat} />
    </>
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
                <form action="">
                  <div className="add-bot-container">
                    <div className="bot-left">
                      <AdminFormRow label="タイトル" required htmlFor="bot-title" error={fieldErrors.title}>
                        <input
                          id="bot-title"
                          type="text"
                          name="title"
                          className="input-field"
                          placeholder="サービス名など（例：BOTCHAN）"
                          onChange={(e) => {
                            setTitle(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, title: '' }));
                          }}
                        />
                      </AdminFormRow>
                      <AdminFormRow label="サブタイトル" required htmlFor="bot-subtitle" error={fieldErrors.subtitle}>
                        <input
                          id="bot-subtitle"
                          type="text"
                          className="input-field"
                          placeholder="フォームの目的（例：資料請求フォーム）"
                          onChange={(e) => {
                            setSubtitle(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, subtitle: '' }));
                          }}
                        />
                      </AdminFormRow>
                      <AdminFormRow label="デザインタイプ">
                        <div className="design-types">
                          <div className={`type${designType === 'pop' ? ' active' : ''}`} onClick={() => designTypeClick('pop')}>
                            <span>ポップ</span>
                          </div>
                          <div className={`type${designType === 'flat' ? ' active' : ''}`} onClick={() => designTypeClick('flat')}>
                            <span>フラット</span>
                          </div>
                          <div className={`type${designType === 'material' ? ' active' : ''}`} onClick={() => designTypeClick('material')}>
                            <span>マテリアル</span>
                          </div>
                        </div>
                      </AdminFormRow>
                      <AdminFormRow label="メインカラー">
                        <div className="main-colors">
                          {colors.map((color, index) => (
                            <div
                              key={index}
                              className={`color color-${index}${colorIndex === index ? ' active' : ''}`}
                              onClick={() => handleColorClick(index, color)}
                            >
                              <span style={{ backgroundColor: color }}></span>
                            </div>
                          ))}
                          <div
                            className={`color color-999${colorIndex === 999 ? ' active' : ''}`}
                            style={{ position: 'relative' }}
                            onClick={() => handleColorClick(999)}
                          >
                            <span style={{ backgroundColor: mainColor }}></span>
                            <span style={{ position: 'absolute', bottom: '-35px', width: '60px' }}>カスタム</span>
                          </div>
                          <input
                            id="custom-color"
                            type="color"
                            value={mainColor}
                            onChange={(e) => { setMainColor(e.target.value); }}
                            style={{ visibility: 'hidden', width: '0px', height: '0px' }}
                          />
                        </div>
                      </AdminFormRow>
                      <div className="btn-wrapper">
                        <button type="button" className="btn btn-preview" onClick={handlePreview}>
                          プレビュー
                        </button>
                      </div>
                    </div>
                    <div className="bot-right">
                      <div>
                        <AdminFormRow label="アイコン" error={fieldErrors.botImage}>
                          <div className="icons">
                            {images.map((icon, index) => (
                              <div
                                key={index}
                                className={`icon icon-${index}${iconIndex === index ? ' active' : ''}`}
                                onClick={() => handleIconClick(index, icon)}
                              >
                                <img src={icon} alt="" />
                              </div>
                            ))}
                          </div>
                          <div className="add-icon">
                            <span>+</span>
                            <input
                              type="file"
                              id="bot_image"
                              onChange={getBaseUrlAdd}
                              name="bot_image"
                              accept="image/png, image/jpeg"
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
                          label="ボット名称"
                          required
                          htmlFor="bot-name"
                          error={fieldErrors.botName}
                          hint="※EC-CHAT管理用の名称です。ボット内で表示されることはありません。"
                        >
                          <input
                            id="bot-name"
                            type="text"
                            name="title"
                            className="input-field"
                            placeholder="サンプルボット..."
                            onChange={(e) => {
                              setBotName(e.target.value);
                              setFieldErrors((prev) => ({ ...prev, botName: '' }));
                            }}
                          />
                        </AdminFormRow>
                      </div>
                    </div>
                  </div>
                </form>
        </div>
        {/* preview */}
        <div
          id="sp-container"
          className="sp-container"
          style={{ display: !isOpenPreview && 'none' }}
        >
          <div
            id="sp-header"
            style={{ backgroundColor: mainColor }}
            className="sp-header"
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
                {isOpenPreview ? (
                  <MDBIcon fas icon="chevron-down" />
                ) : (
                  <MDBIcon fas icon="chevron-up" />
                )}
              </div>
            </div>
          </div>
          <div id="sp-body" className="sp-body"></div>
        </div>
        {/* end preview */}
        <Link to={'/v2/admin/scenario-list'}>
          <button style={{ display: 'none' }}>SCL</button>
        </Link>
      </AdminPage>
    </>
  );
}

export default AddBotchat;


import React, { useEffect, useState } from 'react';
import { AdminPage, AdminActionButton, useAdminHeaderActions } from '../../components/AdminShell';
import './../../assets/css/bot/add-bot.css';
import api from 'api/api-management';
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
import ModalNoti from '../../views/Popup/ModalNoti';
import { Link } from 'react-router-dom';
import { tokenExpired } from 'v2/api/tokenExpired';
import Cookies from 'js-cookie';
import { MDBIcon } from 'mdbreact';

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
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');
  const [isOpenPreview, setIsOpenPreview] = useState(false);
console.log();
  // side effects
  useEffect(() => {
    document.querySelector('.main-colors .color.color-0').classList.add('active');
    document.querySelector('.icons .icon.icon-0').classList.add('active');
  }, []);

  // design type: handle click
  const designTypeClick = (e) => {
    let value = ''
    if (e.target.innerText == 'ポップ') {
      value = 'pop'
    } else if (e.target.innerText == 'フラット') {
      value = 'flat'
    } else if (e.target.innerText == 'マテリアル') {
      value = 'material'
    }
    setDesignType(value);
    const typeActive = document.querySelector('.design-types .type.active');
    typeActive.classList.remove('active');
    if (e.target.localName !== 'div') {
      e.target.offsetParent.classList.add('active');
    } else {
      e.target.classList.add('active');
    }
  };

  // color: handle click
  const handleColorClick = (index, color) => {
    if (color) {
      setMainColor(color);
    } else {
      const customColor = document.querySelector('#custom-color')
      customColor.click()
    }
    document.querySelector('.main-colors .color.active').classList.remove('active');
    document.querySelector(`.main-colors .color.color-${index}`).classList.add('active');
  };

  // icon: handle click
  const handleIconClick = (index, imageDefault) => {
    document.querySelector('.icons .icon.active').classList.remove('active');
    document.querySelector(`.icons .icon.icon-${index}`).classList.add('active');
    // console.log('imageDefault: ', imageDefault);

    // console.log('imageDefault: ', imageDefault);
    if (!imageDefault.includes('image/png;base64')) {
      toDataURL(imageDefault)
        .then(dataUrl => {
          console.log('RESULT:',)
          // setDefaultIcon(dataUrl)
          setBotImage(dataUrl)
        })
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
          document.querySelector('.error-message.bot-image').style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
      return true;
    } else {
      setBotImage('');
      document.querySelector('.error-message.bot-image').innerHTML = '画像を選択してください。';
      document.querySelector('.error-message.bot-image').style.display = 'block';
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
        document.querySelector('.error-message.title').innerHTML =
          'タイトルは、必ず指定してください。';
        document.querySelector('.error-message.title').style.display = 'block';
      }
      if (!subtitle) {
        document.querySelector('.error-message.subtile').innerHTML =
          'サブタイトルは、必ず指定ください。';
        document.querySelector('.error-message.subtile').style.display = 'block';
      }
      if (!botName) {
        document.querySelector('.error-message.bot-name').innerHTML =
          'ボット名は、必ず指定してください。';
        document.querySelector('.error-message.bot-name').style.display = 'block';
      }
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
      if (!title) {
        document.querySelector('.error-message.title').innerHTML =
          'タイトルは、必ず指定してください。';
        document.querySelector('.error-message.title').style.display = 'block';
      }
      if (!subtitle) {
        document.querySelector('.error-message.subtile').innerHTML =
          'サブタイトルは、必ず指定ください。';
        document.querySelector('.error-message.subtile').style.display = 'block';
      }
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
      <AdminActionButton action="create" label="ボット新規作成" onClick={addNewBotChat} />
    </>
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
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
                              document.querySelector('.error-message.title').style.display = 'none';
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
                              document.querySelector('.error-message.subtile').style.display =
                                'none';
                            }}
                          />
                        </div>
                        <span className="error-message subtile"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="add-bot_field-container">
                          <span className="label-field">デザインタイプ</span>
                          <div className="design-types">
                            <div className="type" onClick={(e) => designTypeClick(e)}>
                              <span>ポップ</span>
                            </div>
                            <div className="type active" onClick={(e) => designTypeClick(e)}>
                              <span>フラット</span>
                            </div>
                            <div className="type" onClick={(e) => designTypeClick(e)}>
                              <span>マテリアル</span>
                            </div>
                          </div>
                        </div>
                        <span className="error-message design-types"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="add-bot_field-container">
                          <span className="label-field">メインカラー</span>
                          <div className="main-colors">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    className={`color color-${index}`}
                                    onClick={() => handleColorClick(index, color)}
                                >
                                  <span style={{backgroundColor: color}}></span>
                                </div>
                            ))}

                            <div
                                className={`color color-999`}
                                style={{position: "relative"}}
                                onClick={() => handleColorClick(999)}
                            >
                              <span style={{backgroundColor: mainColor}}></span>
                              <span style={{position: "absolute", bottom: "-35px", width: "60px"}}>カスタム</span>
                            </div>
                            <input id="custom-color" type="color"
                                   value={mainColor}
                                   onChange={(e) => {setMainColor(e.target.value)}}
                                   style={{visibility: "hidden", width: "0px", height: "0px"}}/>
                          </div>
                        </div>
                        <span className="error-message main-colors"></span>
                      </div>
                      <div className="btn-wrapper">
                        <button type="button" className="btn btn-preview" onClick={handlePreview}>
                          プレビュー
                        </button>
                      </div>
                    </div>
                    <div className="bot-right">
                      <div>
                        <div className="field-add-bot">
                          <div className="add-bot_field-container">
                            <span className="label-field">アイコン</span>
                            <div className="icons">
                              {images.map((icon, index) => (
                                <div
                                  key={index}
                                  className={`icon icon-${index}`}
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
                          </div>
                          <span className="error-message bot-image"></span>
                        </div>
                        {botImage && (
                          <div className="field-add-bot">
                            <div className="image-show">
                              <img src={botImage} alt="" />
                            </div>
                          </div>
                        )}
                        <div className="field-add-bot">
                          <div className="add-bot_field-container">
                            <span className="label-field">
                              ボット名称 <span style={{ color: 'red' }}>*</span>
                            </span>
                            <input
                              type="text"
                              name="title"
                              className="input-field"
                              placeholder="サンプルボット..."
                              onChange={(e) => {
                                setBotName(e.target.value);
                                document.querySelector('.error-message.bot-name').style.display =
                                  'none';
                              }}
                            />
                          </div>
                          <span className="subtitle-field">
                            ※EC-CHAT管理用の名称です。ボット内で表示されることはありません。
                          </span>
                          <span className="error-message bot-name"></span>
                        </div>
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
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
        <Link to={'/v2/admin/scenario-list'}>
          <button style={{ display: 'none' }}>SCL</button>
        </Link>
      </AdminPage>
    </>
  );
}

export default AddBotchat;


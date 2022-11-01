import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../assets/css/bot/add-bot.css';
import api from '../../api/api-management';
// icons
import IconManDefault from '../../assets/img/bot-icon/man1_new.png';
import IconWomenDefault from '../../assets/img/bot-icon/women1_new.png';
import ModalNoti from '../../views/Popup/ModalNoti';
import { Link } from 'react-router-dom';
import { tokenExpired } from 'api/tokenExpired';

const colors = [
  {
    color: '#327AED',
  },
  {
    color: '#26B197',
  },
  {
    color: '#fC7E02',
  },
  {
    color: '#DCF843',
  },
  {
    color: '#ED6D9E',
  },
  {
    color: '#546DA7',
  },
  {
    color: '#7C8290',
  },
  {
    color: '#D8E2EF',
  },
];
const images = [
  {
    image: IconManDefault,
  },
  {
    image: IconWomenDefault,
  },
];

function AddBotchat() {
  // states
  const [scenario, setScenario] = useState('');
  const [urlExistForm, setUrlExistForm] = useState('');
  const [mainColor, setMainColor] = useState('#327AED');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [designType, setDesignType] = useState('flat');
  const [botImage, setBotImage] = useState('');
  const [botName, setBotName] = useState('');
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');

  // side effects
  useEffect(() => {
    document.querySelector('.main-colors .color.color-0').classList.add('active');
    document.querySelector('.icons .icon.icon-0').classList.add('active');
  }, []);

  // design type: handle click
  const designTypeClick = (e) => {
    setDesignType(e.target.innerText);
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
    setMainColor(color);
    document.querySelector('.main-colors .color.active').classList.remove('active');
    document.querySelector(`.main-colors .color.color-${index}`).classList.add('active');
  };

  // icon: handle click
  const handleIconClick = (index, imageDefault) => {
    document.querySelector('.icons .icon.active').classList.remove('active');
    document.querySelector(`.icons .icon.icon-${index}`).classList.add('active');
    // console.log('imageDefault: ', imageDefault);
    setBotImage(imageDefault);
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

  // add new bot chat
  const addNewBotChat = () => {
    // if (scenario && urlExistForm && title && subtitle && botName) {
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
        yellow: '#DCF843',
        pink: '#ED6D9E',
        purple: '#546DA7',
        black: '#7C8290',
        white: '#D8E2EF',
      };
      var color;
      Object.entries(main_color).forEach(([key, val]) => {
        if (mainColor == val) {
          color = key;
        }
      });
      var bot = {
        chatbot: {
          title: title,
          subtitle: subtitle,
          design_type: designType,
          main_color: color,
          icon: iconBot,
          bot_name: botName,
        },
      };
      api
        .post(`api/v1/managements/chatbots`, bot)
        .then((res) => {
          console.log(res);
          if (res.data.code === 1 || res.data.code === '1') {
            setMsgNoti('Add new bot chat successfully!');
            setIsOpenNoti(true);
          } else if (res.data?.code === 2 || res.data?.code === '2') {
            setMsgNoti(res.data.message);
            setIsOpenNoti(true);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired()
          }
        });
    } else {
      // if (!scenario) {
      //   document.querySelector('.error-message.scenario-template').innerHTML =
      //     'Please select scenario';
      //   document.querySelector('.error-message.scenario-template').style.display = 'block';
      // }
      // if (!urlExistForm) {
      //   document.querySelector('.error-message.url').innerHTML = 'Please input a url';
      //   document.querySelector('.error-message.url').style.display = 'block';
      // }
      if (!title) {
        document.querySelector('.error-message.title').innerHTML = 'Please input title';
        document.querySelector('.error-message.title').style.display = 'block';
      }
      if (!subtitle) {
        document.querySelector('.error-message.subtile').innerHTML = 'Please input subtile';
        document.querySelector('.error-message.subtile').style.display = 'block';
      }
      if (!botName) {
        document.querySelector('.error-message.bot-name').innerHTML = 'Please input bot-name';
        document.querySelector('.error-message.bot-name').style.display = 'block';
      }
    }
  };

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 style={{ margin: '10px 0' }}>Add Botchat</h4>
              </CardHeader>
              <CardBody>
                <form action="">
                  <div className="add-bot-container">
                    <div className="bot-left">
                      <div className="field-add-bot">
                        <div className="field-container">
                          <span className="label-field">Scenario template</span>
                          <select
                            className="input-field"
                            id="select-scenario"
                            name="scenario-template"
                            onChange={(e) => setScenario(e.target.value)}
                            value={scenario}
                          >
                            <option value="" disabled hidden>
                              Select Scenario
                            </option>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                          </select>
                        </div>
                        <span className="subtitle-field">
                          * You can create a scenario that progresses in chat from a template.
                        </span>
                        <span className="error-message scenario-template"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="field-container">
                          <span className="label-field">URL of existing form</span>
                          <input
                            type="text"
                            name="URL"
                            className="input-field"
                            placeholder="URL of the form you want to convert"
                            onChange={(e) => setUrlExistForm(e.target.value)}
                          />
                        </div>
                        <span className="subtitle-field">
                          * AI automatically converts pages containing forms into chat forms. Choose
                          a template if you don't have an existing form.
                        </span>
                        <span className="error-message url"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="field-container">
                          <span className="label-field">Title</span>
                          <input
                            type="text"
                            name="title"
                            className="input-field"
                            placeholder="Service name, etc. (e.g. BOTCHAN)"
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                        <span className="error-message title"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="field-container">
                          <span className="label-field">Subtitle</span>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Purpose of the form (e.g. information request form)"
                            onChange={(e) => setSubtitle(e.target.value)}
                          />
                        </div>
                        <span className="error-message subtile"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="field-container">
                          <span className="label-field">Design type</span>
                          <div className="design-types">
                            <div className="type" onClick={(e) => designTypeClick(e)}>
                              <span>pop</span>
                            </div>
                            <div className="type active" onClick={(e) => designTypeClick(e)}>
                              <span>flat</span>
                            </div>
                            <div className="type" onClick={(e) => designTypeClick(e)}>
                              <span>material</span>
                            </div>
                          </div>
                        </div>
                        <span className="error-message design-types"></span>
                      </div>
                      <div className="field-add-bot">
                        <div className="field-container">
                          <span className="label-field">Main color</span>
                          <div className="main-colors">
                            {colors.map((color, index) => (
                              <div
                                key={index}
                                className={`color color-${index}`}
                                onClick={() => handleColorClick(index, color.color)}
                              >
                                <span style={{ backgroundColor: color.color }}></span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <span className="error-message main-colors"></span>
                      </div>
                      <div className="btn-wrapper">
                        <button type="button" className="btn btn-preview">
                          Preview
                        </button>
                      </div>
                    </div>
                    <div className="bot-right">
                      <div>
                        <div className="field-add-bot">
                          <div className="field-container">
                            <span className="label-field">Icon</span>
                            <div className="icons">
                              {images.map((icon, index) => (
                                <div
                                  key={index}
                                  className={`icon icon-${index}`}
                                  onClick={() => handleIconClick(index, icon.image)}
                                >
                                  <img src={icon.image} alt="" />
                                </div>
                              ))}
                            </div>
                            <div className="add-icon">
                              <span>+</span>
                              <input
                                className="input-field"
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
                          <div className="field-container">
                            <span className="label-field">Bot name</span>
                            <input
                              type="text"
                              name="title"
                              className="input-field"
                              placeholder="Sample bot"
                              onChange={(e) => setBotName(e.target.value)}
                            />
                          </div>
                          <span className="subtitle-field">
                            *This is the name for BOTCHAN management. It is never visible within the
                            bot.
                          </span>
                          <span className="error-message bot-name"></span>
                        </div>
                      </div>
                      <div className="btn-wrapper">
                        <Link to={'/admin/bot'}>
                          <button type="button" className="btn btn-close">
                            Close
                          </button>
                        </Link>
                        <button type="button" className="btn btn-new-bot" onClick={addNewBotChat}>
                          New bot
                        </button>
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
      </div>
    </>
  );
}

export default AddBotchat;

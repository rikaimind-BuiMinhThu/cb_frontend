import { useCallback } from 'react';
import moment from 'moment';
import axios from 'axios';
import nanoMetadata from 'nano-metadata';
import api from '../../../../../api/api-management';
import { S3_UPLOAD_URL } from '../../../../../variables/constants';
import { tokenExpired } from 'api/tokenExpired';
import { createDefaultContentItem, getNextContentId } from '../utils/scenarioContentDefaults';
import {
  createDefaultCombineBlock,
  createDefaultCombineMessage,
  createDefaultCombineBotBlock,
} from '../utils/combineContentDefaults';
import { DEFAULT_AMAZON_PAY_BUTTON_CONFIG } from '../../../../../variables/amazonPayConstants';
import { applyAmazonPayDisplayModeToConditions } from '../utils/amazonPayConfigUtils';

const _ = require('lodash');

export const useScenarioMessageActions = ({ state, actions, messages }) => {
  const {
    indexMessageSelect,
    indexCarouselSlide,
    dataMessages,
    botId,
    variableName,
    defaultValue,
    dataInputVar,
    conditions,
  } = state;

  const {
    setFileError,
    setFileErrorCarousel,
    setDataMessages,
    setMessageNoti,
    setIsOpenNoti,
    setBelongTo,
    setMessageType,
    setIndexMessageSelect,
    setIsConditionUp,
    setEditorSelectedRadioOption,
    setEditorSelectedCheckboxOption,
    setIsOpenAddVariable,
    setErrorVariable,
    setConditions,
    getListVariable,
  } = actions;

  const { onChangeValueMessageContent } = messages;

  const botUploadFile = useCallback(() => {
    document.getElementById('ss-bot-file-upload').click();
  }, []);

  const carouselUploadFile = useCallback(() => {
    document.getElementById('ss-carouse-file-upload').click();
  }, []);

  const getBaseUrl = useCallback(async (event, indexContent) => {
    const fileInput = event.target.files[0];
    const type = fileInput.name.slice(fileInput.name.lastIndexOf('.') + 1).toLowerCase();

    let trueFile;
    if (dataMessages[indexMessageSelect].belong_to === 'user') {
      trueFile = ['jpeg', 'jpg', 'png'].includes(type);
    } else {
      trueFile = ['jpeg', 'jpg', 'png', 'pdf', 'mp4'].includes(type);
    }
    let file;
    if (trueFile) {
      if (type != 'pdf' && type != 'mp4' && fileInput.size / 1024 / 1024 >= 2) {
        setFileError('ファイルサイズは2MB以下です。');
        return;
      } if (type === 'pdf' && fileInput.size / 1024 / 1024 >= 3) {
        setFileError('ファイルサイズは3MB以下です。');
        return;
      } if (type === 'mp4') {
        if (fileInput.size / 1024 / 1024 >= 50) {
          setFileError('ファイルサイズは50MB以下です。');
          return;
        }
        const duration = await nanoMetadata.video.duration(fileInput);
        if (duration > 15) {
          setFileError('15秒以下のビデオをアップロードしてください。');
          return;
        }
      }
      setFileError('');
      const video = document.getElementById('preview-video');
      file = { user_file: { file_type: type, size: fileInput.size, timeplay: `${type == 'mp4' ? video?.duration : ''}` } };
      api
        .post('/api/v1/managements/file/upload', file)
        .then((res) => {
          const urlFile = res.data.data.url;
          const filePost = { user_file: { file_type: type, file_url: res.data.data.path } };
          let typeUpload = '';
          if (type == 'mp4') {
            typeUpload = 'video/mp4';
          } else if (type == 'pdf') {
            typeUpload = 'application/pdf';
          } else {
            typeUpload = `image/${type}`;
          }

          axios
            .put(urlFile, fileInput, {
              headers: {
                'Content-Type': typeUpload,
              },
            })
            .then(() => {
              api
                .post('/api/v1/managements/file', filePost)
                .then((res) => {
                  if (res.data.code == 1) {
                    if (dataMessages[indexMessageSelect].belong_to === 'user') {
                      dataMessages[indexMessageSelect].message_content[indexContent].carousel.default.contents[indexCarouselSlide].fileUrl = S3_UPLOAD_URL + res.data.data.file_url;
                    } else {
                      dataMessages[indexMessageSelect].message_content[0].file.content = S3_UPLOAD_URL + res.data.data.file_url;
                    }
                    setDataMessages([...dataMessages]);
                    setMessageNoti('追加しました。');
                    setIsOpenNoti(true);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMessageNoti('');
                    }, 2000);
                  } else {
                    setMessageNoti('追加できませんでした。');
                    setIsOpenNoti(true);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMessageNoti('');
                    }, 2000);
                  }
                })
                .catch((err) => {
                  if (err.response?.data.code === 0) {
                    tokenExpired();
                  }
                });
            })
            .catch((err) => {
              if (err.response?.data.code === 0) {
                tokenExpired();
              }
            });
        })
        .catch((err) => {
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else if (dataMessages[indexMessageSelect].belong_to !== 'user') {
      setFileError('ファイル形式を選択してください。');
    } else {
      setFileErrorCarousel('jpeg,jpg,pngのファイルを選択してください。');
      setTimeout(() => {
        setFileErrorCarousel('');
      }, 4000);
    }
  }, [dataMessages, indexCarouselSlide, indexMessageSelect, setDataMessages, setFileError, setFileErrorCarousel, setIsOpenNoti, setMessageNoti]);

  const handleSelectMessage = useCallback((index, belongTo, type) => {
    if (type) {
      Array.isArray(type) ? setMessageType(type[type.length - 1]?.type) : setMessageType(type);
    }
    const indexLastEle = dataMessages[index].message_content.length - 1;

    setBelongTo(belongTo);
    setMessageType(dataMessages[index].message_content[indexLastEle]?.type || 'text_input');
    setIndexMessageSelect(index);
    setIsConditionUp(false);
    setEditorSelectedRadioOption(null);
    setEditorSelectedCheckboxOption(null);
    if (belongTo === 'bot' && document.querySelector('.ss-bot-setting-condition-container')) {
      document.querySelector('.ss-bot-setting-condition-container').style.height = '20%';
    } else if (belongTo === 'user' && document.querySelector('.ss-user-setting__main')) {
      document.querySelector('.ss-user-setting__main').style.height = '57%';
      const bottom = document.querySelector('.ss-user-setting__bottom');
      if (bottom) {
        bottom.style.maxHeight = '220px';
      }
    }

    document.querySelector(`.ss-user-setting__item-${indexLastEle}`) && document.querySelector(`.ss-user-setting__item-${indexLastEle}`).classList.add('ss-user-setting__item--active');

    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (!ele.classList.contains(`ss-edit-option-wrapper-${index}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });
    document.querySelectorAll('.ss-message').forEach((ele) => {
      ele.classList.remove('ss-message--select');
      ele.classList.remove('ss-message--error');
    });
    const messageEl = document.querySelector(`.ss-message-${index}`);
    if (messageEl) {
      messageEl.classList.add('ss-message--select');
      messageEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [dataMessages, setBelongTo, setEditorSelectedRadioOption, setEditorSelectedCheckboxOption, setIndexMessageSelect, setIsConditionUp, setMessageType]);

  const handleHiddenMessage = useCallback((index, role) => {
    dataMessages[index].hidden = !dataMessages[index].hidden;

    if (role === 'bot') {
      document.querySelectorAll('.ss-bot-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-bot-chat-overview-${index}`)) {
          if (!dataMessages[index].hidden) ele.style.opacity = '1';
          if (dataMessages[index].hidden) ele.style.opacity = '0.4';
        }
      });
    } else if (role === 'user') {
      document.querySelectorAll('.ss-user-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-user-chat-detail-content-${index}`)) {
          if (!dataMessages[index].hidden) ele.style.opacity = '1';
          if (dataMessages[index].hidden) ele.style.opacity = '0.4';
        }
      });
    } else if (role === 'combine') {
      document.querySelectorAll('.ss-combine-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-combine-chat-detail-content-${index}`)) {
          ele.style.opacity = dataMessages[index].hidden ? '0.4' : '1';
        }
      });
    }

    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleSelectContentMessage = useCallback((indexContent, contentType) => {
    setMessageType(contentType);
    setEditorSelectedRadioOption(null);
    setEditorSelectedCheckboxOption(null);
    document.querySelectorAll('.ss-user-setting__item').forEach((ele) => {
      if (!ele.classList.contains(`ss-user-setting__item-${indexContent}`)) {
        ele.classList.remove('ss-user-setting__item--active');
      }
    });
    document.querySelector(`.ss-user-setting__item-${indexContent}`).classList.add('ss-user-setting__item--active');
  }, [setEditorSelectedRadioOption, setEditorSelectedCheckboxOption, setMessageType]);

  const handleEditIconClick = useCallback((index) => {
    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (!ele.classList.contains(`ss-edit-option-wrapper-${index}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });
    document
      .querySelector(`.ss-edit-option-wrapper-${index}`)
      .classList.toggle('ss-edit-option-wrapper--select');
  }, []);

  const handleChangeBotStatementType = useCallback((value) => {
    setMessageType(value);
    const data = [...dataMessages];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (indexMessageSelect !== undefined && i === indexMessageSelect) {
          data[i].message_content[0].type = value;
        }
      }
    }
  }, [dataMessages, indexMessageSelect, setMessageType]);

  const handleAddItemSetting = useCallback((messageType) => {
    const arrMess = [...dataMessages[indexMessageSelect].message_content];
    const idMax = getNextContentId(arrMess);
    dataMessages[indexMessageSelect].message_content.push(
      createDefaultContentItem(messageType, idMax),
    );
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleAddCombineBlock = useCallback((role, blockType) => {
    const message = dataMessages[indexMessageSelect];
    const newBlock = createDefaultCombineBlock(role, blockType, message.message_content);
    message.message_content.push(newBlock);
    setMessageType(blockType);
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages, setMessageType]);

  const handleChangeCombineBlockType = useCallback((indexContent, blockType) => {
    const message = dataMessages[indexMessageSelect];
    const currentBlock = message.message_content[indexContent];
    const newBlock = createDefaultCombineBotBlock(blockType, currentBlock.id);
    newBlock.padding = currentBlock.padding;
    message.message_content[indexContent] = newBlock;
    setMessageType(blockType);
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages, setMessageType]);

  const handleChangeCombineContentGap = useCallback((value) => {
    const message = dataMessages[indexMessageSelect];
    if (!message.combine_message) {
      message.combine_message = {};
    }
    message.combine_message.content_gap = value;
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleChangeCombineBlockPadding = useCallback((indexContent, value) => {
    dataMessages[indexMessageSelect].message_content[indexContent].padding = value;
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleCopyMessage = useCallback((index) => {
    const idMax = Math.max(...dataMessages.map((item) => item.id)) + 1;
    const arrMessage = _.cloneDeep(dataMessages[index]);
    arrMessage.id = idMax;

    dataMessages.splice(index, 0, arrMessage);
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleDeleteMessageContent = useCallback((indexMessage, indexContent) => {
    const arrMessage = [...dataMessages[indexMessage].message_content];
    const startArr = arrMessage.slice(0, indexContent);
    const lastArr = arrMessage.slice(indexContent + 1, arrMessage.length);
    for (let i = 0; i < dataMessages.length; i++) {
      if (indexMessage === i) {
        dataMessages[i].message_content = [...startArr, ...lastArr];
      }
    }
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleDeleteMessage = useCallback((index) => {
    document.querySelectorAll('.ss-edit-option-wrapper').forEach((ele) => {
      if (ele.classList.contains(`ss-edit-option-wrapper-${index}`)) {
        ele.classList.remove('ss-edit-option-wrapper--select');
      }
    });

    const startArr = dataMessages.slice(0, index);
    const lastArr = dataMessages.slice(index + 1, dataMessages.length);
    setDataMessages([...startArr, ...lastArr]);
  }, [dataMessages, setDataMessages]);

  const handleAddItemRadioCheckbox = useCallback((indexMessage, indexContent, type, contentType) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][type][contentType] = [];
      arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    }
    let idMax;
    if (arr.length !== 0) {
      idMax = Math.max(...arr.map((item) => item.id)) + 1;
    } else {
      idMax = 1;
    }
    if (type === 'radio_button') {
      arr.push({
        id: idMax,
        value: String(idMax),
      });
    } else {
      arr.push({
        id: idMax,
        contents: [
          { id: 1 },
        ],
      });
    }
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleAddItemCustomizePullDown = useCallback((indexMessage, indexContent, contentType, pullDownType, name) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name];
    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name] = [];
      arr = dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name];
    }
    let idMax;
    if (arr.length !== 0) {
      idMax = Math.max(...arr.map((item) => item.id)) + 1;
    } else {
      idMax = 1;
    }

    arr.push({
      id: idMax,
    });
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleAddItemProductPullDown = useCallback((indexMessage, indexContent, contentType) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][contentType].products;

    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][contentType].products = [];
      arr = dataMessages[indexMessage].message_content[indexContent][contentType].products;
    }
    let idMax;
    if (arr.length !== 0) {
      idMax = Math.max(...arr.map((item) => item.id)) + 1;
    } else {
      idMax = 1;
    }

    arr.push({
      id: idMax,
    });
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleAddItemAgreeTerm = useCallback((indexMessage, indexContent, type, contentType) => {
    let arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    if (arr === undefined || arr === null) {
      dataMessages[indexMessage].message_content[indexContent][type][contentType] = [];
      arr = dataMessages[indexMessage].message_content[indexContent][type][contentType];
    }

    arr.push({
      title_comment: '',
      title: '',
      urls: '',
      url_comment: '',
    });
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const messageArr = [...dataMessages[indexMessageSelect].message_content];
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dataMessages[indexMessageSelect].message_content = items;
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDragEndMessageOverview = useCallback((result) => {
    if (!result.destination) return;
    const messageArr = [...dataMessages];
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleSelectMessage(result.destination.index, 'user');
    setDataMessages([...items]);
  }, [dataMessages, handleSelectMessage, setDataMessages]);

  const handleDragEndRadioCheckbox = useCallback((result, idContent, type, contentType) => {
    if (!result.destination) return;
    const messageArr = dataMessages.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content
      .filter((content) => content.id === idContent)[0][type][contentType];
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let indexItem;
    for (let i = 0; i < dataMessages[indexMessageSelect].message_content.length; i++) {
      if (dataMessages[indexMessageSelect].message_content[i].id === idContent) {
        indexItem = i;
      }
    }
    dataMessages[indexMessageSelect].message_content[indexItem][type][contentType] = items;
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDragEndPullDown = useCallback((result, idContent, type, contentType, subContentType) => {
    if (!result.destination) return;
    const messageArr = dataMessages[indexMessageSelect].message_content.filter((content) => content.id === idContent)[0][type][contentType][subContentType];
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let indexItem;
    for (let i = 0; i < dataMessages[indexMessageSelect].message_content.length; i++) {
      if (dataMessages[indexMessageSelect].message_content[i].id === idContent) {
        indexItem = i;
      }
    }
    dataMessages[indexMessageSelect].message_content[indexItem][type][contentType][subContentType] = items;
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDragEndProduct = useCallback((result, idContent, type, contentType) => {
    if (!result.destination) return;
    const messageArr = dataMessages.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content
      .filter((content) => content.id === idContent)[0][type][contentType];
    const items = Array.from(messageArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let indexItem;
    for (let i = 0; i < dataMessages[indexMessageSelect].message_content.length; i++) {
      if (dataMessages[indexMessageSelect].message_content[i].id === idContent) {
        indexItem = i;
      }
    }
    dataMessages[indexMessageSelect].message_content[indexItem][type][contentType] = items;
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const onChangeFixedDate = useCallback((indexMessage, indexContent, type, value, name) => {
    if (value) {
      dataMessages[indexMessage].message_content[indexContent][type][name].push(moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    }
    dataMessages[indexMessage].message_content[indexContent][type].select_fixed_date = value;
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleChangeValueRequireZipCode = useCallback((indexMessage, indexContent, type, value, name) => {
    if (value === true && name === 'require') {
      onChangeValueMessageContent(indexMessage, indexContent, type, false, 'all_items_require');
      onChangeValueMessageContent(indexMessage, indexContent, type, value, 'require');
    } else if (value === true && name === 'all_items_require') {
      onChangeValueMessageContent(indexMessage, indexContent, type, false, 'require');
      onChangeValueMessageContent(indexMessage, indexContent, type, value, 'all_items_require');
    } else {
      onChangeValueMessageContent(indexMessage, indexContent, type, value, name);
    }
  }, [onChangeValueMessageContent]);

  const handleRemoveItemContent = useCallback((indexMessage, indexContent, type, contentType, indexItem) => {
    const newArrRadio = dataMessages[indexMessage].message_content[indexContent][type][contentType].filter((item, index) => index !== indexItem);
    dataMessages[indexMessage].message_content[indexContent][type][contentType] = newArrRadio;
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleRemoveItemCustomizePullDown = useCallback((indexMessage, indexContent, contentType, pullDownType, name, indexPullDown) => {
    const newArrRadio = dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name].filter((item, index) => index !== indexPullDown);
    dataMessages[indexMessage].message_content[indexContent][contentType][pullDownType][name] = newArrRadio;
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleRemoveItemProductPullDown = useCallback((indexMessage, indexContent, contentType, name, indexPullDown) => {
    const newArrRadio = dataMessages[indexMessage].message_content[indexContent][contentType].products.filter((item, index) => index !== indexPullDown);
    dataMessages[indexMessage].message_content[indexContent][contentType].products = newArrRadio;
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const handleRemoveItemZipCodeAddress = useCallback((indexMessage, indexContent, contentType, field) => {
    const newArr = dataMessages[indexMessage].message_content[indexContent][contentType];
    delete newArr[field];
    dataMessages[indexMessage].message_content[indexContent][contentType] = newArr;
    setDataMessages([...dataMessages]);
  }, [dataMessages, setDataMessages]);

  const createVariable = useCallback(() => {
    if (!variableName) {
      setErrorVariable('変数名を入力してください。');
      return;
    }
    const data = {
      variable: {
        variable_name: variableName,
        default_value: defaultValue,
      },
    };
    api.post(`/api/v1/managements/chatbots/${botId}/variables`, data).then((res) => {
      setIsOpenAddVariable(false);
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti('変数を作成しました。');
      } else if (res.data.code === 2) {
        setMessageNoti(res.data.message);
      }
      getListVariable();
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, 2000);
    }).catch((error) => {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    });
  }, [botId, defaultValue, getListVariable, setErrorVariable, setIsOpenAddVariable, setIsOpenNoti, setMessageNoti, variableName]);

  const onClickCreateStatement = useCallback(async (belongTo, indexMessage) => {
    let dataMessagesClone = [...dataMessages];
    if (indexMessage === undefined && belongTo === 'bot') {
      dataMessagesClone = [
        {
          id: 1,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          message_content: [
            {
              type: 'text_input',
              text_input: {
                use_for_confirm_message: false,
              },
              getting_error_notification: {
                use_for_confirm_message: false,
              },
              email: {},
              file: {},
              script: {},
              html_code: {},
              amazon_pay_button: { ...DEFAULT_AMAZON_PAY_BUTTON_CONFIG },
              delay: {
                typing_on: false,
              },
              api_link_age: {},
              clear_variable: {
                variables: [dataInputVar[0]?.variable_name],
              },
              variable_set: {
                variables: [
                  {
                    key: dataInputVar[0]?.variable_name,
                    value: '',
                  },
                ],
              },
            },
          ],
        },
      ];
    } else if (indexMessage === undefined && belongTo === 'user') {
      dataMessagesClone = [
        {
          id: 1,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          is_display_button_next: true,
          message_content: [],
        },
      ];
    } else if (indexMessage === undefined && belongTo === 'combine') {
      dataMessagesClone = [createDefaultCombineMessage(dataInputVar)];
    } else if (belongTo === 'bot') {
      const idMax = Math.max(...dataMessagesClone.map((item) => item.id)) + 1;
      dataMessagesClone.splice(indexMessage + 1, 0,
        {
          id: idMax,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          message_content: [
            {
              type: 'text_input',
              text_input: {
                use_for_confirm_message: false,
              },
              email: {},
              file: {},
              script: {},
              html_code: {},
              amazon_pay_button: { ...DEFAULT_AMAZON_PAY_BUTTON_CONFIG },
              delay: {},
              api_link_age: {},
              clear_variable: {
                variables: [dataInputVar[0]?.variable_name],
              },
              variable_set: {
                variables: [
                  {
                    key: dataInputVar[0]?.variable_name,
                    value: '',
                  },
                ],
              },
            },
          ],
        });
    } else if (belongTo === 'user') {
      const idMax = Math.max(...dataMessagesClone.map((item) => item.id)) + 1;
      dataMessagesClone.splice(indexMessage + 1, 0,
        {
          id: idMax,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          is_display_button_next: true,
          message_content: [],
        });
    } else if (belongTo === 'combine') {
      const idMax = Math.max(...dataMessagesClone.map((item) => item.id)) + 1;
      const combineMessage = createDefaultCombineMessage(dataInputVar);
      combineMessage.id = idMax;
      dataMessagesClone.splice(indexMessage + 1, 0, combineMessage);
    }

    setBelongTo('');
    setDataMessages([...dataMessagesClone]);
  }, [dataInputVar, dataMessages, setBelongTo, setDataMessages]);

  const applyConditionPanelLayout = (isUpCondition, role = 'bot') => {
    if (role === 'bot') {
      const container = document.querySelector('.ss-bot-setting-condition-container');
      if (container) {
        container.style.height = isUpCondition ? '52%' : '20%';
      }
    } else if (role === 'user') {
      const main = document.querySelector('.ss-user-setting__main');
      const bottom = document.querySelector('.ss-user-setting__bottom');
      if (main) {
        main.style.height = isUpCondition ? '25%' : '57%';
      }
      if (bottom) {
        bottom.style.maxHeight = isUpCondition ? '460px' : '220px';
      }
    }
  };

  const handlePannelCondition = useCallback((isUpCondition, role = 'bot') => {
    setIsConditionUp(isUpCondition);
    applyConditionPanelLayout(isUpCondition, role);
  }, [setIsConditionUp]);

  const resetConditionPanelLayout = useCallback((role = 'bot') => {
    setIsConditionUp(false);
    applyConditionPanelLayout(false, role);
  }, [setIsConditionUp]);

  const onChangeValueCondition = useCallback((index, value, name) => {
    dataMessages[indexMessageSelect].conditions[index][name] = value;
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const onClickAddCondition = useCallback(() => {
    dataMessages[indexMessageSelect].conditions.push({
      linkCondition: 'and',
      condition: 'is',
      nameCondition: 'current_url',
      inputCondition: '',
    });
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDeleteCondition = useCallback((indexCondition) => {
    const dataMessageClone = [...dataMessages];
    const dataConditionFilter = dataMessageClone[indexMessageSelect].conditions.filter((item, index) => index !== indexCondition);
    dataMessageClone[indexMessageSelect].conditions = dataConditionFilter;
    setDataMessages([...dataMessageClone]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const onChangeAmazonPayDisplayMode = useCallback((mode) => {
    const message = dataMessages[indexMessageSelect];
    message.conditions = applyAmazonPayDisplayModeToConditions(message.conditions || [], mode);
    setDataMessages([...dataMessages]);
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDownloadFile = useCallback((file) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = 'file';
    document.body.appendChild(link);

    link.click();
    link.remove();
  }, []);

  const isColor = useCallback((strColor) => {
    const s = new Option().style;
    s.color = strColor;
    const test1 = s.color == strColor;
    const test2 = /^#[a-fA-F0-9]{3,6}$/i.test(strColor);
    if (test1 == true || test2 == true) {
      return true;
    }
    return false;
  }, []);

  return {
    botUploadFile,
    carouselUploadFile,
    getBaseUrl,
    handleSelectMessage,
    handleHiddenMessage,
    handleSelectContentMessage,
    handleEditIconClick,
    handleChangeBotStatementType,
    handleAddItemSetting,
    handleAddCombineBlock,
    handleChangeCombineBlockType,
    handleChangeCombineContentGap,
    handleChangeCombineBlockPadding,
    handleCopyMessage,
    handleDeleteMessageContent,
    handleDeleteMessage,
    handleAddItemRadioCheckbox,
    handleAddItemCustomizePullDown,
    handleAddItemProductPullDown,
    handleAddItemAgreeTerm,
    handleDragEnd,
    handleDragEndMessageOverview,
    handleDragEndRadioCheckbox,
    handleDragEndPullDown,
    handleDragEndProduct,
    onChangeFixedDate,
    handleChangeValueRequireZipCode,
    handleRemoveItemContent,
    handleRemoveItemCustomizePullDown,
    handleRemoveItemProductPullDown,
    handleRemoveItemZipCodeAddress,
    createVariable,
    onClickCreateStatement,
    handlePannelCondition,
    resetConditionPanelLayout,
    onChangeValueCondition,
    onClickAddCondition,
    handleDeleteCondition,
    onChangeAmazonPayDisplayMode,
    handleDownloadFile,
    isColor,
  };
};

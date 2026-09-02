import { useCallback, useRef } from 'react';
import { message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import nanoMetadata from 'nano-metadata';
import cloneDeep from 'lodash/cloneDeep';
import api from 'v2/api/api-management';
import { S3_UPLOAD_URL } from '../../../../../variables/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { createDefaultContentItem, getNextContentId } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/scenarioContentDefaults';
import {
  createDefaultCombineBlock,
  createDefaultCombineMessage,
  createDefaultCombineBotBlock,
} from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/combineContentDefaults';
import { DEFAULT_AMAZON_PAY_BUTTON_CONFIG } from '../../../../../variables/amazonPayConstants';
import { applyAmazonPayDisplayModeToConditions } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/amazonPayConfigUtils';
import { getDefaultOrderConfirmConfig } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/OrderConfirmLpScriptGenerator';
import { getDefaultCartLoginConfig } from '../constants/cartLoginConstants';

const withClonedMessages = (dataMessages, mutator) => {
  const next = cloneDeep(dataMessages);
  mutator(next);
  return next;
};

export const useScenarioMessageActions = ({ state, actions, messages }) => {
  const {
    indexMessageSelect,
    indexCarouselSlide,
    dataMessages,
    botId,
    variableName,
    defaultValue,
    dataInputVar,
  } = state;

  const {
    setFileError,
    setFileErrorCarousel,
    setDataMessages,
    setBelongTo,
    setMessageType,
    setIndexMessageSelect,
    setIsConditionUp,
    setEditorSelectedRadioOption,
    setEditorSelectedCheckboxOption,
    setIsOpenAddVariable,
    setErrorVariable,
    setVariableName,
    setDefaultValue,
    getListVariable,
  } = actions;

  const { onChangeValueMessageContent } = messages;
  const creatingVariableRef = useRef(false);

  const botUploadFile = useCallback(() => {
    document.getElementById('ss-bot-file-upload')?.click();
  }, []);

  const carouselUploadFile = useCallback(() => {
    document.getElementById('ss-carouse-file-upload')?.click();
  }, []);

  const getBaseUrl = useCallback(async (event, indexContent) => {
    const fileInput = event.target.files[0];
    const type = fileInput.name.slice(fileInput.name.lastIndexOf('.') + 1).toLowerCase();

    const trueFile = dataMessages[indexMessageSelect].belong_to === 'user'
      ? ['jpeg', 'jpg', 'png'].includes(type)
      : ['jpeg', 'jpg', 'png', 'pdf', 'mp4'].includes(type);
    if (trueFile) {
      if (type !== 'pdf' && type !== 'mp4' && fileInput.size / 1024 / 1024 >= 2) {
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
      const file = { user_file: { file_type: type, size: fileInput.size, timeplay: `${type === 'mp4' ? video?.duration : ''}` } };
      api
        .post('/api/v1/managements/file/upload', file)
        .then((res) => {
          const urlFile = res.data.data.url;
          const filePost = { user_file: { file_type: type, file_url: res.data.data.path } };
          const typeUpload = type === 'mp4'
            ? 'video/mp4'
            : type === 'pdf'
              ? 'application/pdf'
              : `image/${type}`;

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
                  if (res.data.code === 1) {
                    setDataMessages(withClonedMessages(dataMessages, (next) => {
                      if (next[indexMessageSelect].belong_to === 'user') {
                        next[indexMessageSelect].message_content[indexContent].carousel.default.contents[indexCarouselSlide].fileUrl = S3_UPLOAD_URL + res.data.data.file_url;
                      } else {
                        next[indexMessageSelect].message_content[0].file.content = S3_UPLOAD_URL + res.data.data.file_url;
                      }
                    }));
                    message.success('追加しました。');
                  } else {
                    message.warning('追加できませんでした。');
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
  }, [dataMessages, indexCarouselSlide, indexMessageSelect, setDataMessages, setFileError, setFileErrorCarousel]);

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
    const next = withClonedMessages(dataMessages, (cloned) => {
      cloned[index].hidden = !cloned[index].hidden;
    });

    if (role === 'bot') {
      document.querySelectorAll('.ss-bot-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-bot-chat-overview-${index}`)) {
          if (!next[index].hidden) ele.style.opacity = '1';
          if (next[index].hidden) ele.style.opacity = '0.4';
        }
      });
    } else if (role === 'user') {
      document.querySelectorAll('.ss-user-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-user-chat-detail-content-${index}`)) {
          if (!next[index].hidden) ele.style.opacity = '1';
          if (next[index].hidden) ele.style.opacity = '0.4';
        }
      });
    } else if (role === 'combine') {
      document.querySelectorAll('.ss-combine-chat-detail-content').forEach((ele) => {
        if (ele.classList.contains(`ss-combine-chat-detail-content-${index}`)) {
          ele.style.opacity = next[index].hidden ? '0.4' : '1';
        }
      });
    }

    setDataMessages(next);
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
    setDataMessages(withClonedMessages(dataMessages, (data) => {
      data.forEach((item, i) => {
        if (indexMessageSelect !== undefined && i === indexMessageSelect) {
          data[i].message_content[0].type = value;
          if (value === 'order_confirm' && !data[i].message_content[0].order_confirm) {
            data[i].message_content[0].order_confirm = getDefaultOrderConfirmConfig();
          }
          if (value === 'cart_login' && !data[i].message_content[0].cart_login) {
            data[i].message_content[0].cart_login = getDefaultCartLoginConfig();
          }
        }
      });
    }));
  }, [dataMessages, indexMessageSelect, setMessageType, setDataMessages]);

  const handleAddItemSetting = useCallback((messageType) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const arrMess = next[indexMessageSelect].message_content;
      const idMax = getNextContentId(arrMess);
      arrMess.push(createDefaultContentItem(messageType, idMax));
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleAddCombineBlock = useCallback((role, blockType) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const newBlock = createDefaultCombineBlock(role, blockType, next[indexMessageSelect].message_content);
      next[indexMessageSelect].message_content.push(newBlock);
    }));
    setMessageType(blockType);
  }, [dataMessages, indexMessageSelect, setDataMessages, setMessageType]);

  const handleChangeCombineBlockType = useCallback((indexContent, blockType) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const currentBlock = next[indexMessageSelect].message_content[indexContent];
      const newBlock = createDefaultCombineBotBlock(blockType, currentBlock.id);
      newBlock.padding = currentBlock.padding;
      next[indexMessageSelect].message_content[indexContent] = newBlock;
    }));
    setMessageType(blockType);
  }, [dataMessages, indexMessageSelect, setDataMessages, setMessageType]);

  const handleChangeCombineContentGap = useCallback((value) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      if (!next[indexMessageSelect].combine_message) {
        next[indexMessageSelect].combine_message = {};
      }
      next[indexMessageSelect].combine_message.content_gap = value;
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleChangeCombineBlockPadding = useCallback((indexContent, value) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessageSelect].message_content[indexContent].padding = value;
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleCopyMessage = useCallback((index) => {
    const next = [...dataMessages];
    const idMax = Math.max(...dataMessages.map((item) => item.id)) + 1;
    const arrMessage = cloneDeep(dataMessages[index]);
    arrMessage.id = idMax;
    next.splice(index, 0, arrMessage);
    setDataMessages(next);
  }, [dataMessages, setDataMessages]);

  const handleDeleteMessageContent = useCallback((indexMessage, indexContent) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const arrMessage = next[indexMessage].message_content;
      next[indexMessage].message_content = [
        ...arrMessage.slice(0, indexContent),
        ...arrMessage.slice(indexContent + 1),
      ];
    }));
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
    if (contentType === 'upsell_button') {
      return;
    }
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const contentNode = next[indexMessage].message_content[indexContent][type];
      if (contentNode[contentType] === undefined || contentNode[contentType] === null) {
        contentNode[contentType] = [];
      }
      const arr = contentNode[contentType];
      const idMax = arr.length !== 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
      if (type === 'radio_button') {
        arr.push({ id: idMax, value: String(idMax) });
      } else {
        arr.push({ id: idMax, contents: [{ id: 1 }] });
      }
    }));
  }, [dataMessages, setDataMessages]);

  const handleAddItemCustomizePullDown = useCallback((indexMessage, indexContent, contentType, pullDownType, name) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const pullDownNode = next[indexMessage].message_content[indexContent][contentType][pullDownType];
      if (pullDownNode[name] === undefined || pullDownNode[name] === null) {
        pullDownNode[name] = [];
      }
      const arr = pullDownNode[name];
      const idMax = arr.length !== 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
      arr.push({ id: idMax });
    }));
  }, [dataMessages, setDataMessages]);

  const handleAddItemProductPullDown = useCallback((indexMessage, indexContent, contentType) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const productNode = next[indexMessage].message_content[indexContent][contentType];
      if (productNode.products === undefined || productNode.products === null) {
        productNode.products = [];
      }
      const arr = productNode.products;
      const idMax = arr.length !== 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
      arr.push({ id: idMax });
    }));
  }, [dataMessages, setDataMessages]);

  const handleAddItemAgreeTerm = useCallback((indexMessage, indexContent, type, contentType) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const termNode = next[indexMessage].message_content[indexContent][type];
      if (termNode[contentType] === undefined || termNode[contentType] === null) {
        termNode[contentType] = [];
      }
      const arr = termNode[contentType];
      arr.push({
        title_comment: '',
        title: '',
        urls: '',
        url_comment: '',
      });
    }));
  }, [dataMessages, setDataMessages]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const items = Array.from(next[indexMessageSelect].message_content);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      next[indexMessageSelect].message_content = items;
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDragEndMessageOverview = useCallback((result) => {
    if (!result.destination) return;
    const items = Array.from(dataMessages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleSelectMessage(result.destination.index, 'user');
    setDataMessages(items);
  }, [dataMessages, handleSelectMessage, setDataMessages]);

  const handleDragEndRadioCheckbox = useCallback((result, idContent, type, contentType) => {
    if (!result.destination) return;
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const messageArr = next.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content
        .filter((content) => content.id === idContent)[0][type][contentType];
      const items = Array.from(messageArr);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      const indexItem = next[indexMessageSelect].message_content.findIndex((content) => content.id === idContent);
      next[indexMessageSelect].message_content[indexItem][type][contentType] = items;
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDragEndPullDown = useCallback((result, idContent, type, contentType, subContentType) => {
    if (!result.destination) return;
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const messageArr = next[indexMessageSelect].message_content.filter((content) => content.id === idContent)[0][type][contentType][subContentType];
      const items = Array.from(messageArr);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      const indexItem = next[indexMessageSelect].message_content.findIndex((content) => content.id === idContent);
      next[indexMessageSelect].message_content[indexItem][type][contentType][subContentType] = items;
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDragEndProduct = useCallback((result, idContent, type, contentType) => {
    if (!result.destination) return;
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      const messageArr = next.filter((message, index) => message.belong_to === 'user' && index === indexMessageSelect)[0].message_content
        .filter((content) => content.id === idContent)[0][type][contentType];
      const items = Array.from(messageArr);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      const indexItem = next[indexMessageSelect].message_content.findIndex((content) => content.id === idContent);
      next[indexMessageSelect].message_content[indexItem][type][contentType] = items;
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const onChangeFixedDate = useCallback((indexMessage, indexContent, type, value, name) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      if (value) {
        next[indexMessage].message_content[indexContent][type][name].push(moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD'));
      }
      next[indexMessage].message_content[indexContent][type].select_fixed_date = value;
    }));
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
    if (contentType === 'upsell_button') {
      return;
    }
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessage].message_content[indexContent][type][contentType] =
        next[indexMessage].message_content[indexContent][type][contentType].filter((_, index) => index !== indexItem);
    }));
  }, [dataMessages, setDataMessages]);

  const handleRemoveItemCustomizePullDown = useCallback((indexMessage, indexContent, contentType, pullDownType, name, indexPullDown) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessage].message_content[indexContent][contentType][pullDownType][name] =
        next[indexMessage].message_content[indexContent][contentType][pullDownType][name].filter((_, index) => index !== indexPullDown);
    }));
  }, [dataMessages, setDataMessages]);

  const handleRemoveItemProductPullDown = useCallback((indexMessage, indexContent, contentType, name, indexPullDown) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessage].message_content[indexContent][contentType].products =
        next[indexMessage].message_content[indexContent][contentType].products.filter((_, index) => index !== indexPullDown);
    }));
  }, [dataMessages, setDataMessages]);

  const handleRemoveItemZipCodeAddress = useCallback((indexMessage, indexContent, contentType, field) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      delete next[indexMessage].message_content[indexContent][contentType][field];
    }));
  }, [dataMessages, setDataMessages]);

  const createVariable = useCallback(() => {
    if (creatingVariableRef.current) return;
    if (!variableName) {
      setErrorVariable('変数名は、必ず指定してください。');
      return;
    }
    creatingVariableRef.current = true;
    const data = {
      variable: {
        variable_name: variableName,
        default_value: defaultValue,
      },
    };
    api.post(`/api/v1/managements/chatbots/${botId}/variables`, data).then((res) => {
      if (res.data.code === 1) {
        setIsOpenAddVariable(false);
        setVariableName('');
        setDefaultValue('');
        setErrorVariable('');
        message.success('変数を作成しました。');
        getListVariable();
      } else if (res.data.code === 2) {
        message.warning(res.data.message);
      }
    }).catch((error) => {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    }).finally(() => {
      creatingVariableRef.current = false;
    });
  }, [botId, defaultValue, getListVariable, setDefaultValue, setErrorVariable, setIsOpenAddVariable, setVariableName, variableName]);

  const onClickCreateStatement = useCallback(async (belongTo, indexMessage) => {
    const dataMessagesClone = (() => {
      if (indexMessage === undefined && belongTo === 'bot') {
        return [
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
                order_confirm: getDefaultOrderConfirmConfig(),
                cart_login: getDefaultCartLoginConfig(),
              },
            ],
          },
        ];
      }
      if (indexMessage === undefined && belongTo === 'user') {
        return [
          {
            id: 1,
            hidden: false,
            belong_to: belongTo,
            conditions: [],
            is_display_button_next: true,
            message_content: [],
          },
        ];
      }
      if (indexMessage === undefined && belongTo === 'combine') {
        return [createDefaultCombineMessage(dataInputVar)];
      }

      const cloned = cloneDeep(dataMessages);
      const idMax = Math.max(...cloned.map((item) => item.id)) + 1;

      if (belongTo === 'bot') {
        cloned.splice(indexMessage + 1, 0, {
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
              order_confirm: getDefaultOrderConfirmConfig(),
              cart_login: getDefaultCartLoginConfig(),
            },
          ],
        });
        return cloned;
      }

      if (belongTo === 'user') {
        cloned.splice(indexMessage + 1, 0, {
          id: idMax,
          hidden: false,
          belong_to: belongTo,
          conditions: [],
          is_display_button_next: true,
          message_content: [],
        });
        return cloned;
      }

      if (belongTo === 'combine') {
        const combineMessage = createDefaultCombineMessage(dataInputVar);
        combineMessage.id = idMax;
        cloned.splice(indexMessage + 1, 0, combineMessage);
        return cloned;
      }

      return cloned;
    })();

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
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessageSelect].conditions[index][name] = value;
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const onClickAddCondition = useCallback(() => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessageSelect].conditions.push({
        linkCondition: 'and',
        condition: 'is',
        nameCondition: 'current_url',
        inputCondition: '',
      });
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const handleDeleteCondition = useCallback((indexCondition) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessageSelect].conditions = next[indexMessageSelect].conditions.filter((_, index) => index !== indexCondition);
    }));
  }, [dataMessages, indexMessageSelect, setDataMessages]);

  const onChangeAmazonPayDisplayMode = useCallback((mode) => {
    setDataMessages(withClonedMessages(dataMessages, (next) => {
      next[indexMessageSelect].conditions = applyAmazonPayDisplayModeToConditions(next[indexMessageSelect].conditions || [], mode);
    }));
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
    const test1 = s.color === strColor;
    const test2 = /^#[a-fA-F0-9]{3,6}$/i.test(strColor);
    if (test1 === true || test2 === true) {
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

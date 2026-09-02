import React from 'react';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioComon/InputCustom';
import { buildCardPaymentRadioContext } from './cardPaymentRadioButtonContext';
import '../../styles/contentSettings/cardPaymentRadioButton.css';

const PictureRadioTypeSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    handleDragEndRadioCheckbox,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;
  const { cardPaymentRadioButton } = buildCardPaymentRadioContext(props);

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'radio_contents_img')}>
        <Droppable droppableId='payment-radio-img'>
          {(providedChild) => {
            return <div className="ss-user-setting-item-payment-radio-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
              {
                Array.isArray(cardPaymentRadioButton.radio_contents_img) && cardPaymentRadioButton.radio_contents_img
                  .map((itemPaymentRadioImg, indexPaymentRadioImg, array) => {
                    return (
                      <Draggable draggable={true} key={itemPaymentRadioImg.id} draggableId={itemPaymentRadioImg.id + ''} index={indexPaymentRadioImg}>
                        {(providedChild) => (
                          <div
                            key={itemPaymentRadioImg.id}
                            {...providedChild.draggableProps}
                            {...providedChild.dragHandleProps}
                            ref={providedChild.innerRef}
                          >
                            <div className="ss-card-payment-radio-setting__picture-item">
                              <MDBIcon fas icon="grip-horizontal" className="ss-card-payment-radio-setting__picture-grip" />
                              <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-img"
                              >
                                {itemPaymentRadioImg.contents.map((itemContentPayment, indexContentPayment, arrContent) => {
                                  return <React.Fragment key={indexContentPayment}>
                                    <div className="ss-card-payment-radio-setting__picture-content">
                                      <div className="ss-user-setting__item-bottom ss-card-payment-radio-setting__file-input-row">
                                        <InputCustom
                                          className="ss-card-payment-radio-setting__file-input"
                                          placeholder="ファイルのURL"
                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents_img', indexPaymentRadioImg, 'contents', indexContentPayment, 'file_url')}
                                          value={itemContentPayment.file_url}
                                        />
                                        <MDBIcon onClick={() => {
                                          setAcceptFile(['image'])
                                          setIsOpenFileReference(true)
                                          setVarFileReference({ indexContent, contentType: content.type, subContentType: 'radio_contents_img', indexSubContentType: indexPaymentRadioImg, childSubContentType: 'contents', indexChildSubContentType: indexContentPayment, img: 'file_url' })
                                        }}
                                          fas icon="paperclip"
                                          className="ss-card-payment-radio-setting__clip-icon"
                                        />
                                      </div>
                                      <div className="ss-drag-option-row">
                                        <InputDouble
                                          placeholder={["テキスト", "値"]}
                                          valueLeft={itemContentPayment.text}
                                          valueRight={itemContentPayment.value}
                                          onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents_img', indexPaymentRadioImg, 'contents', indexContentPayment, name === 'left' ? 'text' : 'value')}
                                        />
                                      </div>
                                      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                        <CheckboxCustom
                                          label="初期選択設定"
                                          value={cardPaymentRadioButton.initial_selection_picture === `${itemPaymentRadioImg.id}-${itemContentPayment.id}`}
                                          onChange={() => {
                                            if (cardPaymentRadioButton.initial_selection_picture !== `${itemPaymentRadioImg.id}-${itemContentPayment.id}`) {
                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, `${itemPaymentRadioImg.id}-${itemContentPayment.id}`, 'initial_selection_picture')
                                            } else {
                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection_picture')
                                            }
                                          }}
                                        />
                                        <CheckboxCustom
                                          label="カード決済連動設定"
                                          value={cardPaymentRadioButton.card_linked_setting_picture === `${itemPaymentRadioImg.id}-${itemContentPayment.id}`}
                                          onChange={() => {
                                            if (cardPaymentRadioButton.card_linked_setting_picture !== `${itemPaymentRadioImg.id}-${itemContentPayment.id}`) {
                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, `${itemPaymentRadioImg.id}-${itemContentPayment.id}`, 'card_linked_setting_picture')
                                            } else {
                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'card_linked_setting_picture')
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </React.Fragment>
                                })}
                              </div>
                              <div className="ss-user-setting-plus-minus-icon ss-setting-flex-center">
                                <div>
                                  {itemPaymentRadioImg.contents.length < 3 &&
                                    <div className="ss-card-payment-radio-setting__counter-add"
                                      onClick={() => {
                                        const arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents];
                                        const idMax = arrMess.length !== 0 ? Math.max(...arrMess.map((item) => item.id)) + 1 : 1;
                                        dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents.push({
                                          id: idMax
                                        });
                                        setDataMessages([...dataMessages]);
                                      }}
                                    >+</div>}
                                  {itemPaymentRadioImg.contents.length > 1 &&
                                    <div className="ss-card-payment-radio-setting__counter-remove"
                                      onClick={() => {
                                        dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents.pop();
                                        setDataMessages([...dataMessages]);
                                      }}
                                    >-</div>}
                                </div>
                              </div>
                              {array.length > 1 &&
                                <div className="ss-user-setting-payment-radio-times-icons">
                                  <MDBIcon fas icon="times-circle"
                                    onClick={() => {
                                      const arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img];
                                      const startArr = arrMessage.slice(0, indexPaymentRadioImg);
                                      const lastArr = arrMessage.slice(indexPaymentRadioImg + 1, arrMessage.length);
                                      dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img = [...startArr, ...lastArr];
                                      setDataMessages([...dataMessages]);
                                    }} />
                                </div>
                              }
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  })
              }
              {providedChild.placeholder}
            </div>
          }}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
};

export default PictureRadioTypeSetting;

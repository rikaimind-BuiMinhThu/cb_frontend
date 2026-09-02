import React from 'react';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../../scenarioComon/SelectCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioComon/InputCustom';
import CheckboxGroupCustom from '../../scenarioComon/CheckboxGroupCustom';
import { Tooltip } from '@mui/material';
import { PAYMENT_OPTION_IMAGE_FIELDS } from '../../constants/paymentStyleConstants';
import {
  dataPaymentMethod, dataYearFixed, dataMonthFixed, installmentOptions,
} from '../../constants/scenarioFormConstants';
import { buildCardPaymentRadioContext } from './cardPaymentRadioButtonContext';
import '../../styles/contentSettings/cardPaymentRadioButton.css';

const DefaultTypeSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    isUseFukushashiki,
    renderPaymentMethodDescriptionInput,
    handleDragEndRadioCheckbox,
  } = props;
  const { cardPaymentRadioButton } = buildCardPaymentRadioContext(props);

  return (
        <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'radio_contents')}>
          <Droppable droppableId='payment-radio'>
            {(providedChild) => {
              return <div className="ss-user-setting-item-payment-radio-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                {isUseFukushashiki && (
                  <div className="ss-user-setting__item-bottom ss-fukushashiki-row">
                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                      <div className="ss-fukushashiki-row__mode--23">
                        <SelectCustom
                          id="title"
                          className="ss-select--full"
                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']}
                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_mode', value)}
                          data={[
                            { key: 1, value: 'id' },
                            { key: 2, value: 'css_selector' },
                            { key: 3, value: 'xpath' }
                          ]}
                          keyValue="key"
                          placeholder="複写先要素の取得方法をお選びください"
                        />
                      </div>
                    </Tooltip>
                    <div className="ss-fukushashiki-row__value--75">
                      <InputCustom
                        styleLabel={{ width: '100%' }}
                        maxLength={250}
                        useFukushashiki={true}
                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_value', value)}
                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_value']}
                        placeholder={{
                          1: '複写先要素のIDを入力ください',
                          2: '複写先要素のcss_selectorを入力ください',
                          3: '複写先要素のxPathを入力ください',
                        }[
                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']
                        ] || ''}
                      />
                    </div>
                  </div>
                )}
                {
                  Array.isArray(cardPaymentRadioButton.radio_contents) && cardPaymentRadioButton.radio_contents
                    .map((itemPaymentRadio, indexPaymentRadio, array) => {
                      return (
                        <Draggable draggable={true} key={itemPaymentRadio.id} draggableId={itemPaymentRadio.id + ''} index={indexPaymentRadio}>
                          {(providedChild) => (
                            <div
                              key={itemPaymentRadio.id}
                              {...providedChild.draggableProps}
                              {...providedChild.dragHandleProps}
                              ref={providedChild.innerRef}
                            >
                              <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-no-img">
                                <div className="ss-drag-option-row">
                                  <MDBIcon fas icon="grip-horizontal" className="ss-drag-handle-icon" />
                                  <InputDouble
                                    placeholder={["テキスト", "値"]}
                                    valueLeft={itemPaymentRadio.text}
                                    valueRight={itemPaymentRadio.value}
                                    onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents', indexPaymentRadio, name === 'left' ? 'text' : 'value')}
                                  />
                                </div>
                                <div className="ss-card-payment-radio-setting__image-fields-row">
                                  {PAYMENT_OPTION_IMAGE_FIELDS.map(({ key, label }) => (
                                    <div key={key} className="ss-card-payment-radio-setting__image-field">
                                      <span className="ss-card-payment-radio-setting__image-label">{label}</span>
                                      {itemPaymentRadio[key] && (
                                        <img src={itemPaymentRadio[key]} alt={label} className="ss-card-payment-radio-setting__image-preview" />
                                      )}
                                      <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={(e) => {
                                          const file = e.target.files[0];
                                          e.target.value = null;
                                          if (!file) return;
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, reader.result, 'radio_contents', indexPaymentRadio, key);
                                          };
                                          reader.readAsDataURL(file);
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                  <CheckboxCustom
                                    label="初期選択設定"
                                    value={cardPaymentRadioButton.initial_selection === itemPaymentRadio.value}
                                    onChange={() => {
                                      if (cardPaymentRadioButton.initial_selection !== itemPaymentRadio.value) {
                                        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'initial_selection');
                                      } else {
                                        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                      }
                                    }}
                                  />
                                  <CheckboxCustom
                                    label="説明HTML"
                                    onChange={(value) => {
                                      itemPaymentRadio.isUsedHTMLDescription = value;
                                      setDataMessages([...dataMessages]);
                                    }}
                                    value={itemPaymentRadio.isUsedHTMLDescription}
                                  />
                                  <CheckboxCustom
                                    label="カード決済連動設定"
                                    value={cardPaymentRadioButton.card_linked_setting.includes(itemPaymentRadio.value)}
                                    onChange={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'card_linked_setting')}
                                  />
                                </div>
                                {renderPaymentMethodDescriptionInput({ selectedItem: itemPaymentRadio, dataMessages })}
                                {array.length > 1 &&
                                  <div className="ss-user-setting-payment-radio-times-icons">
                                    <MDBIcon fas icon="times-circle"
                                      onClick={() => {
                                        let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                        let startArr = arrMessage.slice(0, indexPaymentRadio);
                                        let lastArr = arrMessage.slice(indexPaymentRadio + 1, arrMessage.length);
                                        dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents = [...startArr, ...lastArr];
                                        setDataMessages([...dataMessages]);
                                      }} />
                                  </div>
                                }
                                {cardPaymentRadioButton.card_linked_setting.includes(itemPaymentRadio.value) && (
                                  <>
                                    <div className="ss-user-setting__item-bottom">
                                      <div className="ss-shipping-address-setting__linked-divider"></div>
                                    </div>
                                    <div className="ss-user-setting__item-bottom">
                                      <div className="ss-shipping-address-setting__linked-title">
                                        <span>カード決済連動設定</span>
                                      </div>
                                    </div>
                                    <div className="ss-user-setting__item-bottom">
                                      <div className="ss-card-payment-radio-setting__options-display-row">
                                        <div className="ss-card-payment-radio-setting__options-col">
                                          <CheckboxCustom
                                            label="CVC非表示"
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_cvc')}
                                            value={cardPaymentRadioButton.is_hide_cvc}
                                          />
                                        </div>
                                        <div className="ss-card-payment-radio-setting__options-col--wide">
                                          <CheckboxCustom
                                            label="カード名非表示"
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_card_name')}
                                            value={cardPaymentRadioButton.is_hide_card_name}
                                          />
                                        </div>
                                        <div className="ss-card-payment-radio-setting__options-col">
                                          <CheckboxCustom
                                            label="分割払い"
                                            onChange={() => {
                                              let updatedInstallment = Array.isArray(cardPaymentRadioButton.is_use_installment)
                                                ? [...cardPaymentRadioButton.is_use_installment]
                                                : [];
                                              if (updatedInstallment.includes(itemPaymentRadio.value)) {
                                                updatedInstallment = updatedInstallment.filter(id => id !== itemPaymentRadio.value);
                                              } else {
                                                updatedInstallment.push(itemPaymentRadio.value);
                                              }
                                              console.log("Updated installment:", updatedInstallment);
                                              onChangeValueMessageContent(
                                                indexMessageSelect,
                                                indexContent,
                                                content.type,
                                                updatedInstallment,
                                                'is_use_installment'
                                              );
                                            }}
                                            value={Array.isArray(cardPaymentRadioButton.is_use_installment)
                                              ? cardPaymentRadioButton.is_use_installment.includes(itemPaymentRadio.value)
                                              : false}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ss-user-setting__item-bottom">
                                      <div className="ss-card-payment-radio-setting__options-display-row">
                                        <div className="ss-card-payment-radio-setting__options-col">
                                          <CheckboxCustom
                                            label="セパレート式"
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_type')}
                                            value={cardPaymentRadioButton.separate_type}
                                          />
                                        </div>
                                        <div className="ss-card-payment-radio-setting__options-col--wide">
                                          <CheckboxCustom
                                            label="有効性チェックをする"
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'validity_check')}
                                            value={cardPaymentRadioButton.validity_check}
                                          />
                                        </div>
                                        <div className="ss-card-payment-radio-setting__options-col">
                                          <CheckboxCustom
                                            label="姓と名を分けて入力する"
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_name')}
                                            value={cardPaymentRadioButton.separate_name}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ss-card-payment-radio-setting__expiry-row">
                                          <span className="ss-field-label--section">有効期限</span>
                                          <SelectCustom
                                            className="ss-card-payment-radio-setting__expiry-select"
                                            allowClear={false}
                                            value={cardPaymentRadioButton.type_date_of_expiry}
                                            data={[{ key: 'ym', value: 'YM' }, { key: 'my', value: 'MY' }]}
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type_date_of_expiry')}
                                          />
                                      </div>
                                    <div className="ss-user-setting__item-bottom">
                                      <CheckboxGroupCustom
                                        className="ss-setting-width-90"
                                        value={cardPaymentRadioButton.payment_method}
                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'payment_method')}
                                        data={dataPaymentMethod}
                                      />
                                    </div>
                                    {cardPaymentRadioButton.separate_type === false ?
                                      <div className="ss-user-setting__item-bottom">
                                        <InputCustom
                                          styleLabel={{ width: '90%' }}
                                          label="カード番号"
                                          inline={false}
                                          placeholder="プレースホルダ"
                                          value={cardPaymentRadioButton.card_number_placeholder}
                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder')}
                                        />
                                        {isUseFukushashiki &&
                                          <>
                                            <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row">
                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                  <SelectCustom
                                                    id="title"
                                                    className="ss-select--full"
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_mode']}
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number_fukushashiki_search_mode', value)}
                                                    data={[
                                                      { key: 1, value: 'id' },
                                                      { key: 2, value: 'css_selector' },
                                                      { key: 3, value: 'xpath' }
                                                    ]}
                                                    keyValue="key"
                                                    placeholder="複写先要素の取得方法をお選びください"
                                                  />
                                                </div>
                                              </Tooltip>
                                              <Tooltip title={{
                                                1: '複写先要素のIDを入力ください',
                                                2: '複写先要素のcss_selectorを入力ください',
                                                3: '複写先要素のxPathを入力ください',
                                              }[
                                                dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_mode']
                                              ] || ''} placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                  <InputCustom
                                                    styleLabel={{ width: '100%' }}
                                                    className="ss-input--full"
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number_fukushashiki_search_value', value)}
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_value']}
                                                    placeholder={{
                                                      1: '複写先要素のIDを入力ください',
                                                      2: '複写先要素のcss_selectorを入力ください',
                                                      3: '複写先要素のxPathを入力ください',
                                                    }[
                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number_fukushashiki_search_value']
                                                    ] || ''}
                                                  />
                                                </div>
                                              </Tooltip>
                                            </div>
                                          </>}
                                      </div> :
                                      <div className="ss-user-setting__item-bottom">
                                        <div className="ss-setting-width-90">カード番号</div>
                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type ss-card-payment-radio-setting__options-wrap">
                                          <div className={isUseFukushashiki ? 'ss-card-payment-radio-setting__field-col--full' : 'ss-card-payment-radio-setting__field-col--half'}>
                                            <InputCustom
                                              className="ss-input--full"
                                              placeholder="プレースホルダ"
                                              value={cardPaymentRadioButton.card_number_placeholder1}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder1')}
                                            />
                                            {isUseFukushashiki && <>
                                              <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row--no-width">
                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                    <SelectCustom
                                                      id="title"
                                                      className="ss-select--full"
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_mode']}
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number1_fukushashiki_search_mode', value)}
                                                      data={[
                                                        { key: 1, value: 'id' },
                                                        { key: 2, value: 'css_selector' },
                                                        { key: 3, value: 'xpath' }
                                                      ]}
                                                      keyValue="key"
                                                      placeholder="複写先要素の取得方法をお選びください"
                                                    />
                                                  </div>
                                                </Tooltip>
                                                <Tooltip title={{
                                                  1: '複写先要素のIDを入力ください',
                                                  2: '複写先要素のcss_selectorを入力ください',
                                                  3: '複写先要素のxPathを入力ください',
                                                }[
                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_mode']
                                                ] || ''} placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                    <InputCustom
                                                      styleLabel={{ width: '100%' }}
                                                      className="ss-input--full"
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number1_fukushashiki_search_value', value)}
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_value']}
                                                      placeholder={{
                                                        1: '複写先要素のIDを入力ください',
                                                        2: '複写先要素のcss_selectorを入力ください',
                                                        3: '複写先要素のxPathを入力ください',
                                                      }[
                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number1_fukushashiki_search_value']
                                                      ] || ''}
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </div> </>}
                                          </div>
                                          <div className={isUseFukushashiki ? 'ss-card-payment-radio-setting__field-col--full' : 'ss-card-payment-radio-setting__field-col--half'}>
                                            <InputCustom
                                              className="ss-input--full"
                                              placeholder="プレースホルダ"
                                              value={cardPaymentRadioButton.card_number_placeholder2}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder2')}
                                            />
                                            {isUseFukushashiki && <>
                                              <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row--no-width">
                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                    <SelectCustom
                                                      id="title"
                                                      className="ss-select--full"
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_mode']}
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number2_fukushashiki_search_mode', value)}
                                                      data={[
                                                        { key: 1, value: 'id' },
                                                        { key: 2, value: 'css_selector' },
                                                        { key: 3, value: 'xpath' }
                                                      ]}
                                                      keyValue="key"
                                                      placeholder="複写先要素の取得方法をお選びください"
                                                    />
                                                  </div>
                                                </Tooltip>
                                                <Tooltip title={{
                                                  1: '複写先要素のIDを入力ください',
                                                  2: '複写先要素のcss_selectorを入力ください',
                                                  3: '複写先要素のxPathを入力ください',
                                                }[
                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_mode']
                                                ] || ''} placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                    <InputCustom
                                                      styleLabel={{ width: '100%' }}
                                                      className="ss-input--full"
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number2_fukushashiki_search_value', value)}
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_value']}
                                                      placeholder={{
                                                        1: '複写先要素のIDを入力ください',
                                                        2: '複写先要素のcss_selectorを入力ください',
                                                        3: '複写先要素のxPathを入力ください',
                                                      }[
                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number2_fukushashiki_search_value']
                                                      ] || ''}
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </div> </>}
                                          </div>
                                          <div className={isUseFukushashiki ? 'ss-card-payment-radio-setting__field-col--full' : 'ss-card-payment-radio-setting__field-col--half'}>
                                            <InputCustom
                                              className="ss-input--full"
                                              placeholder="プレースホルダ"
                                              value={cardPaymentRadioButton.card_number_placeholder3}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder3')}
                                            />
                                            {isUseFukushashiki && <>
                                              <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row--no-width">
                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                    <SelectCustom
                                                      id="title"
                                                      className="ss-select--full"
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_mode']}
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number3_fukushashiki_search_mode', value)}
                                                      data={[
                                                        { key: 1, value: 'id' },
                                                        { key: 2, value: 'css_selector' },
                                                        { key: 3, value: 'xpath' }
                                                      ]}
                                                      keyValue="key"
                                                      placeholder="複写先要素の取得方法をお選びください"
                                                    />
                                                  </div>
                                                </Tooltip>
                                                <Tooltip title={{
                                                  1: '複写先要素のIDを入力ください',
                                                  2: '複写先要素のcss_selectorを入力ください',
                                                  3: '複写先要素のxPathを入力ください',
                                                }[
                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_mode']
                                                ] || ''} placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                    <InputCustom
                                                      styleLabel={{ width: '100%' }}
                                                      className="ss-input--full"
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number3_fukushashiki_search_value', value)}
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_value']}
                                                      placeholder={{
                                                        1: '複写先要素のIDを入力ください',
                                                        2: '複写先要素のcss_selectorを入力ください',
                                                        3: '複写先要素のxPathを入力ください',
                                                      }[
                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number3_fukushashiki_search_value']
                                                      ] || ''}
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </div> </>}
                                          </div>
                                          <div className={isUseFukushashiki ? 'ss-card-payment-radio-setting__field-col--full' : 'ss-card-payment-radio-setting__field-col--half'}>
                                            <InputCustom
                                              className="ss-input--full"
                                              placeholder="プレースホルダ"
                                              value={cardPaymentRadioButton.card_number_placeholder4}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder4')}
                                            />
                                            {isUseFukushashiki && <>
                                              <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row--no-width">
                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                    <SelectCustom
                                                      id="title"
                                                      className="ss-select--full"
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_mode']}
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number4_fukushashiki_search_mode', value)}
                                                      data={[
                                                        { key: 1, value: 'id' },
                                                        { key: 2, value: 'css_selector' },
                                                        { key: 3, value: 'xpath' }
                                                      ]}
                                                      keyValue="key"
                                                      placeholder="複写先要素の取得方法をお選びください"
                                                    />
                                                  </div>
                                                </Tooltip>
                                                <Tooltip title={{
                                                  1: '複写先要素のIDを入力ください',
                                                  2: '複写先要素のcss_selectorを入力ください',
                                                  3: '複写先要素のxPathを入力ください',
                                                }[
                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_mode']
                                                ] || ''} placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                    <InputCustom
                                                      styleLabel={{ width: '100%' }}
                                                      className="ss-input--full"
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_number4_fukushashiki_search_value', value)}
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_value']}
                                                      placeholder={{
                                                        1: '複写先要素のIDを入力ください',
                                                        2: '複写先要素のcss_selectorを入力ください',
                                                        3: '複写先要素のxPathを入力ください',
                                                      }[
                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_number4_fukushashiki_search_value']
                                                      ] || ''}
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </div> </>}
                                          </div>
                                        </div>

                                      </div>
                                    }
                                    {cardPaymentRadioButton.separate_name === false ?
                                      <div className="ss-user-setting__item-bottom">
                                        <InputCustom
                                          styleLabel={{ width: '90%' }}
                                          label="カード名義"
                                          inline={false}
                                          placeholder="プレースホルダ"
                                          value={cardPaymentRadioButton.card_holder_placeholder}
                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder')}
                                        />
                                        {isUseFukushashiki &&
                                          <>
                                            <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row">
                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                  <SelectCustom
                                                    id="title"
                                                    className="ss-select--full"
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_mode']}
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder_fukushashiki_search_mode', value)}
                                                    data={[
                                                      { key: 1, value: 'id' },
                                                      { key: 2, value: 'css_selector' },
                                                      { key: 3, value: 'xpath' }
                                                    ]}
                                                    keyValue="key"
                                                    placeholder="複写先要素の取得方法をお選びください"
                                                  />
                                                </div>
                                              </Tooltip>
                                              <Tooltip title={{
                                                1: '複写先要素のIDを入力ください',
                                                2: '複写先要素のcss_selectorを入力ください',
                                                3: '複写先要素のxPathを入力ください',
                                              }[
                                                dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_mode']
                                              ] || ''} placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                  <InputCustom
                                                    styleLabel={{ width: '100%' }}
                                                    className="ss-input--full"
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder_fukushashiki_search_value', value)}
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_value']}
                                                    placeholder={{
                                                      1: '複写先要素のIDを入力ください',
                                                      2: '複写先要素のcss_selectorを入力ください',
                                                      3: '複写先要素のxPathを入力ください',
                                                    }[
                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder_fukushashiki_search_value']
                                                    ] || ''}
                                                  />
                                                </div>
                                              </Tooltip>
                                            </div>
                                          </>}
                                      </div> :
                                      <div className="ss-user-setting__item-bottom">
                                        <div className="ss-setting-width-90">カード名義</div>
                                        <div className="ss-setting-flex-center-gap ss-setting-width-90">
                                          <div className="ss-input--full">
                                            <InputCustom
                                              className="ss-card-payment-radio-setting__field-width-99"
                                              inline={false}
                                              placeholder="プレースホルダ"
                                              value={cardPaymentRadioButton.card_holder_placeholder1}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder1')}
                                            />
                                          </div>
                                          <div className="ss-input--full">
                                            <InputCustom
                                              className="ss-card-payment-radio-setting__field-width-99"
                                              inline={false}
                                              placeholder="プレースホルダ"
                                              value={cardPaymentRadioButton.card_holder_placeholder2}
                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder2')}
                                            />
                                          </div>
                                        </div>
                                        {isUseFukushashiki &&
                                          <>
                                            <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row">
                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                  <SelectCustom
                                                    id="title"
                                                    className="ss-select--full"
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_mode']}
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder1_fukushashiki_search_mode', value)}
                                                    data={[
                                                      { key: 1, value: 'id' },
                                                      { key: 2, value: 'css_selector' },
                                                      { key: 3, value: 'xpath' }
                                                    ]}
                                                    keyValue="key"
                                                    placeholder="複写先要素の取得方法をお選びください"
                                                  />
                                                </div>
                                              </Tooltip>
                                              <Tooltip title={{
                                                1: '複写先要素のIDを入力ください',
                                                2: '複写先要素のcss_selectorを入力ください',
                                                3: '複写先要素のxPathを入力ください',
                                              }[
                                                dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_mode']
                                              ] || ''} placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                  <InputCustom
                                                    styleLabel={{ width: '100%' }}
                                                    className="ss-input--full"
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder1_fukushashiki_search_value', value)}
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_value']}
                                                    placeholder={{
                                                      1: '複写先要素のIDを入力ください',
                                                      2: '複写先要素のcss_selectorを入力ください',
                                                      3: '複写先要素のxPathを入力ください',
                                                    }[
                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder1_fukushashiki_search_value']
                                                    ] || ''}
                                                  />
                                                </div>
                                              </Tooltip>
                                            </div>
                                          </>}
                                          {isUseFukushashiki &&
                                          <>
                                            <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row">
                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                  <SelectCustom
                                                    id="title"
                                                    className="ss-select--full"
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_mode']}
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder2_fukushashiki_search_mode', value)}
                                                    data={[
                                                      { key: 1, value: 'id' },
                                                      { key: 2, value: 'css_selector' },
                                                      { key: 3, value: 'xpath' }
                                                    ]}
                                                    keyValue="key"
                                                    placeholder="複写先要素の取得方法をお選びください"
                                                  />
                                                </div>
                                              </Tooltip>
                                              <Tooltip title={{
                                                1: '複写先要素のIDを入力ください',
                                                2: '複写先要素のcss_selectorを入力ください',
                                                3: '複写先要素のxPathを入力ください',
                                              }[
                                                dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_mode']
                                              ] || ''} placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                  <InputCustom
                                                    styleLabel={{ width: '100%' }}
                                                    className="ss-input--full"
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'card_holder2_fukushashiki_search_value', value)}
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_value']}
                                                    placeholder={{
                                                      1: '複写先要素のIDを入力ください',
                                                      2: '複写先要素のcss_selectorを入力ください',
                                                      3: '複写先要素のxPathを入力ください',
                                                    }[
                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['card_holder2_fukushashiki_search_value']
                                                    ] || ''}
                                                  />
                                                </div>
                                              </Tooltip>
                                            </div>
                                          </>}
                                      </div>
                                    }
                                    {Array.isArray(cardPaymentRadioButton.is_use_installment) && cardPaymentRadioButton.is_use_installment.includes(itemPaymentRadio.value) &&
                                      <div className="ss-user-setting__item-bottom">
                                        <SelectCustom
                                          styleLabel={{ width: '90%' }}
                                          label="お支払い回数"
                                          inline={false}
                                          placeholder="プレースホルダ"
                                          data={installmentOptions}
                                          value={cardPaymentRadioButton.installment_placeholder}
                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'installment_placeholder')}
                                        />
                                        {isUseFukushashiki &&
                                          <>
                                            <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row">
                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                  <SelectCustom
                                                    id="title"
                                                    className="ss-select--full"
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_mode']}
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'installment_fukushashiki_search_mode', value)}
                                                    data={[
                                                      { key: 1, value: 'id' },
                                                      { key: 2, value: 'css_selector' },
                                                      { key: 3, value: 'xpath' }
                                                    ]}
                                                    keyValue="key"
                                                    placeholder="複写先要素の取得方法をお選びください"
                                                  />
                                                </div>
                                              </Tooltip>
                                              <Tooltip title={{
                                                1: '複写先要素のIDを入力ください',
                                                2: '複写先要素のcss_selectorを入力ください',
                                                3: '複写先要素のxPathを入力ください',
                                              }[
                                                dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_mode']
                                              ] || ''} placement="top">
                                                <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                  <InputCustom
                                                    styleLabel={{ width: '100%' }}
                                                    className="ss-input--full"
                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'installment_fukushashiki_search_value', value)}
                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_value']}
                                                    placeholder={{
                                                      1: '複写先要素のIDを入力ください',
                                                      2: '複写先要素のcss_selectorを入力ください',
                                                      3: '複写先要素のxPathを入力ください',
                                                    }[
                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['installment_fukushashiki_search_value']
                                                    ] || ''}
                                                  />
                                                </div>
                                              </Tooltip>
                                            </div>
                                          </>}
                                      </div>
                                    }
                                    <div className="ss-user-setting__item-bottom">
                                      <div className="ss-setting-width-90">有効期限</div>
                                      <div className={`ss-card-payment-radio-setting__expiry-fields-row ${isUseFukushashiki ? 'ss-card-payment-radio-setting__expiry-fields-row--wrap' : 'ss-card-payment-radio-setting__expiry-fields-row--nowrap'}`}>
                                        <div className={isUseFukushashiki ? 'ss-card-payment-radio-setting__field-col--full' : 'ss-card-payment-radio-setting__field-col--47'}>
                                          <SelectCustom
                                            placeholder="年"
                                            className="ss-select--full"
                                            value={cardPaymentRadioButton.year_placeholder}
                                            data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'year_placeholder')}
                                          />
                                          {isUseFukushashiki &&
                                            <>
                                              <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row--no-width">
                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                    <SelectCustom
                                                      id="title"
                                                      className="ss-select--full"
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_mode']}
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'year_fukushashiki_search_mode', value)}
                                                      data={[
                                                        { key: 1, value: 'id' },
                                                        { key: 2, value: 'css_selector' },
                                                        { key: 3, value: 'xpath' }
                                                      ]}
                                                      keyValue="key"
                                                      placeholder="複写先要素の取得方法をお選びください"
                                                    />
                                                  </div>
                                                </Tooltip>
                                                <Tooltip title={{
                                                  1: '複写先要素のIDを入力ください',
                                                  2: '複写先要素のcss_selectorを入力ください',
                                                  3: '複写先要素のxPathを入力ください',
                                                }[
                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_mode']
                                                ] || ''} placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                    <InputCustom
                                                      styleLabel={{ width: '100%' }}
                                                      className="ss-input--full"
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'year_fukushashiki_search_value', value)}
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_value']}
                                                      placeholder={{
                                                        1: '複写先要素のIDを入力ください',
                                                        2: '複写先要素のcss_selectorを入力ください',
                                                        3: '複写先要素のxPathを入力ください',
                                                      }[
                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['year_fukushashiki_search_value']
                                                      ] || ''}
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </div>
                                            </>
                                          }
                                        </div>
                                        <div className={isUseFukushashiki ? 'ss-card-payment-radio-setting__field-col--full' : 'ss-card-payment-radio-setting__field-col--half'}>
                                          <SelectCustom
                                            placeholder="月"
                                            className="ss-select--full"
                                            value={cardPaymentRadioButton.month_placeholder}
                                            data={dataMonthFixed}
                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'month_placeholder')}
                                          />
                                          {isUseFukushashiki &&
                                            <>
                                              <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row--no-width">
                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                    <SelectCustom
                                                      id="title"
                                                      className="ss-select--full"
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_mode']}
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'month_fukushashiki_search_mode', value)}
                                                      data={[
                                                        { key: 1, value: 'id' },
                                                        { key: 2, value: 'css_selector' },
                                                        { key: 3, value: 'xpath' }
                                                      ]}
                                                      keyValue="key"
                                                      placeholder="複写先要素の取得方法をお選びください"
                                                    />
                                                  </div>
                                                </Tooltip>
                                                <Tooltip title={{
                                                  1: '複写先要素のIDを入力ください',
                                                  2: '複写先要素のcss_selectorを入力ください',
                                                  3: '複写先要素のxPathを入力ください',
                                                }[
                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_mode']
                                                ] || ''} placement="top">
                                                  <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                    <InputCustom
                                                      styleLabel={{ width: '100%' }}
                                                      className="ss-input--full"
                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'month_fukushashiki_search_value', value)}
                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_value']}
                                                      placeholder={{
                                                        1: '複写先要素のIDを入力ください',
                                                        2: '複写先要素のcss_selectorを入力ください',
                                                        3: '複写先要素のxPathを入力ください',
                                                      }[
                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['month_fukushashiki_search_value']
                                                      ] || ''}
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </div>
                                            </>
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ss-user-setting__item-bottom">

                                      <InputCustom
                                        styleLabel={{ width: '90%' }}
                                        label="CVC非表示"
                                        inline={false}
                                        placeholder="プレースホルダ"
                                        value={cardPaymentRadioButton.cvc_placeholder}
                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'cvc_placeholder')}
                                      />
                                      {isUseFukushashiki &&
                                        <>
                                          <div className="ss-user-setting__item-row ss-card-payment-radio-setting__fukushashiki-row">
                                            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                              <div className="ss-card-payment-radio-setting__fukushashiki-mode-col">
                                                <SelectCustom
                                                  id="title"
                                                  className="ss-select--full"
                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_mode']}
                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'cvc_fukushashiki_search_mode', value)}
                                                  data={[
                                                    { key: 1, value: 'id' },
                                                    { key: 2, value: 'css_selector' },
                                                    { key: 3, value: 'xpath' }
                                                  ]}
                                                  keyValue="key"
                                                  placeholder="複写先要素の取得方法をお選びください"
                                                />
                                              </div>
                                            </Tooltip>
                                            <Tooltip title={{
                                              1: '複写先要素のIDを入力ください',
                                              2: '複写先要素のcss_selectorを入力ください',
                                              3: '複写先要素のxPathを入力ください',
                                            }[
                                              dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_mode']
                                            ] || ''} placement="top">
                                              <div className="ss-card-payment-radio-setting__fukushashiki-value-col">
                                                <InputCustom
                                                  styleLabel={{ width: '100%' }}
                                                  className="ss-input--full"
                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'cvc_fukushashiki_search_value', value)}
                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_value']}
                                                  placeholder={{
                                                    1: '複写先要素のIDを入力ください',
                                                    2: '複写先要素のcss_selectorを入力ください',
                                                    3: '複写先要素のxPathを入力ください',
                                                  }[
                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['cvc_fukushashiki_search_value']
                                                  ] || ''}
                                                />
                                              </div>
                                            </Tooltip>
                                          </div>
                                        </>
                                      }
                                    </div>
                                  </>
                                )}
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
  );
};

export default DefaultTypeSetting;

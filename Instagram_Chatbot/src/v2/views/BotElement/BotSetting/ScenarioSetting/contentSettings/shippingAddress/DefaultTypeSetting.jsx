import React from 'react';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../../scenarioComon/SelectCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioComon/InputCustom';
import { Tooltip } from '@mui/material';
import { hyphenPhoneNumber } from '../../constants/scenarioFormConstants';
import {
  AddressFieldSettingsModal,
  AddressFieldsGroup,
} from '../shared/addressFields';
import { buildShippingAddressContext } from './shippingAddressContext';
import '../../styles/contentSettings/shippingAddress.css';

const DefaultTypeSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    isUseFukushashiki,
    handleDragEndRadioCheckbox,
    handleRemoveItemZipCodeAddress,
    dataInputVar,
  } = props;
  const { shippingAddress } = buildShippingAddressContext(props);

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
                            Array.isArray(shippingAddress.radio_contents) && shippingAddress.radio_contents
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
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <CheckboxCustom
                                                                label="初期選択設定"
                                                                value={shippingAddress.value_initial_selection === itemPaymentRadio.value}
                                                                onChange={() => {
                                                                    if (shippingAddress.value_initial_selection !== itemPaymentRadio.value) {
                                                                        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'value_initial_selection');
                                                                    } else {
                                                                        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'value_initial_selection');
                                                                    }
                                                                }}
                                                            />
                                                            <CheckboxCustom
                                                                label="配送先を入力する"
                                                                value={shippingAddress.card_linked_setting.includes(itemPaymentRadio.value)}
                                                                onChange={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPaymentRadio.value, 'card_linked_setting')}
                                                            />
                                                
                                                        </div>
                                                        {array.length > 1 &&
                                                            <div className="ss-user-setting-payment-radio-times-icons">
                                                                <MDBIcon fas icon="times-circle"
                                                                    onClick={() => {
                                                                        const arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                                                        const startArr = arrMessage.slice(0, indexPaymentRadio);
                                                                        const lastArr = arrMessage.slice(indexPaymentRadio + 1, arrMessage.length);
                                                                        dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents = [...startArr, ...lastArr];
                                                                        setDataMessages([...dataMessages]);
                                                                    }} />
                                                            </div>
                                                        }
                                                        {shippingAddress.card_linked_setting.includes(itemPaymentRadio.value) && (
                                                <React.Fragment>
                                                  <div className="ss-user-setting__item-bottom">
                                                    <div className="ss-shipping-address-setting__linked-divider"></div>
                                                  </div>
                                                  <div className="ss-user-setting__item-bottom">
                                                    <div className="ss-shipping-address-setting__linked-title">
                                                      <span>配送先住所</span>
                                                    </div>
                                                  </div>
                                                  <div className="ss-user-setting__item-text_input-top">
                                                    <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                      <CheckboxCustom
                                                        label="入力値の検証にAPIを利用する"
                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                        value={shippingAddress.use_api_input_value}
                                                      />
                                                    </div>
                                                    {shippingAddress.use_api_input_value &&
                                                      <div className="ss-user-setting__item-bottom">
                                                        <SelectCustom
                                                          className="ss-setting-width-90"
                                                          id="title"
                                                          value={shippingAddress?.use_api_input_value}
                                                          data={dataInputVar}
                                                          keyValue="variable_name"
                                                          nameValue="variable_name"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_api_input_value')}
                                                        />
                                                      </div>
                                                    }
                                                    <AddressFieldSettingsModal
                                                      {...props}
                                                      requireExtra={(
                                                        <CheckboxCustom
                                                          label="電話番号（ハイフン付き）"
                                                          value={shippingAddress.withHyphen}
                                                          data={hyphenPhoneNumber}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'withHyphen')}
                                                        />
                                                      )}
                                                    />
                                                  </div>

                                                  {/* shipping_address: name placename */}
                                                  {
                                                    <React.Fragment>
                                                      {shippingAddress.name !== undefined && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-shipping-address-setting__field-label">
                                                            お名前
                                                          </div>
                                                          <div className="ss-shipping-address-setting__field-input">
                                                            <InputDouble
                                                              width={'50%'}
                                                              //icon={shippingAddress.text?.isSplitInput ? "minus-circle" : "plus-circle"}
                                                              valueLeft={shippingAddress.shipping_address?.name_placeholderLeft}
                                                              valueRight={shippingAddress.shipping_address?.name_placeholderRight}
                                                              onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, name === 'left' ? 'name_placeholderLeft' : 'name_placeholderRight')}
                                                              onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !shippingAddress.type?.isSplitInput, shippingAddress.type, 'isSplitInput')}
                                                              placeholder={['プレースホルダ', 'プレースホルダ']}
                                                            />
                                                          </div>
                                                          <MDBIcon
                                                            className="ss-shipping-address-setting__icon-col ss-plus-circle-option-icon-times-custom"
                                                            // onClick={onClickIcon}
                                                            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'name')}
                                                            fas
                                                            icon="times-circle"
                                                          />
                                                        </div>
                                                      )}
                                                      {shippingAddress.name !== undefined && isUseFukushashiki && shippingAddress.type.isSplitInput && (
                                                        <>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-shipping-address-setting__spacer-col">

                                                            </div>
                                                            <div className="ss-shipping-address-setting__fukushashiki-col">
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div className="ss-fukushashiki-row__mode--30">
                                                                  <SelectCustom
                                                                    id="title"
                                                                    className="ss-select--full"
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_left_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_left_fukushashiki_search_mode', value)}
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
                                                              <div className="ss-fukushashiki-row__value--70">
                                                                <InputCustom
                                                                  styleLabel={{ width: '100%' }}
                                                                  maxLength={250}
                                                                  useFukushashiki={true}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_left_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_left_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_left_fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </div>
                                                            <div className="ss-icon-action">
                                                            </div>
                                                          </div>
                                                          <div className='ss-user-setting__item-bottom'>
                                                            <div className="ss-shipping-address-setting__spacer-col">
                                                            </div>
                                                            <div className="ss-shipping-address-setting__fukushashiki-col">
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div className="ss-fukushashiki-row__mode--30">
                                                                  <SelectCustom
                                                                    id="title"
                                                                    className="ss-select--full"
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_right_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_right_fukushashiki_search_mode', value)}
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
                                                              <div className="ss-fukushashiki-row__value--70">
                                                                <InputCustom
                                                                  styleLabel={{ width: '100%' }}
                                                                  maxLength={250}
                                                                  useFukushashiki={true}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'name_right_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_right_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['name_right_fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </div>
                                                            <div className="ss-icon-action">
                                                            </div>
                                                          </div>
                                                        </>
                                                      )}
                                                      
                                                    </React.Fragment>
                                                  }
                                                  {/* shipping_address: katakana name */}
                                                  {
                                                    <React.Fragment>
                                                      {shippingAddress.kana_name !== undefined && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-shipping-address-setting__field-label">
                                                            フリガナ
                                                          </div>
                                                          <div className="ss-shipping-address-setting__field-input">
                                                            <InputDouble
                                                              width={'50%'}
                                                              //icon={shippingAddress.text?.isSplitInput ? "minus-circle" : "plus-circle"}
                                                              valueLeft={shippingAddress.type?.kana_name_placeholderLeft}
                                                              valueRight={shippingAddress.type?.kana_name_placeholderRight}
                                                              onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, name === 'left' ? 'kana_name_placeholderLeft' : 'kana_name_placeholderRight')}
                                                              onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !shippingAddress.type?.isSplitInput, shippingAddress.type, 'isSplitInput')}
                                                              placeholder={['プレースホルダ', 'プレースホルダ']}
                                                            />
                                                          </div>
                                                          <MDBIcon
                                                            className="ss-shipping-address-setting__icon-col ss-plus-circle-option-icon-times-custom"
                                                            // onClick={onClickIcon}
                                                            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'kana_name')}
                                                            fas
                                                            icon="times-circle"
                                                          />
                                                        </div>
                                                      )}
                                                      {shippingAddress.kana_name !== undefined && isUseFukushashiki && shippingAddress.type.isSplitInput && (
                                                        <>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-shipping-address-setting__spacer-col">

                                                            </div>
                                                            <div className="ss-shipping-address-setting__fukushashiki-col">
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div className="ss-fukushashiki-row__mode--30">
                                                                  <SelectCustom
                                                                    id="title"
                                                                    className="ss-select--full"
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_left_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_left_fukushashiki_search_mode', value)}
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
                                                              <div className="ss-fukushashiki-row__value--70">
                                                                <InputCustom
                                                                  styleLabel={{ width: '100%' }}
                                                                  maxLength={250}
                                                                  useFukushashiki={true}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_left_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_left_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_left_fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </div>
                                                            <div className="ss-icon-action">
                                                            </div>
                                                          </div>
                                                          <div className='ss-user-setting__item-bottom'>
                                                            <div className="ss-shipping-address-setting__spacer-col">
                                                            </div>
                                                            <div className="ss-shipping-address-setting__fukushashiki-col">
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div className="ss-fukushashiki-row__mode--30">
                                                                  <SelectCustom
                                                                    id="title"
                                                                    className="ss-select--full"
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_right_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_right_fukushashiki_search_mode', value)}
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
                                                              <div className="ss-fukushashiki-row__value--70">
                                                                <InputCustom
                                                                  styleLabel={{ width: '100%' }}
                                                                  maxLength={250}
                                                                  useFukushashiki={true}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'kana_right_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_right_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['kana_right_fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </div>
                                                            <div className="ss-icon-action">
                                                            </div>
                                                          </div>
                                                        </>
                                                      )}

                                                    </React.Fragment>
                                                  }
                                                  <AddressFieldsGroup {...props} labelMode="static" />
                                                  {/* shipping_address: type = phone_number */}
                                                  {
                                                    <React.Fragment>
                                                      {/* phone_number: isWithHyphens = true */}
                                                      {shippingAddress.number !== undefined && shippingAddress?.withHyphen === true &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-shipping-address-setting__field-label">
                                                              電話番号
                                                            </div>
                                                            <div className="ss-user-setting__item-select-bottom-wrapper ss-user-setting-phone-number-hyphens ss-shipping-address-setting__field-input">
                                                              <InputCustom
                                                                placeholder="プレースホルダ"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number1_placeholder')}
                                                                value={shippingAddress.type?.number1_placeholder}
                                                              />
                                                              <span className="ss-shipping-address-setting__section-icon">-</span>
                                                              <InputCustom
                                                                placeholder="プレースホルダ"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number2_placeholder')}
                                                                value={shippingAddress.type?.number2_placeholder}
                                                              />
                                                              <span className="ss-shipping-address-setting__section-icon">-</span>
                                                              <InputCustom
                                                                placeholder="プレースホルダ"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number3_placeholder')}
                                                                value={shippingAddress.type?.number3_placeholder}
                                                              />
                                                            </div>
                                                            <MDBIcon
                                                              className="ss-shipping-address-setting__icon-col ss-plus-circle-option-icon-times-custom"
                                                              // onClick={onClickIcon}
                                                              onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'number')}
                                                              fas
                                                              icon="times-circle"
                                                            />
                                                            {isUseFukushashiki && (
                                                              <>
                                                                <div className="ss-user-setting__item-bottom ss-shipping-address-setting__mt-10">
                                                                  <div className="ss-shipping-address-setting__spacer-col">
                                                                  </div>
                                                                  <div className="ss-shipping-address-setting__fukushashiki-col">
                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                      <div className="ss-fukushashiki-row__mode--30">
                                                                        <SelectCustom
                                                                          id="title"
                                                                          className="ss-select--full"
                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number1_fukushashiki_search_mode']}
                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number1_fukushashiki_search_mode', value)}
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
                                                                    <div className="ss-fukushashiki-row__value--70">
                                                                      <InputCustom
                                                                        styleLabel={{ width: '100%' }}
                                                                        maxLength={250}
                                                                        useFukushashiki={true}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number1_fukushashiki_search_value', value)}
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number1_fukushashiki_search_value']}
                                                                        placeholder={{
                                                                          1: '複写先要素のIDを入力ください',
                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                          3: '複写先要素のxPathを入力ください',
                                                                        }[
                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number1_fukushashiki_search_mode']
                                                                        ] || ''}
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <div className="ss-icon-action">
                                                                  </div>
                                                                </div>
                                                                <div className='ss-user-setting__item-bottom'>
                                                                  <div className="ss-shipping-address-setting__spacer-col">
                                                                  </div>
                                                                  <div className="ss-shipping-address-setting__fukushashiki-col">
                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                      <div className="ss-fukushashiki-row__mode--30">
                                                                        <SelectCustom
                                                                          id="title"
                                                                          className="ss-select--full"
                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number2_fukushashiki_search_mode']}
                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number2_fukushashiki_search_mode', value)}
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
                                                                    <div className="ss-fukushashiki-row__value--70">
                                                                      <InputCustom
                                                                        styleLabel={{ width: '100%' }}
                                                                        maxLength={250}
                                                                        useFukushashiki={true}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number2_fukushashiki_search_value', value)}
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number2_fukushashiki_search_value']}
                                                                        placeholder={{
                                                                          1: '複写先要素のIDを入力ください',
                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                          3: '複写先要素のxPathを入力ください',
                                                                        }[
                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number2_fukushashiki_search_mode']
                                                                        ] || ''}
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <div className="ss-icon-action">
                                                                  </div>
                                                                </div>
                                                                <div className='ss-user-setting__item-bottom'>
                                                                  <div className="ss-shipping-address-setting__spacer-col">
                                                                  </div>
                                                                  <div className="ss-shipping-address-setting__fukushashiki-col">
                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                      <div className="ss-fukushashiki-row__mode--30">
                                                                        <SelectCustom
                                                                          id="title"
                                                                          className="ss-select--full"
                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number3_fukushashiki_search_mode']}
                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number3_fukushashiki_search_mode', value)}
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
                                                                    <div className="ss-fukushashiki-row__value--70">
                                                                      <InputCustom
                                                                        styleLabel={{ width: '100%' }}
                                                                        maxLength={250}
                                                                        useFukushashiki={true}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number3_fukushashiki_search_value', value)}
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number3_fukushashiki_search_value']}
                                                                        placeholder={{
                                                                          1: '複写先要素のIDを入力ください',
                                                                          2: '複写先要素のcss_selectorを入力ください',
                                                                          3: '複写先要素のxPathを入力ください',
                                                                        }[
                                                                          dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number3_fukushashiki_search_mode']
                                                                        ] || ''}
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <div className="ss-icon-action">
                                                                  </div>
                                                                </div>
                                                              </>
                                                            )}
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* phone_number: isWithHyphens = false */}
                                                      {shippingAddress.number !== undefined && shippingAddress?.withHyphen === false &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-shipping-address-setting__field-label">
                                                              電話番号
                                                            </div>
                                                            <div className="ss-shipping-address-setting__field-input--wide">
                                                              <InputCustom
                                                                className="ss-shipping-address-setting__file-input"
                                                                placeholder="プレースホルダ"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, shippingAddress.type, 'number_placeholder')}
                                                                value={shippingAddress.type?.number_placeholder}
                                                                onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'number')}
                                                                icon="times-circle"
                                                                classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                              />
                                                            </div>
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-shipping-address-setting__spacer-col">

                                                              </div>
                                                              <div className="ss-shipping-address-setting__fukushashiki-col">
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div className="ss-fukushashiki-row__mode--30">
                                                                    <SelectCustom
                                                                      id="title"
                                                                      className="ss-select--full"
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number_fukushashiki_search_mode', value)}
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
                                                                <div className="ss-fukushashiki-row__value--70">
                                                                  <InputCustom
                                                                    styleLabel={{ width: '100%' }}
                                                                    maxLength={250}
                                                                    useFukushashiki={true}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'number_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['number_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div className="ss-icon-action">
                                                              </div>
                                                            </div>
                                                          )}
                                                        </React.Fragment>
                                                      }
                                                    </React.Fragment>
                                                  }
                                                </React.Fragment>
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

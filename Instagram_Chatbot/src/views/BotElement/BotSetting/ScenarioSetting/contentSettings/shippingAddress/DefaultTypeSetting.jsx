import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../../scenarioComon/SelectCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputNum from '../../scenarioComon/InputNum';
import InputDouble from '../../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioComon/InputCustom';
import { Tooltip } from '@mui/material';
import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import { hyphenPhoneNumber } from '../../constants/scenarioFormConstants';
import {
  SHIPPING_ADDRESS_SETTING_LABELS,
  SETTING_BUTTON_LABELS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
  FUKUSHASHIKI_VARIANTS,
} from '../../constants/scenarioSettingLabels';
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
    handleChangeValueRequireZipCode,
    handleRemoveItemZipCodeAddress,
    dataInputVar,
    dataPrefectures,
    
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
                                                                        let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                                                        let startArr = arrMessage.slice(0, indexPaymentRadio);
                                                                        let lastArr = arrMessage.slice(indexPaymentRadio + 1, arrMessage.length);
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
                                                    <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                      <div>
                                                        <CheckboxCustom
                                                          label="必須"
                                                          onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, shippingAddress.isCheckRequire === 'require' ? '' : 'require', 'isCheckRequire')}
                                                          value={shippingAddress.isCheckRequire === 'require'}
                                                          isOnChange={false}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-text_input-use-api-required">
                                                        <CheckboxCustom
                                                          label="全項目必須"
                                                          onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, content.type, shippingAddress.isCheckRequire === 'all_items_require' ? '' : 'all_items_require', 'isCheckRequire')}
                                                          value={shippingAddress.isCheckRequire === 'all_items_require'}
                                                          isOnChange={false}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-text_input-use-api-required">
                                                        <CheckboxCustom
                                                          label="電話番号（ハイフン付き）"
                                                          value={shippingAddress.withHyphen}
                                                          data={hyphenPhoneNumber}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'withHyphen')}
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                      <CheckboxCustom
                                                        label="郵便番号を3桁+4桁に分割する"
                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'split_postal_code')}
                                                        value={shippingAddress.split_postal_code}
                                                      />
                                                    </div>
                                                    <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                      <CheckboxCustom
                                                        label="市区町村と番地を１フィールドで利用"
                                                        onChange={value => {
                                                          onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'compact_municipality_and_address')
                                                          if (value) {
                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, false, 'compact_municipality_and_address_and_building_name')
                                                          }
                                                        }}
                                                        value={shippingAddress.compact_municipality_and_address}
                                                      />
                                                    </div>
                                                    <div className="ss-user-setting__item-text_input-use-api-wrapper">
                                                      <CheckboxCustom
                                                        label="市区町村・番地・建物名を１フィールドで利用"
                                                        onChange={value => {
                                                          onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'compact_municipality_and_address_and_building_name')
                                                          if (value) {
                                                            onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, false, 'compact_municipality_and_address')
                                                          }
                                                        }}
                                                        value={shippingAddress.compact_municipality_and_address_and_building_name}
                                                      />
                                                    </div>
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
                                                            className="ss-shipping-address-setting__icon-col"
                                                            // onClick={onClickIcon}
                                                            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'name')}
                                                            fas
                                                            icon="times-circle"
                                                            className={"ss-plus-circle-option-icon-times-custom"}
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
                                                            className="ss-shipping-address-setting__icon-col"
                                                            // onClick={onClickIcon}
                                                            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'kana_name')}
                                                            fas
                                                            icon="times-circle"
                                                            className={"ss-plus-circle-option-icon-times-custom"}
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
                                                  {shippingAddress.post_code !== undefined && (
                                                    shippingAddress.split_postal_code === false ?
                                                      <>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            classLabel="ss-custom-label-zip-code"
                                                            label="郵便番号"
                                                            className={"ss-user-setting__item-input-zip-code"}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code')}
                                                            onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'post_code')}
                                                            value={shippingAddress.post_code}
                                                            icon="times-circle"
                                                            placeholder="000 000"
                                                            classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                          />

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
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_fukushashiki_search_mode', value)}
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
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </div>
                                                            <div className="ss-icon-action">
                                                            </div>
                                                          </div>
                                                        )}
                                                      </>
                                                      :
                                                      <>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            classLabel="ss-custom-label-zip-code"
                                                            label="郵便番号"
                                                            className={"ss-user-setting__item-input-zip-code"}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code_left')}
                                                            value={shippingAddress.post_code_left}
                                                            placeholder="000"
                                                            className="ss-shipping-address-setting__post-code-left"
                                                          />
                                                          <InputCustom
                                                            className={"ss-user-setting__item-input-zip-code"}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'post_code_right')}
                                                            value={shippingAddress.post_code_right}
                                                            placeholder="0000"
                                                            className="ss-shipping-address-setting__post-code-right"
                                                          />
                                                          <MDBIcon
                                                            className="ss-shipping-address-setting__icon-col"
                                                            // onClick={onClickIcon}
                                                            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'post_code')}
                                                            fas
                                                            icon="times-circle"
                                                            className={"ss-plus-circle-option-icon-times-custom"}
                                                          />
                                                        </div>
                                                        {isUseFukushashiki && (
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
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_left_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_left_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_left_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_left_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_left_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div className="ss-icon-action">
                                                              </div>
                                                            </div>
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-shipping-address-setting__spacer-col">

                                                              </div>
                                                              <div className="ss-shipping-address-setting__fukushashiki-col">
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div className="ss-fukushashiki-row__mode--30">
                                                                    <SelectCustom
                                                                      id="title"
                                                                      className="ss-select--full"
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_right_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_right_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'post_code_right_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_right_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['post_code_right_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div className="ss-icon-action">
                                                              </div>
                                                            </div>
                                                          </>

                                                        )}
                                                      </>
                                                  )}
                                                  {shippingAddress.prefecture !== undefined &&
                                                    <>
                                                      <div className="ss-user-setting__item-bottom ss-shipping-address-setting__file-row">
                                                        <span className="ss-shipping-address-setting__section-title ss-custom-label-zip-code">都道府県</span>
                                                        {shippingAddress.is_use_dropdown ?
                                                          <SelectCustom
                                                            className="ss-shipping-address-setting__field-input--40"
                                                            id="title"
                                                            value={shippingAddress?.prefecture}
                                                            data={dataPrefectures}
                                                            keyValue="name"
                                                            nameValue="name"
                                                            placeholder="プレースホルダ"
                                                            onChange={value => {
                                                              if (value) {
                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')
                                                              } else {
                                                                onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'prefecture')
                                                              }
                                                            }}
                                                          /> :
                                                          <InputCustom
                                                            className={"ss-user-setting__item-input-zip-code"}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')}
                                                            value={shippingAddress.prefecture}
                                                            placeholder={"プレースホルダ"}
                                                            className="ss-shipping-address-setting__field-input--40"
                                                          />
                                                          // <input
                                                          //   type="text"
                                                          //   name="ss-user-setting__item-text_input-use-api"
                                                          //   className="ss-input-value ss-user-setting-item ss-user-setting__item-input-zip-code"
                                                          //   placeholder={"プレースホルダ"}
                                                          //   value={zipCodeAddress.prefecture}
                                                          //   onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'prefecture')}
                                                          // />
                                                        }
                                                        <CheckboxCustom
                                                          label="プルダウンを利用"
                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_dropdown')}
                                                          value={shippingAddress.is_use_dropdown}
                                                        />
                                                        <MDBIcon
                                                          className="ss-shipping-address-setting__icon-col--offset"
                                                          // onClick={onClickIcon}
                                                          onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'prefecture')}
                                                          fas
                                                          icon="times-circle"
                                                          className={"ss-plus-circle-option-icon-times-custom"}
                                                        />
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
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['prefecture_fukushashiki_search_mode']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'prefecture_fukushashiki_search_mode', value)}
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
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'prefecture_fukushashiki_search_value', value)}
                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['prefecture_fukushashiki_search_value']}
                                                                placeholder={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['prefecture_fukushashiki_search_mode']
                                                                ] || ''}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="ss-icon-action">
                                                          </div>
                                                        </div>
                                                      )}
                                                    </>
                                                  }
                                                  {shippingAddress.municipality !== undefined &&
                                                    <div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          classLabel="ss-custom-label-zip-code"
                                                          label="市区町村"
                                                          className={"ss-user-setting__item-input-zip-code"}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'municipality')}
                                                          onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'municipality')}
                                                          value={shippingAddress.municipality}
                                                          icon="times-circle"
                                                          placeholder="プレースホルダ"
                                                          classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                        />
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
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['municipality_fukushashiki_search_mode']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'municipality_fukushashiki_search_mode', value)}
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
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'municipality_fukushashiki_search_value', value)}
                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['municipality_fukushashiki_search_value']}
                                                                placeholder={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['municipality_fukushashiki_search_mode']
                                                                ] || ''}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="ss-icon-action">
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  }
                                                  {shippingAddress.address !== undefined &&
                                                    <>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          classLabel="ss-custom-label-zip-code"
                                                          label="番地"
                                                          className={"ss-user-setting__item-input-zip-code"}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'address')}
                                                          onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'address')}
                                                          value={shippingAddress.address}
                                                          icon="times-circle"
                                                          placeholder="プレースホルダ"
                                                          classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                        />
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
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['address_fukushashiki_search_mode']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'address_fukushashiki_search_mode', value)}
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
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'address_fukushashiki_search_value', value)}
                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['address_fukushashiki_search_value']}
                                                                placeholder={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['address_fukushashiki_search_mode']
                                                                ] || ''}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="ss-icon-action">
                                                          </div>
                                                        </div>
                                                      )}
                                                    </>
                                                  }
                                                  {shippingAddress.building_name !== undefined &&
                                                    <>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <InputCustom
                                                          classLabel="ss-custom-label-zip-code"
                                                          label="建物名"
                                                          className={"ss-user-setting__item-input-zip-code"}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'building_name')}
                                                          value={shippingAddress.building_name}
                                                          icon="times-circle"
                                                          onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'building_name')}
                                                          placeholder="プレースホルダ"
                                                          classIcon={"ss-plus-circle-option-icon-times-custom"}
                                                        />
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
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['building_name_fukushashiki_search_mode']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'building_name_fukushashiki_search_mode', value)}
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
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'building_name_fukushashiki_search_value', value)}
                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['building_name_fukushashiki_search_value']}
                                                                placeholder={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['building_name_fukushashiki_search_mode']
                                                                ] || ''}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="ss-icon-action">
                                                          </div>
                                                        </div>
                                                      )}
                                                    </>
                                                  }
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
                                                              className="ss-shipping-address-setting__icon-col"
                                                              // onClick={onClickIcon}
                                                              onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, content.type, 'number')}
                                                              fas
                                                              icon="times-circle"
                                                              className={"ss-plus-circle-option-icon-times-custom"}
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

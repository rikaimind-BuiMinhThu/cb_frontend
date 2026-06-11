import React from 'react';
import { Button } from 'reactstrap';
import icon from '../../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import InputNum from '../scenarioComon/InputNum';
import InputDouble from '../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import moment from 'moment';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import CheckboxGroupCustom from '../scenarioComon/CheckboxGroupCustom';
import shopifIcon from '../../../../../assets/img/shopify-icon.png';
import locale from 'antd/es/date-picker/locale/ja_JP';
import ShopifyReferenceSelect from '../ShopifyReferenceSelect';
import { Tooltip } from '@mui/material';
import { MESSAGE_CONTENT_TYPES, LABELS, GENDER_DISPLAY_TYPES, CART_SYSTEM } from '../../PreviewComponent/Constants';
import HtmlCodeConfig from '../scenarioComon/HtmlCodeConfig';
import OptionGenderConfig from '../OptionGenderConfig';
import PaymentDisplayStyleSection from '../components/PaymentDisplayStyleSection';
import { PAYMENT_OPTION_IMAGE_FIELDS } from '../constants/paymentStyleConstants';
import DatePickerCustom from '../scenarioComon/DatePickerCustom';
import {
  dataPaymentMethod, dataHourFixed, dataMinutesFixed, dataEveryMinuteFixed,
  dataYearFixed, dataMonthFixed, dataDayFixed, dataMaxRangSlider,
  dataConsumeApiResponse, agreeTermType, dataTypeFile, dataSubCondition,
  installmentOptions, carouselType, typeCalendar, dropDownTitle,
  convertTextType, typeTextarea, typeRadio, rangeText, hyphenPhoneNumber,
  typeCheckbox, dataTypePullDown, dataSelectDateTime, dataConditionFixed,
} from '../constants/scenarioFormConstants';
import {
  DELIVERY_CUT_OFF_SELECT_NONE,
  getCalendarPreviewRelativeRangeLabel,
  isCalendarPreviewRelativeRangeEnabled,
  isCalendarPreviewDaysSplitEnabled,
  deliveryCutOffTimeSelectValue,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
  mergePreviewRelativeCalendar,
} from '../utils/scenarioCalendarUtils';
import { settingsCarousel } from '../components/scenarioCarouselSettings';
import { useScenarioContentSettingProps } from '../hooks/useScenarioContentSettingProps';

const { Option } = Select;

const CardPaymentRadioButtonSetting = ({ indexMessageSelect, indexContent, content }) => {
  const {
    dataMessages, setDataMessages, onChangeValueMessageContent, renderRootFaqOption,
    dataInputVar, setIsOpenAddVariable, isUseFukushashiki, handleDragEndRadioCheckbox,
    handleRemoveItemContent, handleAddItemRadioCheckbox, setIsOpenFileReference,
    setVarFileReference, setAcceptFile, handleDragEndPullDown, handleRemoveItemCustomizePullDown,
    handleAddItemCustomizePullDown, onChangeTimePullDown, dataHour, dataMinutes, dataEveryMinute,
    dataYear, dataMonth, dataDay, dataPrefectures, dataCity, renderLPIntegrationOptionSetting,
    renderDetailSettingPulldownFromJs, handleRemoveItemZipCodeAddress, renderAddressField,
    renderBuildingName, renderMunicipality, renderPostCode, renderZipCodeAddressTitle,
    renderPrefecture, renderPaymentMethodDescriptionInput, handleAddItemAgreeTerm,
    handleDragEndProduct, handleRemoveItemProductPullDown, handleAddItemProductPullDown,
    botUploadFile, carouselUploadFile, getBaseUrl, handleDownloadFile, isColor,
    listProductVariants, clientCartSystem, isShopifyPaymentScenario,
  } = useScenarioContentSettingProps(indexMessageSelect, indexContent, content);

  const cardPaymentRadioButton = content.card_payment_radio_button;

  return (
                                                    <>
                                                      <div className="ss-user-setting__item-text_input-top">
                                                        <CheckboxCustom
                                                          label="ログイン済み時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_logged_in}
                                                        />
                                                        <CheckboxCustom
                                                          label="エラー発生の時に表示しない"
                                                          onChange={(value) => {
                                                            dataMessages[indexMessageSelect].not_display_when_have_error = value;
                                                            setDataMessages([...dataMessages]);
                                                          }}
                                                          value={dataMessages[indexMessageSelect].not_display_when_have_error}
                                                        />
                                                        {renderRootFaqOption()}
                                                        <CheckboxCustom
                                                          label="入力された内容を変数に保存する。"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={cardPaymentRadioButton.is_save_input_content}
                                                        />
                                                        {cardPaymentRadioButton.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                value={cardPaymentRadioButton?.save_input_content}
                                                                data={dataInputVar}
                                                                keyValue="variable_name"
                                                                nameValue="variable_name"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                              />
                                                              <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                            </div>
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '95%' }}>
                                                            <span>カード決済連動設定</span>
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>
                                                            <CheckboxCustom
                                                              label="必須"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                              value={cardPaymentRadioButton.require}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                            <SelectCustom
                                                              style={{ width: '49%' }}
                                                              value={cardPaymentRadioButton.title_require}
                                                              data={dropDownTitle}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            />
                                                            <SelectCustom
                                                              id="type"
                                                              style={{ width: '49%' }}
                                                              value={cardPaymentRadioButton.type}
                                                              allowClear={false}
                                                              data={[
                                                                { key: 'default', value: 'デフォルト' },
                                                                { key: 'customized_style', value: 'カスタマイズスタイル（四角い枠）' },
                                                                { key: 'picture_radio', value: '画像ラジオ' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            />
                                                          </div>
                                                        </div>
                                                        <PaymentDisplayStyleSection
                                                          cardPaymentRadioButton={cardPaymentRadioButton}
                                                          onChange={(value, field) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field)}
                                                        />
                                                        {/* cardPaymentRadioButton: withTitle = true */}
                                                        {cardPaymentRadioButton?.title_require === true &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="タイトル"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                              value={cardPaymentRadioButton.title}
                                                            />
                                                          </div>
                                                        }
                                                        <div className="ss-user-setting__item-bottom" style={{ position: 'relative' }}>
                                                          {cardPaymentRadioButton.type !== "picture_radio" ?
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, 'radio_contents')}>
                                                              <Droppable droppableId='payment-radio'>
                                                                {(providedChild) => {
                                                                  return <div className="ss-user-setting-item-payment-radio-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                    {isUseFukushashiki && (
                                                                      <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                                                        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                          <div style={{ flexBasis: '23%', maxWidth: '23%' }}>
                                                                            <SelectCustom
                                                                              id="title"
                                                                              style={{ width: '100%' }}
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
                                                                        <div style={{ flexBasis: '75%', maxWidth: '75%' }}>
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
                                                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                      <InputDouble
                                                                                        placeholder={["テキスト", "値"]}
                                                                                        valueLeft={itemPaymentRadio.text}
                                                                                        valueRight={itemPaymentRadio.value}
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'radio_contents', indexPaymentRadio, name === 'left' ? 'text' : 'value')}
                                                                                      />
                                                                                    </div>
                                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '10px', paddingLeft: '28px' }}>
                                                                                      {PAYMENT_OPTION_IMAGE_FIELDS.map(({ key, label }) => (
                                                                                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                                          <span style={{ fontSize: '12px' }}>{label}</span>
                                                                                          {itemPaymentRadio[key] && (
                                                                                            <img src={itemPaymentRadio[key]} alt={label} style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #ddd' }} />
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
                                                                                          <div style={{ width: '95%', height: '1px', backgroundColor: 'black' }}></div>
                                                                                        </div>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <div style={{ width: '95%' }}>
                                                                                            <span>カード決済連動設定</span>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <div style={{ width: '90%', display: 'flex' }}>
                                                                                            <div style={{ width: '28%' }}>
                                                                                              <CheckboxCustom
                                                                                                label="CVC非表示"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_cvc')}
                                                                                                value={cardPaymentRadioButton.is_hide_cvc}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '36%' }}>
                                                                                              <CheckboxCustom
                                                                                                label="カード名非表示"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_hide_card_name')}
                                                                                                value={cardPaymentRadioButton.is_hide_card_name}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '28%' }}>
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
                                                                                          <div style={{ width: '90%', display: 'flex' }}>
                                                                                            <div style={{ width: '28%', display: 'flex', alignItems: 'center' }}>
                                                                                              <CheckboxCustom
                                                                                                label="セパレート式"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_type')}
                                                                                                value={cardPaymentRadioButton.separate_type}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '36%', display: 'flex', alignItems: 'center' }}>
                                                                                              <CheckboxCustom
                                                                                                label="有効性チェックをする"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'validity_check')}
                                                                                                value={cardPaymentRadioButton.validity_check}
                                                                                              />
                                                                                            </div>
                                                                                            <div style={{ width: '28%', display: 'flex', alignItems: 'center' }}>
                                                                                              <CheckboxCustom
                                                                                                label="姓と名を分けて入力する"
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'separate_name')}
                                                                                                value={cardPaymentRadioButton.separate_name}
                                                                                              />
                                                                                            </div>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div style={{ width: '30%', marginLeft: '31px', display: 'flex', justifyContent: 'space-between' }}>
                                                                                              <span style={{ paddingTop: '3px', fontWeight: '400' }}>有効期限</span>
                                                                                              <SelectCustom
                                                                                                style={{ width: '53%' }}
                                                                                                allowClear={false}
                                                                                                value={cardPaymentRadioButton.type_date_of_expiry}
                                                                                                data={[{ key: 'ym', value: 'YM' }, { key: 'my', value: 'MY' }]}
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type_date_of_expiry')}
                                                                                              />
                                                                                          </div>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <CheckboxGroupCustom
                                                                                            style={{ width: '90%' }}
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
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
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
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
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
                                                                                            <div style={{ width: '90%' }}>カード番号</div>
                                                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type" style={{ flexWrap: 'wrap', rowGap: '10px' }}>
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder1}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder1')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
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
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
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
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder2}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder2')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
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
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
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
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder3}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder3')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
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
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
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
                                                                                              <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '100%' }}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_number_placeholder4}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_number_placeholder4')}
                                                                                                />
                                                                                                {isUseFukushashiki && <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
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
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
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
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
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
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
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
                                                                                            <div style={{ width: '90%' }}>カード名義</div>
                                                                                            <div style={{ display: 'flex', width: '90%', gap: '10px' }}>
                                                                                              <div style={{ width: '100%' }}>
                                                                                                <InputCustom
                                                                                                  style={{width: '99%'}}
                                                                                                  inline={false}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_holder_placeholder1}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder1')}
                                                                                                />
                                                                                              </div>
                                                                                              <div style={{ width: '100%' }}>
                                                                                                <InputCustom
                                                                                                  style={{width: '99%'}}
                                                                                                  inline={false}
                                                                                                  placeholder="プレースホルダ"
                                                                                                  value={cardPaymentRadioButton.card_holder_placeholder2}
                                                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'card_holder_placeholder2')}
                                                                                                />
                                                                                              </div>
                                                                                            </div>
                                                                                            {isUseFukushashiki &&
                                                                                              <>
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
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
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
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
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
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
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
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
                                                                                                <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                    <div style={{ width: '20%' }}>
                                                                                                      <SelectCustom
                                                                                                        id="title"
                                                                                                        style={{ width: '100%' }}
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
                                                                                                    <div style={{ flex: '80%' }}>
                                                                                                      <InputCustom
                                                                                                        styleLabel={{ width: '100%' }}
                                                                                                        style={{ width: '100%' }}
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
                                                                                          <div style={{ width: '90%' }}>有効期限</div>
                                                                                          <div style={{ display: 'flex', width: '90%', gap: '15px', flexWrap: isUseFukushashiki ? 'wrap' : 'no-wrap' }}>
                                                                                            <div style={{ width: isUseFukushashiki ? '100%' : '47%' }}>
                                                                                              <SelectCustom
                                                                                                placeholder="年"
                                                                                                style={{ width: '100%' }}
                                                                                                value={cardPaymentRadioButton.year_placeholder}
                                                                                                data={dataYearFixed.filter(item => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'year_placeholder')}
                                                                                              />
                                                                                              {isUseFukushashiki &&
                                                                                                <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
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
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
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
                                                                                            <div style={{ width: isUseFukushashiki ? '100%' : '49%' }}>
                                                                                              <SelectCustom
                                                                                                placeholder="月"
                                                                                                style={{ width: '100%' }}
                                                                                                value={cardPaymentRadioButton.month_placeholder}
                                                                                                data={dataMonthFixed}
                                                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'month_placeholder')}
                                                                                              />
                                                                                              {isUseFukushashiki &&
                                                                                                <>
                                                                                                  <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                                                                    <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                      <div style={{ width: '20%' }}>
                                                                                                        <SelectCustom
                                                                                                          id="title"
                                                                                                          style={{ width: '100%' }}
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
                                                                                                      <div style={{ flex: '80%' }}>
                                                                                                        <InputCustom
                                                                                                          styleLabel={{ width: '100%' }}
                                                                                                          style={{ width: '100%' }}
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
                                                                                              <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '10px' }}>
                                                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                                                  <div style={{ width: '20%' }}>
                                                                                                    <SelectCustom
                                                                                                      id="title"
                                                                                                      style={{ width: '100%' }}
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
                                                                                                  <div style={{ flex: '80%' }}>
                                                                                                    <InputCustom
                                                                                                      styleLabel={{ width: '100%' }}
                                                                                                      style={{ width: '100%' }}
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
                                                            </DragDropContext> :
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
                                                                                    <div style={{ display: 'flex', marginBottom: '10px', backgroundColor: 'rgb(248, 249, 250)', position: 'relative' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px', display: 'flex', alignItems: 'center', marginRight: '5px', marginLeft: '10px' }} />
                                                                                      <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-img"
                                                                                      >
                                                                                        {itemPaymentRadioImg.contents.map((itemContentPayment, indexContentPayment, arrContent) => {
                                                                                          return <React.Fragment key={indexContentPayment}>
                                                                                            <div style={{ width: arrContent.length > 1 ? `${(100 / arrContent.length) - 1}%` : '100%', padding: '5px' }}>
                                                                                              <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                                                                <InputCustom
                                                                                                  style={{ width: '92%' }}
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
                                                                                                  style={{ marginLeft: '10px', backgroundColor: '#fff', borderRadius: '50%', padding: '6px' }}
                                                                                                />
                                                                                              </div>
                                                                                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
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
                                                                                      <div className="ss-user-setting-plus-minus-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <div>
                                                                                          {itemPaymentRadioImg.contents.length < 3 &&
                                                                                            <div style={{ color: '#327AED' }}
                                                                                              onClick={() => {
                                                                                                let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents];
                                                                                                let idMax;
                                                                                                if (arrMess.length !== 0) {
                                                                                                  idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                                                } else {
                                                                                                  idMax = 1;
                                                                                                }
                                                                                                dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img[indexPaymentRadioImg].contents.push({
                                                                                                  id: idMax
                                                                                                });
                                                                                                setDataMessages([...dataMessages]);
                                                                                              }}
                                                                                            >+</div>}
                                                                                          {itemPaymentRadioImg.contents.length > 1 &&
                                                                                            <div style={{ color: '#FA8464' }}
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
                                                                                              let arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img];
                                                                                              let startArr = arrMessage.slice(0, indexPaymentRadioImg);
                                                                                              let lastArr = arrMessage.slice(indexPaymentRadioImg + 1, arrMessage.length);
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
                                                          }
                                                        </div>
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '90%' }}>
                                                            <Button style={{ margin: '0px', padding: '9px 19px', backgroundColor: '#327AED' }}
                                                              onClick={() => {
                                                                if (cardPaymentRadioButton.type !== 'picture_radio') {
                                                                  let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents];
                                                                  let idMax;
                                                                  if (arrMess.length !== 0) {
                                                                    idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                  } else {
                                                                    idMax = 1;
                                                                  }
                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents.push({
                                                                    id: idMax
                                                                  });
                                                                  setDataMessages([...dataMessages]);
                                                                } else {
                                                                  let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img];
                                                                  let idMax;
                                                                  if (arrMess.length !== 0) {
                                                                    idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                  } else {
                                                                    idMax = 1;
                                                                  }
                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].radio_contents_img.push({
                                                                    id: idMax,
                                                                    contents: [
                                                                      { id: 1 }
                                                                    ]
                                                                  });
                                                                  setDataMessages([...dataMessages]);
                                                                }
                                                              }}
                                                            >追加</Button>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </>
  );
};

export default CardPaymentRadioButtonSetting;

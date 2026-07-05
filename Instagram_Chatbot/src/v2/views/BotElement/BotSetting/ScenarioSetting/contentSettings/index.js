import TextInputSetting from './TextInputSetting';
import TextareaSetting from './textarea/TextareaSetting';
import LabelSetting from './LabelSetting';
import PullDownSetting from './PullDownSetting';
import CheckboxSetting from './checkbox/CheckboxSetting';
import RadioButtonSetting from './radioButton';
import CalendarSetting from './CalendarSetting';
import CardPaymentRadioButtonSetting from './CardPaymentRadioButtonSetting';
import ShippingAddressSetting from './ShippingAddressSetting';
import CreditCardPaymentSetting from './CreditCardPaymentSetting';
import ProductPurchaseSetting from './ProductPurchaseSetting';
import ProductPurchaseRadioButtonSetting from './ProductPurchaseRadioButtonSetting';
import ProductPurchaseSelectOptionSetting from './ProductPurchaseSelectOptionSetting';
import SliderSetting from './SliderSetting';
import ZipCodeAddressSetting from './zipCodeAddress';
import AttachingFileSetting from './AttachingFileSetting';
import AgreeTermSetting from './agreeTerm/AgreeTermSetting';
import ImageSetting from './ImageSetting';
import CarouselSetting from './carousel/CarouselSetting';
import CaptureSetting from './CaptureSetting';
import SmsVerifySetting from './SmsVerifySetting';
import AfteePaymentModuleSetting from './AfteePaymentModuleSetting';
import ButtonSubmitSetting from './buttonSubmit/ButtonSubmitSetting';
import LabelNoTransitionSetting from './LabelNoTransitionSetting';
import { withContentSettingContext } from './withContentSettingContext';

export const CONTENT_SETTING_MAP = {
  text_input: withContentSettingContext(TextInputSetting),
  textarea: withContentSettingContext(TextareaSetting),
  label: withContentSettingContext(LabelSetting),
  pull_down: withContentSettingContext(PullDownSetting),
  checkbox: withContentSettingContext(CheckboxSetting),
  radio_button: withContentSettingContext(RadioButtonSetting),
  calendar: withContentSettingContext(CalendarSetting),
  card_payment_radio_button: withContentSettingContext(CardPaymentRadioButtonSetting),
  shipping_address: withContentSettingContext(ShippingAddressSetting),
  credit_card_payment: withContentSettingContext(CreditCardPaymentSetting),
  product_purchase: withContentSettingContext(ProductPurchaseSetting),
  product_purchase_radio_button: withContentSettingContext(ProductPurchaseRadioButtonSetting),
  product_purchase_select_option: withContentSettingContext(ProductPurchaseSelectOptionSetting),
  slider: withContentSettingContext(SliderSetting),
  zip_code_address: withContentSettingContext(ZipCodeAddressSetting),
  attaching_file: withContentSettingContext(AttachingFileSetting),
  agree_term: withContentSettingContext(AgreeTermSetting),
  image: withContentSettingContext(ImageSetting),
  carousel: withContentSettingContext(CarouselSetting),
  capture: withContentSettingContext(CaptureSetting),
  sms_verify: withContentSettingContext(SmsVerifySetting),
  AFTEE_payment_module: withContentSettingContext(AfteePaymentModuleSetting),
  button_submit: withContentSettingContext(ButtonSubmitSetting),
  label_no_transition: withContentSettingContext(LabelNoTransitionSetting),
};

export {
  TextInputSetting,
  TextareaSetting,
  LabelSetting,
  PullDownSetting,
  CheckboxSetting,
  RadioButtonSetting,
  AttachingFileSetting,
  AgreeTermSetting,
  ImageSetting,
  CarouselSetting,
  CaptureSetting,
  SmsVerifySetting,
  AfteePaymentModuleSetting,
  ButtonSubmitSetting,
  LabelNoTransitionSetting,
};

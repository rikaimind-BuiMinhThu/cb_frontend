import TextInputSetting from './TextInputSetting';
import TextareaSetting from './TextareaSetting';
import LabelSetting from './LabelSetting';
import PullDownSetting from './PullDownSetting';
import CheckboxSetting from './CheckboxSetting';
import RadioButtonSetting from './RadioButtonSetting';
import CalendarSetting from './CalendarSetting';
import CardPaymentRadioButtonSetting from './CardPaymentRadioButtonSetting';
import ShippingAddressSetting from './ShippingAddressSetting';
import CreditCardPaymentSetting from './CreditCardPaymentSetting';
import ProductPurchaseSetting from './ProductPurchaseSetting';
import ProductPurchaseRadioButtonSetting from './ProductPurchaseRadioButtonSetting';
import ProductPurchaseSelectOptionSetting from './ProductPurchaseSelectOptionSetting';
import SliderSetting from './SliderSetting';
import ZipCodeAddressContentSetting from './ZipCodeAddressContentSetting';
import { withContentSettingContext } from './withContentSettingContext';

export const CONTENT_SETTING_MAP = {
  text_input: withContentSettingContext(TextInputSetting),
  textarea: withContentSettingContext(TextareaSetting),
  label: withContentSettingContext(LabelSetting),
  pull_down: withContentSettingContext(PullDownSetting),
  checkbox: withContentSettingContext(CheckboxSetting),
  radio_button: withContentSettingContext(RadioButtonSetting),
  calendar: CalendarSetting,
  card_payment_radio_button: CardPaymentRadioButtonSetting,
  shipping_address: ShippingAddressSetting,
  credit_card_payment: CreditCardPaymentSetting,
  product_purchase: ProductPurchaseSetting,
  product_purchase_radio_button: ProductPurchaseRadioButtonSetting,
  product_purchase_select_option: ProductPurchaseSelectOptionSetting,
  slider: SliderSetting,
  zip_code_address: ZipCodeAddressContentSetting,
};

export {
  TextInputSetting,
  TextareaSetting,
  LabelSetting,
  PullDownSetting,
  CheckboxSetting,
  RadioButtonSetting,
};

import TextInputPreview from './TextInputPreview';
import TextareaPreview from './TextareaPreview';
import LabelPreview from './LabelPreview';
import PullDownPreview from './PullDownPreview';
import CheckboxPreview from './CheckboxPreview';
import RadioButtonPreview from './RadioButtonPreview';
import ImagePreview from './ImagePreview';
import CapturePreview from './CapturePreview';
import SmsVerifyPreview from './SmsVerifyPreview';
import AfteePaymentModulePreview from './AfteePaymentModulePreview';
import LabelNoTransitionPreview from './LabelNoTransitionPreview';
import ButtonSubmitPreview from './ButtonSubmitPreview';
import AttachingFilePreview from './AttachingFilePreview';
import ZipCodeAddressPreview from './ZipCodeAddressPreview';
import AgreeTermPreview from './AgreeTermPreview';
import SliderPreview from './SliderPreview';
import CarouselPreview from './CarouselPreview';
import CalendarPreview from './CalendarPreview';
import CreditCardPaymentPreview from './CreditCardPaymentPreview';
import ProductPurchaseRadioButtonPreview from './ProductPurchaseRadioButtonPreview';
import ProductPurchaseSelectOptionPreview from './ProductPurchaseSelectOptionPreview';
import ProductPurchasePreview from './ProductPurchasePreview';
import CardPaymentRadioButtonPreview from './CardPaymentRadioButtonPreview';
import ShippingAddressPreview from './ShippingAddressPreview';
import { withContentPreviewContext } from './withContentPreviewContext';

export const PREVIEW_MAP = {
  text_input: withContentPreviewContext(TextInputPreview),
  textarea: withContentPreviewContext(TextareaPreview),
  label: withContentPreviewContext(LabelPreview),
  pull_down: withContentPreviewContext(PullDownPreview),
  checkbox: withContentPreviewContext(CheckboxPreview),
  radio_button: withContentPreviewContext(RadioButtonPreview),
  image: withContentPreviewContext(ImagePreview),
  capture: withContentPreviewContext(CapturePreview),
  sms_verify: withContentPreviewContext(SmsVerifyPreview),
  AFTEE_payment_module: withContentPreviewContext(AfteePaymentModulePreview),
  label_no_transition: withContentPreviewContext(LabelNoTransitionPreview),
  button_submit: withContentPreviewContext(ButtonSubmitPreview),
  attaching_file: withContentPreviewContext(AttachingFilePreview),
  zip_code_address: withContentPreviewContext(ZipCodeAddressPreview),
  agree_term: withContentPreviewContext(AgreeTermPreview),
  slider: withContentPreviewContext(SliderPreview),
  carousel: withContentPreviewContext(CarouselPreview),
  calendar: withContentPreviewContext(CalendarPreview),
  credit_card_payment: withContentPreviewContext(CreditCardPaymentPreview),
  product_purchase_radio_button: withContentPreviewContext(ProductPurchaseRadioButtonPreview),
  product_purchase_select_option: withContentPreviewContext(ProductPurchaseSelectOptionPreview),
  product_purchase: withContentPreviewContext(ProductPurchasePreview),
  card_payment_radio_button: withContentPreviewContext(CardPaymentRadioButtonPreview),
  shipping_address: withContentPreviewContext(ShippingAddressPreview),
};

export {
  TextInputPreview,
  TextareaPreview,
  LabelPreview,
  PullDownPreview,
  CheckboxPreview,
  RadioButtonPreview,
  ImagePreview,
  CapturePreview,
  SmsVerifyPreview,
  AfteePaymentModulePreview,
  LabelNoTransitionPreview,
  ButtonSubmitPreview,
  AttachingFilePreview,
  ZipCodeAddressPreview,
  AgreeTermPreview,
  SliderPreview,
  CarouselPreview,
  CalendarPreview,
  CreditCardPaymentPreview,
  ProductPurchaseRadioButtonPreview,
  ProductPurchaseSelectOptionPreview,
  ProductPurchasePreview,
  CardPaymentRadioButtonPreview,
  ShippingAddressPreview,
};

import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import {
  EMPTY_INPUT_VALUE,
  MESSAGE_CONTENT_TYPES,
  REQUIRED_FIELD_LABEL,
} from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import SelectCustom from "v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/SelectCustom";

const PRODUCT_VARIANT_ID_KEY = "productVariantId";
const PRODUCT_TITLE_KEY = "title";
const THUMBNAIL_OPTION_TYPE = "text_with_thumbnail_image";

const ProductPurchaseSelectOption = ({ content, messageIndex, contentIndex, onChangeValue, errors }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_SELECT_OPTION) return null;

  const productPurchaseSelectOption = content.product_purchase_select_option;

  const renderTitle = () => {
    if (!productPurchaseSelectOption.title_require && !productPurchaseSelectOption.require) return null;

    const title = productPurchaseSelectOption.title_require && (
      <span className="ss-message__content--user-pull_down-title">{productPurchaseSelectOption.title}</span>
    );

    const requiredLabel = productPurchaseSelectOption.require === true && (
      <span className="ss-message__content--user-text-input-required">
        {REQUIRED_FIELD_LABEL}
      </span>
    );

    return (
      <div className="ss-message__content--user-pull_down-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const renderContent = () => {
    if (productPurchaseSelectOption.type !== THUMBNAIL_OPTION_TYPE) return null;

    return (
      <div className="ss-message__content--user-pull_down--customization">
        <div className="ss-message__content--user-pull_down-col col-12 p-0">
          <SelectCustom
            showSearch={false}
            data={productPurchaseSelectOption.products}
            className="w-100-percent"
            placeholder={productPurchaseSelectOption.display_unselected}
            keyValue={PRODUCT_VARIANT_ID_KEY}
            nameValue={PRODUCT_TITLE_KEY}
            onChange={(value) => onChangeValue(contentIndex, content.type, value, 'value')}
            value={productPurchaseSelectOption.value || EMPTY_INPUT_VALUE}
          />
        </div>
      </div>
    );
  };

  const renderErrorMessage = () => {
    if (!errors?.[`message${messageIndex}_content${contentIndex}_${content.type}`]) return null;

    return (
      <div className="validation-error-message">
        {errors?.[`message${messageIndex}_content${contentIndex}_${content.type}`]}
      </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderTitle()}
      <div className="ss-message__content--user-pull_down-wrapper">
        {renderContent()}
      </div>
      {renderErrorMessage()}
    </div>
  );
};

export default ProductPurchaseSelectOption;

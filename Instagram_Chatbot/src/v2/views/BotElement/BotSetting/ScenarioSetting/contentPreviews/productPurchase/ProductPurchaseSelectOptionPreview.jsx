import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import {
  CONTENT_SETTING_TYPES,
  PRODUCT_PURCHASE_TYPES,
} from '../../constants/contentTypeConstants';
import '../../styles/base/preview-common.css';

const PRODUCT_VARIANT_ID_KEY = 'productVariantId';
const TITLE_NAME_KEY = 'title';

const ProductPurchaseSelectOptionPreview = ({ content }) => {
  const productPurchaseSelectOption = content.product_purchase_select_option;
  if (
    content.type !== CONTENT_SETTING_TYPES.PRODUCT_PURCHASE_SELECT_OPTION
    || !productPurchaseSelectOption
  ) {
    return null;
  }

  const renderHeader = () => {
    if (!productPurchaseSelectOption.title_require && !productPurchaseSelectOption.require) {
      return null;
    }
    return (
      <div className="ss-message__content--user-pull_down-top ss-content-preview__header--no-mb">
        {productPurchaseSelectOption.title_require && (
          <span className="ss-message__content--user-pull_down-title">
            {productPurchaseSelectOption.title}
          </span>
        )}
        {productPurchaseSelectOption.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {PREVIEW_LABELS.requiredMark}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="ss-content-preview">
      {renderHeader()}
      <div className="ss-message__content--user-pull_down-wrapper">
        {productPurchaseSelectOption.type === PRODUCT_PURCHASE_TYPES.TEXT_WITH_THUMBNAIL_IMAGE && (
          <div className="ss-message__content--user-pull_down--customization">
            <div>
              <div className="ss-message__content--user-pull_down-col col-12 ss-content-preview__pull-down-col">
                <SelectCustom
                  data={productPurchaseSelectOption.products}
                  className="ss-input--full"
                  placeholder={productPurchaseSelectOption.display_unselected}
                  keyValue={PRODUCT_VARIANT_ID_KEY}
                  nameValue={TITLE_NAME_KEY}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPurchaseSelectOptionPreview;

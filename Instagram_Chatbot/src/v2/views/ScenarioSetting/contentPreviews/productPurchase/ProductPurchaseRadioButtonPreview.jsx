import React from 'react';
import { Radio } from 'antd';
import {
  PREVIEW_LABELS,
  PRODUCT_PURCHASE_SETTING_LABELS,
} from '../../constants/scenarioSettingLabels';
import {
  CONTENT_SETTING_TYPES,
  PRODUCT_PURCHASE_TYPES,
} from '../../constants/contentTypeConstants';
import '../../styles/base/preview-common.css';

const formatItemNumber = (itemNumber) => (
  `${PRODUCT_PURCHASE_SETTING_LABELS.itemNumber}: ${itemNumber}`
);

const formatPrice = (price) => (
  `${PRODUCT_PURCHASE_SETTING_LABELS.price}: ${price} ${PREVIEW_LABELS.yen}`
);

const renderHeader = (productPurchaseRadioButton) => {
  if (!productPurchaseRadioButton.title_require && !productPurchaseRadioButton.require) {
    return null;
  }
  return (
    <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
      {productPurchaseRadioButton.title_require && (
        <span className="ss-message__content--user-checkbox-title">
          {productPurchaseRadioButton.title}
        </span>
      )}
      {productPurchaseRadioButton.require === true && (
        <span className="ss-message__content--user-text-input-required">
          {PREVIEW_LABELS.requiredMark}
        </span>
      )}
    </div>
  );
};

const renderThumbnailInfo = (productPurchaseRadioButton, itemProduct) => {
  const showInfo = (
    productPurchaseRadioButton.product_name_display
    || productPurchaseRadioButton.price_display
    || productPurchaseRadioButton.product_number_display
  );
  if (!showInfo) return null;
  return (
    <div className="ss-user-overview-product-purchase-infor">
      {productPurchaseRadioButton.product_name_display && itemProduct.title && (
        <div className="ss-user-overview-product-purchase-infor-title">
          {itemProduct.title}
        </div>
      )}
      {productPurchaseRadioButton.product_number_display && itemProduct.item_number && (
        <div className="ss-user-overview-product-purchase-infor-item-number">
          {formatItemNumber(itemProduct.item_number)}
        </div>
      )}
      {itemProduct.price_display_custom ? (
        <div className="ss-user-overview-product-purchase-infor-price">
          {itemProduct.price_display_custom}
        </div>
      ) : (
        productPurchaseRadioButton.price_display && itemProduct.item_price && (
          <div className="ss-user-overview-product-purchase-infor-price">
            {formatPrice(itemProduct.item_price)}
          </div>
        )
      )}
    </div>
  );
};

const renderTextImageInfo = (productPurchaseRadioButton, itemProduct) => {
  const showInfo = (
    productPurchaseRadioButton.product_name_display
    || productPurchaseRadioButton.price_display
    || productPurchaseRadioButton.product_number_display
  );
  if (!showInfo) return null;
  const titleText = productPurchaseRadioButton.product_name_display && itemProduct.title
    ? itemProduct.title
    : null;
  const numberText = productPurchaseRadioButton.product_number_display && itemProduct.item_number
    ? itemProduct.item_number
    : null;
  const priceText = itemProduct.price_display_custom
    ? itemProduct.price_display_custom
    : (productPurchaseRadioButton.price_display && itemProduct.item_price
      ? `${itemProduct.item_price} ${PREVIEW_LABELS.yen}`
      : null);
  return (
    <div className="ss-user-overview-product-purchase-infor-type-text_image">
      {titleText} {numberText} {priceText}
    </div>
  );
};

const ProductPurchaseRadioButtonPreview = ({ content }) => {
  const productPurchaseRadioButton = content.product_purchase_radio_button;
  if (
    content.type !== CONTENT_SETTING_TYPES.PRODUCT_PURCHASE_RADIO_BUTTON
    || !productPurchaseRadioButton
  ) {
    return null;
  }

  return (
    <div className="ss-content-preview">
      {renderHeader(productPurchaseRadioButton)}
      <div>
        {productPurchaseRadioButton.type === PRODUCT_PURCHASE_TYPES.TEXT_WITH_THUMBNAIL_IMAGE && (
          <Radio.Group
            className="ss-user-overview-product-purchase-radio-group ss-user-overview-product-purchase-style-width ss-content-preview__group--full"
          >
            {productPurchaseRadioButton.products.map((itemProduct, indexProduct) => (
              <Radio value={itemProduct.id} key={indexProduct}>
                <div className="ss-user-overview-product-purchase-container">
                  <div className="ss-user-overview-product-purchase-img">
                    <img src={itemProduct.img_url} alt={itemProduct.title} />
                  </div>
                  {renderThumbnailInfo(productPurchaseRadioButton, itemProduct)}
                </div>
              </Radio>
            ))}
          </Radio.Group>
        )}
        {productPurchaseRadioButton.type === PRODUCT_PURCHASE_TYPES.TEXT_WITH_IMAGE && (
          <Radio.Group
            className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width ss-content-preview__group--full"
          >
            {productPurchaseRadioButton.products && productPurchaseRadioButton.products.map((itemProduct, indexProduct) => (
              <Radio value={itemProduct.id} key={indexProduct}>
                <div className="ss-user-overview-product-purchase-container-type-text_image">
                  <div className="ss-user-overview-product-purchase-img-type-text_image">
                    <img src={itemProduct.img_url} alt={itemProduct.title} />
                  </div>
                  {renderTextImageInfo(productPurchaseRadioButton, itemProduct)}
                </div>
              </Radio>
            ))}
          </Radio.Group>
        )}
      </div>
    </div>
  );
};

export default ProductPurchaseRadioButtonPreview;

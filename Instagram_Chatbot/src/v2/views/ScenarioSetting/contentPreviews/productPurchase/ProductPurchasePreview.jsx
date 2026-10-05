import React from 'react';
import { Radio, Checkbox } from 'antd';
import {
  PREVIEW_LABELS,
  PRODUCT_PURCHASE_SETTING_LABELS,
} from '../../constants/scenarioSettingLabels';
import {
  CONTENT_SETTING_TYPES,
  PRODUCT_PURCHASE_TYPES,
} from '../../constants/contentTypeConstants';
import '../../styles/contentPreviews/productPurchase.css';
import '../../styles/base/preview-common.css';

const formatItemNumber = (itemNumber) => (
  `${PRODUCT_PURCHASE_SETTING_LABELS.itemNumber}: ${itemNumber}`
);

const formatPrice = (price) => (
  `${PRODUCT_PURCHASE_SETTING_LABELS.price}: ${price} ${PREVIEW_LABELS.yen}`
);

const formatQuantityLimit = (limit) => (
  `${PRODUCT_PURCHASE_SETTING_LABELS.quantityMaxPrefix}${limit}${PRODUCT_PURCHASE_SETTING_LABELS.quantityMaxSuffix}`
);

const renderHeader = (productPurchase) => {
  if (!productPurchase.title_require && !productPurchase.require) return null;
  return (
    <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
      {productPurchase.title_require && (
        <span className="ss-message__content--user-checkbox-title">
          {productPurchase.title}
        </span>
      )}
      {productPurchase.require === true && (
        <span className="ss-message__content--user-text-input-required">
          {PREVIEW_LABELS.requiredMark}
        </span>
      )}
    </div>
  );
};

const renderThumbnailInfo = (productPurchase, itemProduct) => {
  const showInfo = (
    productPurchase.product_name_display
    || productPurchase.price_display
    || productPurchase.product_number_display
  );
  if (!showInfo) return null;
  const showQuantity = (
    (productPurchase.quantity_designation_all || itemProduct.is_quantity_designation)
    && itemProduct.quantity_limit
  );
  return (
    <div className="ss-user-overview-product-purchase-infor">
      {productPurchase.product_name_display && itemProduct.title && (
        <div className="ss-user-overview-product-purchase-infor-title">
          {itemProduct.title}
        </div>
      )}
      {productPurchase.product_number_display && itemProduct.item_number && (
        <div className="ss-user-overview-product-purchase-infor-item-number">
          {formatItemNumber(itemProduct.item_number)}
        </div>
      )}
      {itemProduct.price_display_custom ? (
        <div className="ss-user-overview-product-purchase-infor-price">
          {itemProduct.price_display_custom}
        </div>
      ) : (
        productPurchase.price_display && itemProduct.item_price && (
          <div className="ss-user-overview-product-purchase-infor-price">
            {formatPrice(itemProduct.item_price)}
          </div>
        )
      )}
      {showQuantity && (
        <div className="ss-user-overview-product-purchase-infor-price">
          {formatQuantityLimit(itemProduct.quantity_limit)}
        </div>
      )}
    </div>
  );
};

const renderTextImageInfo = (productPurchase, itemProduct) => {
  const showInfo = (
    productPurchase.product_name_display
    || productPurchase.price_display
    || productPurchase.product_number_display
  );
  const showQuantity = (
    (productPurchase.quantity_designation_all || itemProduct.is_quantity_designation)
    && itemProduct.quantity_limit
  );
  const titleText = productPurchase.product_name_display && itemProduct.title
    ? itemProduct.title
    : null;
  const numberText = productPurchase.product_number_display && itemProduct.item_number
    ? itemProduct.item_number
    : null;
  const priceText = itemProduct.price_display_custom
    ? itemProduct.price_display_custom
    : (productPurchase.price_display && itemProduct.item_price
      ? `${itemProduct.item_price} ${PREVIEW_LABELS.yen}`
      : null);
  return (
    <>
      {showInfo && (
        <div className="ss-user-overview-product-purchase-infor-type-text_image">
          {titleText} {numberText} {priceText}
        </div>
      )}
      {showQuantity && (
        <div className="ss-user-overview-product-purchase-infor-type-text_image">
          {formatQuantityLimit(itemProduct.quantity_limit)}
        </div>
      )}
    </>
  );
};

const renderThumbnailItem = (productPurchase, itemProduct, indexProduct, OptionComponent) => (
  <OptionComponent key={indexProduct} value={itemProduct.id}>
    <div className="ss-user-overview-product-purchase-container">
      <div className="ss-user-overview-product-purchase-img">
        <img src={itemProduct.img_url} alt={itemProduct.title} />
      </div>
      {renderThumbnailInfo(productPurchase, itemProduct)}
    </div>
  </OptionComponent>
);

const renderTextImageItem = (productPurchase, itemProduct, indexProduct, OptionComponent) => (
  <OptionComponent key={indexProduct} value={itemProduct.id}>
    <div className="ss-user-overview-product-purchase-container-type-text_image">
      <div className="ss-user-overview-product-purchase-img-type-text_image">
        <img src={itemProduct.img_url} alt={itemProduct.title} />
      </div>
      {renderTextImageInfo(productPurchase, itemProduct)}
    </div>
  </OptionComponent>
);

const renderThumbnailGroup = (productPurchase) => {
  if (productPurchase.multiple_item_purchase) {
    return (
      <Checkbox.Group
        className="ss-user-overview-product-purchase-checkbox-group ss-user-overview-product-purchase-style-width ss-content-preview__group--full"
        value={productPurchase.initial_selection}
      >
        {productPurchase.products.map((itemProduct, indexProduct) => (
          renderThumbnailItem(productPurchase, itemProduct, indexProduct, Checkbox)
        ))}
      </Checkbox.Group>
    );
  }
  return (
    <Radio.Group
      className="ss-user-overview-product-purchase-radio-group ss-user-overview-product-purchase-style-width ss-content-preview__group--full"
      value={productPurchase.initial_selection[0]}
    >
      {productPurchase.products.map((itemProduct, indexProduct) => (
        renderThumbnailItem(productPurchase, itemProduct, indexProduct, Radio)
      ))}
    </Radio.Group>
  );
};

const renderTextImageGroup = (productPurchase) => {
  if (productPurchase.multiple_item_purchase) {
    return (
      <Checkbox.Group
        className="ss-user-overview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width ss-content-preview__group--full"
        value={productPurchase.initial_selection}
      >
        {productPurchase.products.map((itemProduct, indexProduct) => (
          renderTextImageItem(productPurchase, itemProduct, indexProduct, Checkbox)
        ))}
      </Checkbox.Group>
    );
  }
  return (
    <Radio.Group
      className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width ss-content-preview__group--full"
      value={productPurchase.initial_selection[0]}
    >
      {productPurchase.products.map((itemProduct, indexProduct) => (
        renderTextImageItem(productPurchase, itemProduct, indexProduct, Radio)
      ))}
    </Radio.Group>
  );
};

const ProductPurchasePreview = ({ content }) => {
  const productPurchase = content.product_purchase;
  if (content.type !== CONTENT_SETTING_TYPES.PRODUCT_PURCHASE || !productPurchase) return null;

  return (
    <div className="ss-content-preview">
      {renderHeader(productPurchase)}
      <div>
        {productPurchase.type === PRODUCT_PURCHASE_TYPES.TEXT_WITH_THUMBNAIL_IMAGE && (
          renderThumbnailGroup(productPurchase)
        )}
        {productPurchase.type === PRODUCT_PURCHASE_TYPES.TEXT_WITH_IMAGE && (
          renderTextImageGroup(productPurchase)
        )}
      </div>
    </div>
  );
};

export default ProductPurchasePreview;

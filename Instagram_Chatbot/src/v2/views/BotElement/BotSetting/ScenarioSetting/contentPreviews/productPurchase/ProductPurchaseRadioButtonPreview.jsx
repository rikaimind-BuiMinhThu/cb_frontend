import '../../styles/base/preview-common.css';
import React from 'react';
import { Radio } from 'antd';

const ProductPurchaseRadioButtonPreview = ({
  content,
  message,
  indexContent,
}) => {
  const productPurchaseRadioButton = content.product_purchase_radio_button;
  return (
    <>
      {
        content.type === 'product_purchase_radio_button' && (
          <div className="ss-content-preview">
            {(productPurchaseRadioButton.title_require || productPurchaseRadioButton.require) &&
              <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
                {productPurchaseRadioButton.title_require &&
                  <span className="ss-message__content--user-checkbox-title">
                    {productPurchaseRadioButton.title}
                  </span>
                }
                {productPurchaseRadioButton.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            <div>
              {productPurchaseRadioButton.type === 'text_with_thumbnail_image' && (
                <React.Fragment>
                  <Radio.Group
                    className="ss-user-overview-product-purchase-radio-group ss-user-overview-product-purchase-style-width ss-content-preview__group--full"

                    onChange={(value) => console.log(value)}
                  >
                    {productPurchaseRadioButton.products.map((itemProduct, indexProduct) => {
                      return <Radio value={itemProduct.id} key={indexProduct}>
                        <div className="ss-user-overview-product-purchase-container">
                          <div className="ss-user-overview-product-purchase-img">
                            <img src={itemProduct.img_url} alt={itemProduct.title || ""} />
                          </div>
                          {(productPurchaseRadioButton.product_name_display || productPurchaseRadioButton.price_display || productPurchaseRadioButton.product_number_display) &&
                            <div className="ss-user-overview-product-purchase-infor">
                              {productPurchaseRadioButton.product_name_display && itemProduct.title &&
                                <div className="ss-user-overview-product-purchase-infor-title">
                                  {itemProduct.title}
                                </div>
                              }
                              {productPurchaseRadioButton.product_number_display && itemProduct.item_number &&
                                <div className="ss-user-overview-product-purchase-infor-item-number">
                                  商品番号: {itemProduct.item_number}
                                </div>
                              }
                              {itemProduct.price_display_custom ?
                                <div className="ss-user-overview-product-purchase-infor-price">
                                  {itemProduct.price_display_custom}
                                </div> :
                                productPurchaseRadioButton.price_display && itemProduct.item_price &&
                                <div className="ss-user-overview-product-purchase-infor-price">
                                  値段: {itemProduct.item_price} 円
                                </div>
                              }
                            </div>
                          }
                        </div>
                      </Radio>
                    })}
                  </Radio.Group>
                </React.Fragment>
              )}
              {productPurchaseRadioButton.type === 'text_with_image' && (
                <React.Fragment>
                  <Radio.Group
                    className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width ss-content-preview__group--full"

                    onChange={(value) => console.log(value)}
                  >
                    {productPurchaseRadioButton.products && productPurchaseRadioButton.products.map((itemProduct, indexProduct) => {
                      return <Radio value={itemProduct.id} key={indexProduct}>
                        <div className="ss-user-overview-product-purchase-container-type-text_image">
                          <div className="ss-user-overview-product-purchase-img-type-text_image">
                            <img src={itemProduct.img_url} alt={itemProduct.title || ""} />
                          </div>
                          {(productPurchaseRadioButton.product_name_display || productPurchaseRadioButton.price_display || productPurchaseRadioButton.product_number_display) &&
                            <div className="ss-user-overview-product-purchase-infor-type-text_image">
                              {productPurchaseRadioButton.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchaseRadioButton.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {itemProduct.price_display_custom ? itemProduct.price_display_custom : (productPurchaseRadioButton.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : "")}
                            </div>
                          }
                        </div>
                      </Radio>
                    })}
                  </Radio.Group>
                </React.Fragment>
              )}
              {productPurchaseRadioButton.type === 'consume_api_response' && (
                <>
                </>
              )}
            </div>
          </div>
        )
      }
    </>
  );
};

export default ProductPurchaseRadioButtonPreview;

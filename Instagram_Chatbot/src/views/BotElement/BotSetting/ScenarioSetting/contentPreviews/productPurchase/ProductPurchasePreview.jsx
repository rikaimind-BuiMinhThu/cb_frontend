import '../../styles/contentPreviews/productPurchase.css';
import '../../styles/base/preview-common.css';
import React from 'react';
import { Radio, Checkbox } from 'antd';

const ProductPurchasePreview = ({
  content,
  message,
  indexContent,
}) => {
  const productPurchase = content.product_purchase;
  return (
    <>
      {
        content.type === 'product_purchase' && (
          <div className="ss-content-preview">
            {(productPurchase.title_require || productPurchase.require) &&
              <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
                {productPurchase.title_require &&
                  <span className="ss-message__content--user-checkbox-title">
                    {productPurchase.title}
                  </span>
                }
                {productPurchase.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            <div>
              {productPurchase.type === 'text_with_thumbnail_image' && (
                productPurchase.multiple_item_purchase ? (
                  <React.Fragment>
                    <Checkbox.Group
                      className="ss-user-overview-product-purchase-checkbox-group ss-user-overview-product-purchase-style-width ss-content-preview__group--full"

                      onChange={(value) => console.log(value)}
                      value={productPurchase.initial_selection}
                    >
                      {productPurchase.products.map((itemProduct, indexProduct) => {
                        return <Checkbox key={indexProduct} value={itemProduct.id}>
                          <div className="ss-user-overview-product-purchase-container">
                            <div className="ss-user-overview-product-purchase-img">
                              <img src={itemProduct.img_url} />
                            </div>
                            {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                              <div className="ss-user-overview-product-purchase-infor">
                                {productPurchase.product_name_display && itemProduct.title &&
                                  <div className="ss-user-overview-product-purchase-infor-title">
                                    {itemProduct.title}
                                  </div>
                                }
                                {productPurchase.product_number_display && itemProduct.item_number &&
                                  <div className="ss-user-overview-product-purchase-infor-item-number">
                                    商品番号: {itemProduct.item_number}
                                  </div>
                                }
                                {itemProduct.price_display_custom ?
                                  <div className="ss-user-overview-product-purchase-infor-price">
                                    {itemProduct.price_display_custom}
                                  </div> :
                                  productPurchase.price_display && itemProduct.item_price &&
                                  <div className="ss-user-overview-product-purchase-infor-price">
                                    値段: {itemProduct.item_price} 円
                                  </div>
                                }
                                {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                                  <div className="ss-user-overview-product-purchase-infor-price">
                                    数量：最大{itemProduct.quantity_limit}個まで
                                  </div> :
                                  ""
                                }
                              </div>
                            }
                          </div>
                        </Checkbox>
                      })}
                    </Checkbox.Group>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Radio.Group
                      className="ss-user-overview-product-purchase-radio-group ss-user-overview-product-purchase-style-width ss-content-preview__group--full"

                      onChange={(value) => console.log(value)}
                      value={productPurchase.initial_selection[0]}
                    >
                      {productPurchase.products.map((itemProduct, indexProduct) => {
                        return <Radio value={itemProduct.id} key={indexProduct}>
                          <div className="ss-user-overview-product-purchase-container">
                            <div className="ss-user-overview-product-purchase-img">
                              <img src={itemProduct.img_url} />
                            </div>
                            {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                              <div className="ss-user-overview-product-purchase-infor">
                                {productPurchase.product_name_display && itemProduct.title &&
                                  <div className="ss-user-overview-product-purchase-infor-title">
                                    {itemProduct.title}
                                  </div>
                                }
                                {productPurchase.product_number_display && itemProduct.item_number &&
                                  <div className="ss-user-overview-product-purchase-infor-item-number">
                                    商品番号: {itemProduct.item_number}
                                  </div>
                                }
                                {itemProduct.price_display_custom ?
                                  <div className="ss-user-overview-product-purchase-infor-price">
                                    {itemProduct.price_display_custom}
                                  </div> :
                                  productPurchase.price_display && itemProduct.item_price &&
                                  <div className="ss-user-overview-product-purchase-infor-price">
                                    値段: {itemProduct.item_price} 円
                                  </div>
                                }
                                {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                                  <div className="ss-user-overview-product-purchase-infor-price">
                                    数量：最大{itemProduct.quantity_limit}個まで
                                  </div> :
                                  ""
                                }
                              </div>
                            }
                          </div>
                        </Radio>
                      })}
                    </Radio.Group>
                  </React.Fragment>
                )
              )}
              {productPurchase.type === 'text_with_image' && (
                productPurchase.multiple_item_purchase ? (
                  <React.Fragment>
                    <Checkbox.Group
                      className="ss-user-overview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width ss-content-preview__group--full"

                      onChange={(value) => console.log(value)}
                      value={productPurchase.initial_selection}
                    >
                      {productPurchase.products.map((itemProduct, indexProduct) => {
                        return <Checkbox key={indexProduct} value={itemProduct.id}>
                          <div className="ss-user-overview-product-purchase-container-type-text_image">
                            <div className="ss-user-overview-product-purchase-img-type-text_image">
                              <img src={itemProduct.img_url} />
                            </div>
                            {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                              <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                {productPurchase.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchase.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {itemProduct.price_display_custom ? itemProduct.price_display_custom : (productPurchase.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : "")}
                              </div>
                            }
                            {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                              <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                数量：最大{itemProduct.quantity_limit}個まで
                              </div> :
                              ""
                            }
                          </div>
                        </Checkbox>
                      })}
                    </Checkbox.Group>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Radio.Group
                      className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width ss-content-preview__group--full"

                      onChange={(value) => console.log(value)}
                      value={productPurchase.initial_selection[0]}
                    >
                      {productPurchase.products.map((itemProduct, indexProduct) => {
                        return <Radio value={itemProduct.id} key={indexProduct}>
                          <div className="ss-user-overview-product-purchase-container-type-text_image">
                            <div className="ss-user-overview-product-purchase-img-type-text_image">
                              <img src={itemProduct.img_url} />
                            </div>
                            {(productPurchase.product_name_display || productPurchase.price_display || productPurchase.product_number_display) &&
                              <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                {productPurchase.product_name_display && itemProduct.title ? itemProduct.title : ""} {productPurchase.product_number_display && itemProduct.item_number ? itemProduct.item_number : ""} {itemProduct.price_display_custom ? itemProduct.price_display_custom : (productPurchase.price_display && itemProduct.item_price ? `${itemProduct.item_price} 円` : "")}
                              </div>
                            }                                                                              
                            {((productPurchase.quantity_designation_all || itemProduct.is_quantity_designation) && itemProduct.quantity_limit) ?
                              <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                数量：最大{itemProduct.quantity_limit}個まで
                              </div> :
                              ""
                            }
                          </div>
                        </Radio>
                      })}
                    </Radio.Group>
                  </React.Fragment>
                )
              )}
              {productPurchase.type === 'consume_api_response' && (
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

export default ProductPurchasePreview;

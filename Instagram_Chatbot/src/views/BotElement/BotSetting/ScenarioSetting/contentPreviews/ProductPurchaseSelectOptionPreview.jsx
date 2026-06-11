import React from 'react';
import SelectCustom from '../scenarioComon/SelectCustom';

const ProductPurchaseSelectOptionPreview = ({
  content,
  message,
  indexContent,
}) => {
  const productPurchaseSelectOption = content.product_purchase_select_option;
  return (
    <>
      {
          content.type === 'product_purchase_select_option' && (
              <div style={{ marginBottom: '10px' }}>
                {(productPurchaseSelectOption.title_require || productPurchaseSelectOption.require) &&
                    <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                      {productPurchaseSelectOption.title_require &&
                          <span className="ss-message__content--user-pull_down-title">
                    {productPurchaseSelectOption.title}
                  </span>
                      }
                      {productPurchaseSelectOption.require === true &&
                          <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                      }
                    </div>
                }
                <div className="ss-message__content--user-pull_down-wrapper">
                  {productPurchaseSelectOption.type === 'text_with_thumbnail_image' && (
                      <>
                        <div className="ss-message__content--user-pull_down--customization">
                          <div className="">
                            <div className="ss-message__content--user-pull_down-col col-12" style={{ padding: '0' }}>
                              <SelectCustom
                                  data={productPurchaseSelectOption.products}
                                  style={{ width: '100%' }}
                                  placeholder={productPurchaseSelectOption.display_unselected}
                                  keyValue="productVariantId"
                                  nameValue="title"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                  )}
                </div>
              </div>
          )
      }
    </>
  );
};

export default ProductPurchaseSelectOptionPreview;

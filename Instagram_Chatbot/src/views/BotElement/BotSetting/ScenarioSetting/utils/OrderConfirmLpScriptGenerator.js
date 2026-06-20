export const ORDER_CONFIRM_LP_PRESET = {
  ECFORCE: 'ecforce',
  CUSTOM: 'custom',
};

export const ORDER_CONFIRM_LP_PRESETS = {
  [ORDER_CONFIRM_LP_PRESET.ECFORCE]: {
    preview_root_selector: '#preview-view',
    selectors: {
      customer: {
        name: '.qa-shipping_address_full_name',
        address: '.qa-shipping_address_full_address',
      },
      product: {
        name: '.qa-product_name',
        price: '.qa-product_price',
        quantity: '.qa-product_quantity',
        subtotal: '.qa-product_subtotal_price',
      },
      summary: {
        subtotal: '.qa-subtotal',
        deliveryFee: '.qa-deliv_fee',
        charge: '.qa-charge',
        tax: '.qa-tax',
        total: '.qa-total',
      },
      discount: {
        subtotal10: '.qa-subtotal10',
        tax10: '.qa-tax10',
      },
    },
  },
};

const DEFAULT_LABELS = {
  customerSection: 'お客様情報',
  orderSection: 'ご注文内容',
  name: 'お名前',
  address: 'ご住所',
  productName: '商品名',
  unitPrice: '単価',
  quantity: '個数',
  productSubtotal: '小計',
  subtotal: '小計',
  deliveryFee: '送料',
  charge: '手数料',
  tax: '消費税',
  total: '合計',
  taxNote: '(10%対象商品小計: {subtotal10}、消費税: {tax10})',
};

export function getDefaultOrderConfirmConfig() {
  const ecforcePreset = ORDER_CONFIRM_LP_PRESETS[ORDER_CONFIRM_LP_PRESET.ECFORCE];
  return {
    lp_preset: ORDER_CONFIRM_LP_PRESET.ECFORCE,
    preview_root_selector: ecforcePreset.preview_root_selector,
    selectors: JSON.parse(JSON.stringify(ecforcePreset.selectors)),
    labels: { ...DEFAULT_LABELS },
    retry: { maxRetry: 20, delay: 500 },
    error_message: '入力エラーが発生しています。修正の上、再度お試しください。',
    scroll_auto: false,
  };
}

export function resolveOrderConfirmSelectors(config = {}) {
  if (config.lp_preset === ORDER_CONFIRM_LP_PRESET.ECFORCE) {
    return ORDER_CONFIRM_LP_PRESETS[ORDER_CONFIRM_LP_PRESET.ECFORCE].selectors;
  }
  return config.selectors || getDefaultOrderConfirmConfig().selectors;
}

export const ORDER_CONFIRM_PREVIEW_DATA = {
  customer: {
    name: '{{customer_name}}',
    address: '{{customer_address}}',
  },
  product: {
    name: '{{product_name}}',
    price: '{{product_price}}',
    quantity: '{{product_quantity}}',
    subtotal: '{{product_subtotal}}',
  },
  summary: {
    subtotal: '{{subtotal}}',
    deliveryFee: '{{delivery_fee}}',
    charge: '{{charge}}',
    tax: '{{tax}}',
    total: '{{total}}',
  },
  discount: {
    subtotal10: '{{subtotal10}}',
    tax10: '{{tax10}}',
  },
};

function mergeOrderConfirmConfig(config = {}) {
  return {
    ...getDefaultOrderConfirmConfig(),
    ...config,
    labels: { ...DEFAULT_LABELS, ...(config.labels || {}) },
  };
}

export function buildOrderConfirmHtml(config = {}, data = {}) {
  const mergedConfig = mergeOrderConfirmConfig(config);
  const labels = mergedConfig.labels || {};
  const taxNote = (labels.taxNote || '')
    .replace('{subtotal10}', (data.discount && data.discount.subtotal10) || '')
    .replace('{tax10}', (data.discount && data.discount.tax10) || '');

  const results = [
    `<p style="font-size:18px;font-weight:bold;margin:0;">${labels.customerSection || ''}</p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.name || ''}：</span><span>${(data.customer && data.customer.name) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.address || ''}：</span><span>${(data.customer && data.customer.address) || ''}</span></p>`,
    '<hr style="border:none;border-top:1px solid #ccc;">',
    `<p style="font-size:18px;font-weight:bold;margin:0;">${labels.orderSection || ''}</p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.productName || ''}：</span><span>${(data.product && data.product.name) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.unitPrice || ''}：</span><span style="color:#444;">${(data.product && data.product.price) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.quantity || ''}：</span><span style="color:#444;">${(data.product && data.product.quantity) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.productSubtotal || ''}：</span><span style="color:#444;">${(data.product && data.product.subtotal) || ''}</span></p>`,
    '<hr style="border:none;border-top:1px solid #ccc;">',
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.subtotal || ''}：</span><span style="color:#444;">${(data.summary && data.summary.subtotal) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.deliveryFee || ''}：</span><span style="color:#444;">${(data.summary && data.summary.deliveryFee) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.charge || ''}：</span><span>${(data.summary && data.summary.charge) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.tax || ''}：</span><span>${(data.summary && data.summary.tax) || ''}</span></p>`,
    `<p style="margin:0;"><span style="font-weight:bold;">${labels.total || ''}：</span><span style="font-weight:bold;">${(data.summary && data.summary.total) || ''}</span></p>`,
    `<p style="font-size:13px;margin:0;">${taxNote}</p>`,
  ];

  return `<div style="background-color:#ffffff;color:#000000;border-radius:15px;padding:15px;margin:0px!important;">${results.join('')}</div>`;
}

export function buildOrderConfirmPreviewHtml(config = {}) {
  return buildOrderConfirmHtml(config, ORDER_CONFIRM_PREVIEW_DATA);
}

export function buildOrderConfirmJs(config = {}) {
  const mergedConfig = {
    ...getDefaultOrderConfirmConfig(),
    ...config,
    labels: { ...DEFAULT_LABELS, ...(config.labels || {}) },
    retry: { maxRetry: 20, delay: 500, ...(config.retry || {}) },
    selectors: resolveOrderConfirmSelectors(config),
    preview_root_selector: config.preview_root_selector
      || ORDER_CONFIRM_LP_PRESETS[ORDER_CONFIRM_LP_PRESET.ECFORCE].preview_root_selector,
    error_message: config.error_message || getDefaultOrderConfirmConfig().error_message,
  };

  const payload = JSON.stringify(mergedConfig);

  return `(function() {
  var CONFIG = ${payload};

  var LOADING_STYLES = ".loader{display:flex;align-items:flex-end;justify-content:center;gap:5px;height:40px}.loader span{width:10px;height:10px;background-color:#333;border-radius:50%;display:inline-block;animation:bounce 1.2s infinite ease-in-out;transform:translateY(-225%)}.loader span:nth-child(1){animation-delay:0s}.loader span:nth-child(2){animation-delay:0.2s}.loader span:nth-child(3){animation-delay:0.4s}@keyframes bounce{0%{transform:translateY(-225%)}20%{transform:translateY(-125%)}40%{transform:translateY(-225%)}100%{transform:translateY(-275%)}}";

  function safeGetText(selector, fallback) {
    if (fallback === undefined) fallback = "";
    try {
      var el = document.querySelector(selector);
      return el ? el.innerText.trim().replace(/\\n/g, " ") : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function cleanHTML(text) {
    return '<div style="background-color:#ffffff;color:#000000;border-radius:15px;padding:15px;margin:0px!important;">' + text + '</div>';
  }

  function extractOrderInfo() {
    var selectors = CONFIG.selectors || {};
    var formPreviewData = {
      customer: {
        name: safeGetText(selectors.customer && selectors.customer.name, ""),
        address: safeGetText(selectors.customer && selectors.customer.address, ""),
      },
      product: {
        name: safeGetText(selectors.product && selectors.product.name, ""),
        price: safeGetText(selectors.product && selectors.product.price, ""),
        quantity: safeGetText(selectors.product && selectors.product.quantity, ""),
        subtotal: safeGetText(selectors.product && selectors.product.subtotal, ""),
      },
      summary: {
        subtotal: safeGetText(selectors.summary && selectors.summary.subtotal, ""),
        deliveryFee: safeGetText(selectors.summary && selectors.summary.deliveryFee, ""),
        charge: safeGetText(selectors.summary && selectors.summary.charge, ""),
        tax: safeGetText(selectors.summary && selectors.summary.tax, ""),
        total: safeGetText(selectors.summary && selectors.summary.total, ""),
      },
      discount: {
        subtotal10: safeGetText(selectors.discount && selectors.discount.subtotal10, ""),
        tax10: safeGetText(selectors.discount && selectors.discount.tax10, ""),
      },
    };

    if (formPreviewData.customer.name === "") {
      return { ok: false, data: formPreviewData };
    }

    return { ok: true, data: formPreviewData };
  }

  function createOrderText(data) {
    var labels = CONFIG.labels || {};
    var taxNote = (labels.taxNote || "")
      .replace("{subtotal10}", (data.discount && data.discount.subtotal10) || "")
      .replace("{tax10}", (data.discount && data.discount.tax10) || "");

    var results = [
      '<p style="font-size:18px;font-weight:bold;margin:0;">' + (labels.customerSection || "") + '</p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.name || "") + '：</span><span>' + ((data.customer && data.customer.name) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.address || "") + '：</span><span>' + ((data.customer && data.customer.address) || "") + '</span></p>',
      '<hr style="border:none;border-top:1px solid #ccc;">',
      '<p style="font-size:18px;font-weight:bold;margin:0;">' + (labels.orderSection || "") + '</p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.productName || "") + '：</span><span>' + ((data.product && data.product.name) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.unitPrice || "") + '：</span><span style="color:#444;">' + ((data.product && data.product.price) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.quantity || "") + '：</span><span style="color:#444;">' + ((data.product && data.product.quantity) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.productSubtotal || "") + '：</span><span style="color:#444;">' + ((data.product && data.product.subtotal) || "") + '</span></p>',
      '<hr style="border:none;border-top:1px solid #ccc;">',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.subtotal || "") + '：</span><span style="color:#444;">' + ((data.summary && data.summary.subtotal) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.deliveryFee || "") + '：</span><span style="color:#444;">' + ((data.summary && data.summary.deliveryFee) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.charge || "") + '：</span><span>' + ((data.summary && data.summary.charge) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.tax || "") + '：</span><span>' + ((data.summary && data.summary.tax) || "") + '</span></p>',
      '<p style="margin:0;"><span style="font-weight:bold;">' + (labels.total || "") + '：</span><span style="font-weight:bold;">' + ((data.summary && data.summary.total) || "") + '</span></p>',
      '<p style="font-size:13px;margin:0;">' + taxNote + '</p>',
    ];
    return cleanHTML(results.join(""));
  }

  function sendMessageToChatbot(message, action) {
    var previewForm = document.querySelector("#previewSdk");
    if (previewForm) {
      previewForm.contentWindow.postMessage({
        action: action,
        actionData: message,
      }, "*");
    }
  }

  function generateLoadingText() {
    return '<style>' + LOADING_STYLES + '</style><div style="background-color:#fcc660;padding:9px;border-radius:20px;height:50px;width:70px;"><div class="loader"><span></span><span></span><span></span></div></div>';
  }

  function generateOrderErrorText() {
    return '<div style="background-color:#fcc660;color:rgb(255,0,0);padding:6px 9px;border-radius:20px;font-weight:bold;"><span>' + (CONFIG.error_message || "") + '</span></div>';
  }

  function retry(fn, options) {
    var delay = (options && options.delay) || 500;
    var maxRetry = (options && options.maxRetry) || 10;
    var onRetry = (options && options.onRetry) || function() {};
    var onRetryReject = (options && options.onRetryReject) || function() {};
    var attempts = 0;

    function execute() {
      attempts++;
      onRetry();
      return Promise.resolve(fn()).then(function(result) {
        if (result) return true;
        throw new Error("Order confirm extraction failed");
      }).catch(function(error) {
        if (attempts >= maxRetry) {
          console.error({ error: error }, "Retry failed after " + maxRetry + " attempts");
          onRetryReject();
          return Promise.reject(error);
        }
        return new Promise(function(resolve) {
          setTimeout(function() { resolve(execute()); }, delay);
        });
      });
    }

    return execute();
  }

  function getPreviewConfirmOrder() {
    return new Promise(function(resolve, reject) {
      var previewForm = document.querySelector(CONFIG.preview_root_selector || "#preview-view");
      var extracted = extractOrderInfo();
      var ok = extracted.ok;
      var data = extracted.data;

      if (previewForm && ok) {
        sendMessageToChatbot(createOrderText(data), "getPreviewOrderContent");
        resolve(true);
        return;
      }
      reject(false);
    });
  }

  var retryConfig = CONFIG.retry || {};
  retry(getPreviewConfirmOrder, {
    maxRetry: retryConfig.maxRetry || 20,
    delay: retryConfig.delay || 500,
    onRetry: function() {
      sendMessageToChatbot(generateLoadingText(), "getPreviewOrderContent");
    },
    onRetryReject: function() {
      sendMessageToChatbot(generateOrderErrorText(), "getPreviewOrderContent");
    },
  });
})();`;
}

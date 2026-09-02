export const ORDER_CONFIRM_LP_PRESET = {
  ECFORCE: 'ecforce',
  CUSTOM: 'custom',
};

export const ORDER_CONFIRM_GROUP_KEYS = ['customer', 'product', 'summary', 'discount'];

export const ORDER_CONFIRM_GROUP_META = {
  customer: { title: 'お客様' },
  product: { title: '商品' },
  summary: { title: '合計' },
  discount: { title: '割引' },
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

const PRESET_KEY_PREVIEW_PLACEHOLDERS = {
  'customer.name': '{{customer_name}}',
  'customer.address': '{{customer_address}}',
  'product.name': '{{product_name}}',
  'product.price': '{{product_price}}',
  'product.quantity': '{{product_quantity}}',
  'product.subtotal': '{{product_subtotal}}',
  'summary.subtotal': '{{subtotal}}',
  'summary.deliveryFee': '{{delivery_fee}}',
  'summary.charge': '{{charge}}',
  'summary.tax': '{{tax}}',
  'summary.total': '{{total}}',
  'discount.subtotal10': '{{subtotal10}}',
  'discount.tax10': '{{tax10}}',
};

const DEFAULT_FIELD_TEMPLATES = [
  { group: 'customer', id: 'oc-customer-section', type: 'label_only', rowLabel: 'お客様情報（セクション）', labelKey: 'customerSection', style: 'section' },
  { group: 'customer', id: 'oc-customer-name', type: 'paired', rowLabel: 'お名前', labelKey: 'name', selectorGroup: 'customer', selectorKey: 'name', preset_key: 'customer.name' },
  { group: 'customer', id: 'oc-customer-address', type: 'paired', rowLabel: 'ご住所', labelKey: 'address', selectorGroup: 'customer', selectorKey: 'address', preset_key: 'customer.address' },
  { group: 'product', id: 'oc-product-section', type: 'label_only', rowLabel: 'ご注文内容（セクション）', labelKey: 'orderSection', style: 'section' },
  { group: 'product', id: 'oc-product-name', type: 'paired', rowLabel: '商品名', labelKey: 'productName', selectorGroup: 'product', selectorKey: 'name', preset_key: 'product.name' },
  { group: 'product', id: 'oc-product-price', type: 'paired', rowLabel: '単価', labelKey: 'unitPrice', selectorGroup: 'product', selectorKey: 'price', preset_key: 'product.price' },
  { group: 'product', id: 'oc-product-quantity', type: 'paired', rowLabel: '個数', labelKey: 'quantity', selectorGroup: 'product', selectorKey: 'quantity', preset_key: 'product.quantity' },
  { group: 'product', id: 'oc-product-subtotal', type: 'paired', rowLabel: '商品小計', labelKey: 'productSubtotal', selectorGroup: 'product', selectorKey: 'subtotal', preset_key: 'product.subtotal' },
  { group: 'summary', id: 'oc-summary-subtotal', type: 'paired', rowLabel: '小計', labelKey: 'subtotal', selectorGroup: 'summary', selectorKey: 'subtotal', preset_key: 'summary.subtotal' },
  { group: 'summary', id: 'oc-summary-delivery', type: 'paired', rowLabel: '送料', labelKey: 'deliveryFee', selectorGroup: 'summary', selectorKey: 'deliveryFee', preset_key: 'summary.deliveryFee' },
  { group: 'summary', id: 'oc-summary-charge', type: 'paired', rowLabel: '手数料', labelKey: 'charge', selectorGroup: 'summary', selectorKey: 'charge', preset_key: 'summary.charge' },
  { group: 'summary', id: 'oc-summary-tax', type: 'paired', rowLabel: '消費税', labelKey: 'tax', selectorGroup: 'summary', selectorKey: 'tax', preset_key: 'summary.tax' },
  { group: 'summary', id: 'oc-summary-total', type: 'paired', rowLabel: '合計', labelKey: 'total', selectorGroup: 'summary', selectorKey: 'total', preset_key: 'summary.total' },
  { group: 'discount', id: 'oc-discount-subtotal10', type: 'selector_only', rowLabel: '10%対象商品小計', selectorGroup: 'discount', selectorKey: 'subtotal10', preset_key: 'discount.subtotal10' },
  { group: 'discount', id: 'oc-discount-tax10', type: 'selector_only', rowLabel: '消費税(10%)', selectorGroup: 'discount', selectorKey: 'tax10', preset_key: 'discount.tax10' },
  { group: 'discount', id: 'oc-discount-tax-note', type: 'label_only', rowLabel: '税注記（{subtotal10}、{tax10}）', labelKey: 'taxNote', style: 'note' },
];

const getEcforceSelectors = () => (
  ORDER_CONFIRM_LP_PRESETS[ORDER_CONFIRM_LP_PRESET.ECFORCE].selectors
);

const getPresetSelector = (presetKey) => {
  if (!presetKey) return '';
  const [group, key] = presetKey.split('.');
  return getEcforceSelectors()[group]?.[key] || '';
};

const buildFieldFromTemplate = (template, selectors, labels) => {
  const field = {
    id: template.id,
    type: template.type,
    rowLabel: template.rowLabel,
    label: labels[template.labelKey] || DEFAULT_LABELS[template.labelKey] || '',
    selector: '',
    preset_key: template.preset_key || undefined,
    style: template.style || undefined,
  };

  if (template.selectorGroup && template.selectorKey) {
    field.selector = selectors?.[template.selectorGroup]?.[template.selectorKey]
      || getEcforceSelectors()[template.selectorGroup]?.[template.selectorKey]
      || '';
  }

  return field;
};

export const buildDefaultFieldsByGroup = (selectors = getEcforceSelectors(), labels = DEFAULT_LABELS) => {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };
  const fieldsByGroup = {
    customer: [],
    product: [],
    summary: [],
    discount: [],
  };

  DEFAULT_FIELD_TEMPLATES.forEach((template) => {
    fieldsByGroup[template.group].push(buildFieldFromTemplate(template, selectors, mergedLabels));
  });

  return fieldsByGroup;
}

export const createOrderConfirmFieldId = (fieldsByGroup = {}) => {
  const allIds = ORDER_CONFIRM_GROUP_KEYS.flatMap((groupKey) => (
    (fieldsByGroup[groupKey] || []).map((field) => field.id)
  ));
  const nextId = allIds.reduce((maxId, id) => {
    const match = String(id).match(/^oc-field-(\d+)$/);
    if (match) return Math.max(maxId, parseInt(match[1], 10) + 1);
    return maxId;
  }, 1);
  return `oc-field-${nextId}`;
};

export const addOrderConfirmField = (fieldsByGroup, groupKey) => {
  const next = ORDER_CONFIRM_GROUP_KEYS.reduce((acc, key) => {
    acc[key] = [...(fieldsByGroup[key] || [])];
    return acc;
  }, {});

  next[groupKey].push({
    id: createOrderConfirmFieldId(fieldsByGroup),
    type: 'paired',
    rowLabel: '新しい項目',
    label: '新しい項目',
    selector: '',
  });

  return next;
}

export const removeOrderConfirmField = (fieldsByGroup, groupKey, fieldId) => {
  const next = ORDER_CONFIRM_GROUP_KEYS.reduce((acc, key) => {
    acc[key] = [...(fieldsByGroup[key] || [])];
    return acc;
  }, {});

  next[groupKey] = next[groupKey].filter((field) => field.id !== fieldId);
  return next;
}

export const reorderOrderConfirmFields = (fieldsByGroup, groupKey, fromIndex, toIndex) => {
  const next = ORDER_CONFIRM_GROUP_KEYS.reduce((acc, key) => {
    acc[key] = [...(fieldsByGroup[key] || [])];
    return acc;
  }, {});

  const items = [...next[groupKey]];
  const [moved] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, moved);
  next[groupKey] = items;
  return next;
}

export const updateOrderConfirmField = (fieldsByGroup, groupKey, fieldId, patch) => {
  const next = ORDER_CONFIRM_GROUP_KEYS.reduce((acc, key) => {
    acc[key] = (fieldsByGroup[key] || []).map((field) => (
      key === groupKey && field.id === fieldId
        ? { ...field, ...patch }
        : field
    ));
    return acc;
  }, {});

  return next;
}

export const applyEcforcePresetToFields = (fieldsByGroup) => {
  const next = ORDER_CONFIRM_GROUP_KEYS.reduce((acc, key) => {
    acc[key] = (fieldsByGroup[key] || []).map((field) => {
      if (!field.preset_key) return field;
      return { ...field, selector: getPresetSelector(field.preset_key) };
    });
    return acc;
  }, {});

  return next;
}

export const syncLegacySelectorsLabelsFromFields = (fieldsByGroup) => {
  const selectors = {
    customer: {},
    product: {},
    summary: {},
    discount: {},
  };
  const labels = { ...DEFAULT_LABELS };

  ORDER_CONFIRM_GROUP_KEYS.forEach((groupKey) => {
    (fieldsByGroup[groupKey] || []).forEach((field) => {
      if (field.preset_key) {
        const [group, key] = field.preset_key.split('.');
        if (field.selector && (field.type === 'paired' || field.type === 'selector_only')) {
          selectors[group][key] = field.selector;
        }
        const template = DEFAULT_FIELD_TEMPLATES.find((item) => item.preset_key === field.preset_key);
        if (template?.labelKey && field.label) {
          labels[template.labelKey] = field.label;
        }
        if (field.type === 'label_only' && field.style === 'section') {
          const sectionTemplate = DEFAULT_FIELD_TEMPLATES.find((item) => item.id === field.id);
          if (sectionTemplate?.labelKey) labels[sectionTemplate.labelKey] = field.label;
        }
        if (field.type === 'label_only' && field.style === 'note') {
          labels.taxNote = field.label;
        }
      } else if (field.type === 'label_only') {
        if (field.style === 'note') labels.taxNote = field.label;
      }
    });
  });

  return { selectors, labels };
}

export const normalizeOrderConfirmConfig = (config = {}) => {
  const ecforcePreset = ORDER_CONFIRM_LP_PRESETS[ORDER_CONFIRM_LP_PRESET.ECFORCE];
  const base = {
    lp_preset: ORDER_CONFIRM_LP_PRESET.ECFORCE,
    preview_root_selector: ecforcePreset.preview_root_selector,
    selectors: JSON.parse(JSON.stringify(ecforcePreset.selectors)),
    error_message: '入力エラーが発生しています。修正の上、再度お試しください。',
    scroll_auto: false,
    ...config,
    labels: { ...DEFAULT_LABELS, ...(config.labels || {}) },
    retry: { maxRetry: 20, delay: 500, ...(config.retry || {}) },
  };

  const resolvedSelectors = config.lp_preset === ORDER_CONFIRM_LP_PRESET.ECFORCE
    ? JSON.parse(JSON.stringify(ecforcePreset.selectors))
    : (config.selectors || JSON.parse(JSON.stringify(ecforcePreset.selectors)));

  base.selectors = resolvedSelectors;

  if (config.fields_by_group && Object.keys(config.fields_by_group).length > 0) {
    base.fields_by_group = ORDER_CONFIRM_GROUP_KEYS.reduce((acc, groupKey) => {
      acc[groupKey] = (config.fields_by_group[groupKey] || []).map((field) => ({ ...field }));
      return acc;
    }, {});
  } else {
    base.fields_by_group = buildDefaultFieldsByGroup(resolvedSelectors, base.labels);
  }

  if (base.lp_preset === ORDER_CONFIRM_LP_PRESET.ECFORCE) {
    base.fields_by_group = applyEcforcePresetToFields(base.fields_by_group);
  }

  const legacy = syncLegacySelectorsLabelsFromFields(base.fields_by_group);
  base.selectors = base.lp_preset === ORDER_CONFIRM_LP_PRESET.ECFORCE
    ? JSON.parse(JSON.stringify(ecforcePreset.selectors))
    : legacy.selectors;
  base.labels = { ...base.labels, ...legacy.labels };

  return base;
}

export const getDefaultOrderConfirmConfig = () => normalizeOrderConfirmConfig({});

export const buildOrderConfirmPresetConfig = (currentConfig = {}, preset) => {
  const ecforcePreset = ORDER_CONFIRM_LP_PRESETS[ORDER_CONFIRM_LP_PRESET.ECFORCE];
  const current = normalizeOrderConfirmConfig(currentConfig);
  const nextFieldsByGroup = preset === ORDER_CONFIRM_LP_PRESET.ECFORCE
    ? applyEcforcePresetToFields(current.fields_by_group)
    : current.fields_by_group;

  const legacy = syncLegacySelectorsLabelsFromFields(nextFieldsByGroup);

  return normalizeOrderConfirmConfig({
    ...current,
    lp_preset: preset,
    preview_root_selector: ecforcePreset.preview_root_selector,
    fields_by_group: nextFieldsByGroup,
    selectors: preset === ORDER_CONFIRM_LP_PRESET.ECFORCE
      ? JSON.parse(JSON.stringify(ecforcePreset.selectors))
      : legacy.selectors,
    labels: { ...current.labels, ...legacy.labels },
  });
}

export const resolveOrderConfirmSelectors = (config = {}) => (
  normalizeOrderConfirmConfig(config).selectors
);

const resolveTaxNote = (label, fieldsByGroup, dataByFieldId) => {
  const discountFields = fieldsByGroup.discount || [];
  const subtotal10Field = discountFields.find((field) => field.preset_key === 'discount.subtotal10');
  const tax10Field = discountFields.find((field) => field.preset_key === 'discount.tax10');

  return (label || '')
    .replace('{subtotal10}', (subtotal10Field && dataByFieldId[subtotal10Field.id]) || '')
    .replace('{tax10}', (tax10Field && dataByFieldId[tax10Field.id]) || '');
};

const renderFieldHtml = (field, fieldsByGroup, dataByFieldId) => {
  const value = dataByFieldId[field.id] || '';

  if (field.type === 'selector_only') return '';

  if (field.type === 'label_only') {
    if (field.style === 'section') {
      return `<p style="font-size:18px;font-weight:bold;margin:0;">${field.label || ''}</p>`;
    }
    if (field.style === 'note') {
      return `<p style="font-size:13px;margin:0;">${resolveTaxNote(field.label, fieldsByGroup, dataByFieldId)}</p>`;
    }
    return `<p style="margin:0;">${field.label || ''}</p>`;
  }

  const isTotal = field.preset_key === 'summary.total';
  const valueStyle = isTotal ? 'font-weight:bold;' : 'color:#444;';
  return `<p style="margin:0;"><span style="font-weight:bold;">${field.label || ''}：</span><span style="${valueStyle}">${value}</span></p>`;
};

export const buildOrderConfirmHtmlFromFields = (fieldsByGroup, dataByFieldId = {}) => {
  const parts = [];

  ORDER_CONFIRM_GROUP_KEYS.forEach((groupKey) => {
    (fieldsByGroup[groupKey] || []).forEach((field) => {
      const html = renderFieldHtml(field, fieldsByGroup, dataByFieldId);
      if (html) parts.push(html);
    });

    if (groupKey === 'customer' || groupKey === 'product') {
      parts.push('<hr style="border:none;border-top:1px solid #ccc;">');
    }
  });

  return `<div style="background-color:#ffffff;color:#000000;border-radius:15px;padding:15px;margin:0px!important;">${parts.join('')}</div>`;
}

export const buildPreviewDataByFieldId = (config = {}) => {
  const normalized = normalizeOrderConfirmConfig(config);
  const dataByFieldId = {};

  ORDER_CONFIRM_GROUP_KEYS.forEach((groupKey) => {
    (normalized.fields_by_group[groupKey] || []).forEach((field) => {
      if (field.type === 'paired' || field.type === 'selector_only') {
        dataByFieldId[field.id] = field.preset_key
          ? (PRESET_KEY_PREVIEW_PLACEHOLDERS[field.preset_key] || `{{field_${field.id}}}`)
          : `{{field_${field.id}}}`;
      }
    });
  });

  return dataByFieldId;
}

export const buildOrderConfirmHtml = (config = {}, dataByFieldId = null) => {
  const normalized = normalizeOrderConfirmConfig(config);
  const resolvedData = dataByFieldId || buildPreviewDataByFieldId(normalized);
  return buildOrderConfirmHtmlFromFields(normalized.fields_by_group, resolvedData);
}

export const buildOrderConfirmPreviewHtml = (config = {}) => (
  buildOrderConfirmHtml(config, buildPreviewDataByFieldId(config))
);

export const buildOrderConfirmJs = (config = {}) => {
  const mergedConfig = normalizeOrderConfirmConfig(config);
  const payload = JSON.stringify(mergedConfig);

  return `(function() {
  var CONFIG = ${payload};
  var GROUP_KEYS = ${JSON.stringify(ORDER_CONFIRM_GROUP_KEYS)};

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

  function resolveTaxNote(label, fieldsByGroup, dataByFieldId) {
    var discountFields = fieldsByGroup.discount || [];
    var subtotal10Field = discountFields.find(function(f) { return f.preset_key === "discount.subtotal10"; });
    var tax10Field = discountFields.find(function(f) { return f.preset_key === "discount.tax10"; });
    return (label || "")
      .replace("{subtotal10}", (subtotal10Field && dataByFieldId[subtotal10Field.id]) || "")
      .replace("{tax10}", (tax10Field && dataByFieldId[tax10Field.id]) || "");
  }

  function renderFieldHtml(field, fieldsByGroup, dataByFieldId) {
    var value = dataByFieldId[field.id] || "";
    if (field.type === "selector_only") return "";
    if (field.type === "label_only") {
      if (field.style === "section") {
        return '<p style="font-size:18px;font-weight:bold;margin:0;">' + (field.label || "") + '</p>';
      }
      if (field.style === "note") {
        return '<p style="font-size:13px;margin:0;">' + resolveTaxNote(field.label, fieldsByGroup, dataByFieldId) + '</p>';
      }
      return '<p style="margin:0;">' + (field.label || "") + '</p>';
    }
    var isTotal = field.preset_key === "summary.total";
    var valueStyle = isTotal ? "font-weight:bold;" : "color:#444;";
    return '<p style="margin:0;"><span style="font-weight:bold;">' + (field.label || "") + '：</span><span style="' + valueStyle + '">' + value + '</span></p>';
  }

  function buildOrderHtml(fieldsByGroup, dataByFieldId) {
    var parts = [];
    GROUP_KEYS.forEach(function(groupKey) {
      (fieldsByGroup[groupKey] || []).forEach(function(field) {
        var html = renderFieldHtml(field, fieldsByGroup, dataByFieldId);
        if (html) parts.push(html);
      });
      if (groupKey === "customer" || groupKey === "product") {
        parts.push('<hr style="border:none;border-top:1px solid #ccc;">');
      }
    });
    return cleanHTML(parts.join(""));
  }

  function extractOrderInfo() {
    var fieldsByGroup = CONFIG.fields_by_group || {};
    var dataByFieldId = {};
    GROUP_KEYS.forEach(function(groupKey) {
      (fieldsByGroup[groupKey] || []).forEach(function(field) {
        if ((field.type === "paired" || field.type === "selector_only") && field.selector) {
          dataByFieldId[field.id] = safeGetText(field.selector, "");
        }
      });
    });
    var firstPaired = (fieldsByGroup.customer || []).find(function(field) {
      return field.type === "paired" && field.selector;
    });
    var ok = firstPaired ? (dataByFieldId[firstPaired.id] || "") !== "" : false;
    return { ok: ok, fieldsByGroup: fieldsByGroup, dataByFieldId: dataByFieldId };
  }

  function createOrderText(extracted) {
    return buildOrderHtml(extracted.fieldsByGroup, extracted.dataByFieldId);
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
      if (previewForm && extracted.ok) {
        sendMessageToChatbot(createOrderText(extracted), "getPreviewOrderContent");
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

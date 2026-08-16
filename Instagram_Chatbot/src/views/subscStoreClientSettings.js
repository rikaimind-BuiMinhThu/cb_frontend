export const DEFAULT_SUBSC_STORE_CONFIG = {
  item_kind: 'products',
  product_name: '',
  merchandise_id: '',
  variant_id: '',
  course_id: '',
  frequency_id: '',
  payment_method_shop_id_credit: '',
  payment_method_shop_id_np: '',
  shop_shipping_method_id: '',
  time_zone_id: '',
  is_skip_tds: true,
  upsell: {
    enabled: false,
    after_item_kind: 'regular_courses',
    after_merchandise_id: '',
    after_variant_id: '',
    after_course_id: '',
    after_frequency_id: '',
  },
};

export const DEFAULT_MOCK_RESPONSE = {
  access_tokens: { access_token: 'mock_access_token' },
  payment_config: {
    zeus_ip_code: 'MOCK_IP',
    credit_card_script_path: '',
    is_zeus_using_security_code: true,
  },
  payment_method_shops: {
    payment_method_shops: [
      { id: 1, name: 'クレジットカード', payment_method_name: 'credit' },
      { id: 2, name: 'NP後払い', payment_method_name: 'np' },
    ],
  },
  shop_shipping_methods: {
    shop_shipping_methods: [{ id: 1, name: '通常配送' }],
  },
  confirm_order: {
    success: true,
    order: {
      total: 5980,
      tax_total: 544,
      charge_total: 0,
      coupon_adjustment_total: 0,
      rank_discount: 0,
      payment_method_shop_id: 1,
      client_address: {
        family_name: '山田',
        first_name: '太郎',
        family_name_kana: 'ヤマダ',
        first_name_kana: 'タロウ',
        email: 'taro@example.com',
        tel: '09012345678',
        zip_code: '1500001',
        state_id: 13,
        city: '渋谷区',
        address: '神宮前1-1-1',
        building_name: '',
      },
      order_items: {
        products: [{ quantity: 1, total_includes_tax: 5480 }],
      },
      shipments: [{ postage: 500, is_not_specified: true }],
      credit_card: {
        masked_card_number: '411111*******111',
        brand: 'visa',
        expire_month: '12',
        expire_year: '30',
      },
    },
  },
  create_order: {
    success: true,
    order: { id: 900001, uid: 'MOCK-ORDER-001' },
  },
  change_order_items: { success: true },
};

export const MOCK_RESPONSE_FIELDS = [
  { key: 'confirm_order', label: 'confirm_order' },
  { key: 'create_order', label: 'create_order' },
  { key: 'change_order_items', label: 'change_order_items' },
  { key: 'payment_config', label: 'payment_config' },
  { key: 'payment_method_shops', label: 'payment_method_shops' },
  { key: 'shop_shipping_methods', label: 'shop_shipping_methods' },
  { key: 'access_tokens', label: 'access_tokens' },
];

export const mergeSubscStoreConfig = (loaded = {}) => ({
  ...DEFAULT_SUBSC_STORE_CONFIG,
  ...loaded,
  upsell: {
    ...DEFAULT_SUBSC_STORE_CONFIG.upsell,
    ...(loaded.upsell || {}),
  },
});

export const stringifyMockResponses = (loaded = {}) => {
  const result = {};
  MOCK_RESPONSE_FIELDS.forEach(({ key }) => {
    const value = loaded[key] == null ? DEFAULT_MOCK_RESPONSE[key] : loaded[key];
    result[key] = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  });
  return result;
};

export const parseMockResponses = (texts = {}) => {
  const result = {};
  MOCK_RESPONSE_FIELDS.forEach(({ key }) => {
    const raw = texts[key];
    if (!raw || !String(raw).trim()) {
      result[key] = DEFAULT_MOCK_RESPONSE[key];
      return;
    }
    result[key] = JSON.parse(raw);
  });
  return result;
};

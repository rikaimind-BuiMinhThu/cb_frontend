export function getNextContentId(messageContentArray) {
  if (messageContentArray.length !== 0) {
    return Math.max(...messageContentArray.map((item) => item.id)) + 1;
  }
  return 1;
}

export function createDefaultContentItem(messageType, idMax) {
  let subType;

  if (messageType === 'zip_code_address') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        post_code: '',
        is_use_dropdown: false,
        prefecture: null,
        municipality: '',
        address: '',
        building_name: '',
        split_postal_code: false,
        compact_municipality_and_address: false,
        compact_municipality_and_address_and_building_name: false,
        post_code_label: '郵便番号',
        prefecture_label: '都道府県',
        municipality_label: '市区町村',
        address_label: '番地',
        building_name_label: '建物名',
      },
    };
  }

  if (messageType === 'image') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        imageURL: '',
        displayButtonNext: true,
        image_width: '100%',
        image_height: '100%',
      },
    };
  }

  if (messageType === 'radio_button') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        type: 'default',
        initial_selection: 1,
        img_layout: {
          type: 'horizontal_equal_2',
          custom_widths: ['50', '50'],
        },
        option_padding: '0px',
        option_margin: '5px',
        default: [{ id: 1 }],
        radio_button_img: [{ id: 1 }],
        block_style: [{ id: 1 }],
      },
    };
  }

  if (messageType === 'text_input') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        isUseConvertText: false,
        isCustomID: false,
        convertTextTypeValue: 'katakana',
        idRefector: '',
        type: 'text',
        text: {
          range: 'no_input',
          isSplitInput: false,
        },
        urls: {},
        email_address: {},
        email_confirmation: {},
        phone_number: {
          withHyphen: false,
          disable_remove_leading_zero: false,
        },
        password: {},
        password_confirmation: {},
      },
    };
  }

  if (messageType === 'shipping_address') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        type: 'shipping_address',
        shipping_address: {
          range: 'no_input',
          isSplitInput: true,
        },
        card_linked_setting: [],
        radio_contents: [{ id: 1 }],
        name: '',
        kana_name: '',
        number: '',
        post_code: '',
        is_use_dropdown: false,
        prefecture: null,
        municipality: '',
        address: '',
        building_name: '',
        split_postal_code: false,
        compact_municipality_and_address: false,
        compact_municipality_and_address_and_building_name: false,
        withHyphen: false,
      },
    };
  }

  if (messageType === 'checkbox') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        type: 'default',
        img_layout: {
          type: 'horizontal_equal_2',
          custom_widths: ['50', '50'],
        },
        option_padding: '0px',
        option_margin: '5px',
        default: [{ id: 1 }],
        checkbox_img: [{
          id: 1,
          contents: [{ id: 1 }],
        }],
        checkedValue: [],
        initial_selection_picture: [],
      },
    };
  }

  if (messageType === 'pull_down') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        type: 'customization',
        customization: {
          initial_selection: '',
          display_unselected: '選択してください',
          is_comment: false,
          options_with_comment: [{ id: 1 }],
          options_without_comment: [{ id: 1 }],
        },
        time_hm: {},
        date_ymd: {},
        date_md: {},
        date_ym: {},
        date_ymd_hm: {},
        dob_ymd: {},
        dob_ym: {},
        timezone_from_to: {},
        period_from_to: {},
        up_to_municipality: {},
        prefectures: {},
        lp_integration_option: {},
        from_js_result: {},
      },
    };
  }

  if (messageType === 'attaching_file') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        file_type: [],
      },
    };
  }

  if (messageType === 'calendar') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        type: 'date_selection',
        fixed_date: [],
        date_selection: {},
        embedded: {},
        start_end_date: {},
        preview_relative_range_enabled: false,
        preview_days_from_today: 0,
        preview_days_relative_to_end_date: 0,
      },
    };
  }

  if (messageType === 'agree_term') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        require: true,
        title_require: false,
        type: 'detail_content',
        detail_content: {},
        post_link_only: [{}],
      },
    };
  }

  if (messageType === 'textarea') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        type: 'text_input',
        text_input: {},
      },
    };
  }

  if (messageType === 'carousel') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        type: 'default',
        default: {
          contents: [{
            id: 1,
            title: '',
            subtitle: '',
            urls: '',
            fileUrl: '',
            buttonTitle: '',
          }],
        },
      },
    };
  }

  if (messageType === 'credit_card_payment') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        save_input_content: false,
        require: false,
        title_require: false,
        is_hide_card_name: false,
        is_hide_cvc: false,
        separate_type: false,
        validity_check: false,
        type_date_of_expiry: 'ym',
        payment_method: [],
      },
    };
  }

  if (messageType === 'capture') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        require: true,
        type: '0123456789',
        length: 6,
        colour: true,
      },
    };
  }

  if (messageType === 'product_purchase') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        require: false,
        type: 'text_with_thumbnail_image',
        initial_selection: [],
        quantity_designation_all: false,
        product_number_display: false,
        price_display: false,
        product_name_display: false,
        multiple_item_purchase: false,
        products: [{
          id: 1,
          quantity_select: 1,
          is_quantity_designation: false,
        }],
      },
    };
  }

  if (messageType === 'product_purchase_radio_button') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        require: false,
        type: 'text_with_thumbnail_image',
        initial_selection: [],
        product_number_display: false,
        price_display: false,
        product_name_display: false,
        products: [{
          id: 1,
          productVariantId: '',
          displayName: '',
        }],
      },
    };
  }

  if (messageType === 'product_purchase_select_option') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        require: false,
        type: 'text_with_thumbnail_image',
        product_number_display: false,
        price_display: false,
        product_name_display: false,
        display_unselected: '選択してください',
        products: [{
          id: 1,
          productVariantId: '',
          displayName: '',
        }],
      },
    };
  }

  if (messageType === 'AFTEE_payment_module') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        type: 'aftee',
      },
    };
  }

  if (messageType === 'slider') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        save_input_content: false,
        title_require: false,
        require: false,
        type: 'continuous_type',
        max_value: '2',
        min_value: '0',
      },
    };
  }

  if (messageType === 'card_payment_radio_button') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        is_save_input_content: false,
        require: false,
        type: 'default',
        title_require: false,
        is_hide_card_name: false,
        is_hide_cvc: false,
        is_use_installment: [],
        separate_type: false,
        separate_name: false,
        validity_check: false,
        type_date_of_expiry: 'ym',
        payment_method: [],
        card_linked_setting: [],
        radio_contents: [{ id: 1 }],
        radio_contents_img: [{
          id: 1,
          contents: [{ id: 1 }],
        }],
      },
    };
  }

  if (messageType === 'button_submit') {
    return {
      id: idMax,
      type: messageType,
      [messageType]: {
        title_require: false,
        require: false,
        is_display_error_message: false,
        is_use_js: false,
        is_used_cart_confirm_page: false,
        use_for_confirm_order: false,
      },
      button_submit_name: '',
    };
  }

  if (messageType === 'text_input') subType = 'text';
  if (messageType === 'agree_term') subType = 'detail_content';

  return {
    id: idMax,
    type: messageType,
    [messageType]: {
      title_require: false,
      require: false,
      type: subType,
      [subType]: {},
    },
  };
}

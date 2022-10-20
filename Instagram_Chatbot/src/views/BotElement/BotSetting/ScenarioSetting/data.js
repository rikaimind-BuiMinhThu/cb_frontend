let dataClone = {
    name: '',
    messages: [
        {
            id: '1',
            hidden: true,
            belong_to: 'user',
            message_content: [
                {
                    id: 1,
                    type: 'text',
                    text_input: {
                        //txtIn: text_input
                        save_input_content: 'yes', // yes-no
                        use_api_input_value: 'yes', // yes-no
                        require: 'yes', //yes-no
                        title_require: 'yes', //yes-no
                        title: '', //string
                        type: 'text', // 7 values: text, urls, email_address,
                        //email_confirmation, phone_number, password, password_confirmation
                        text: {
                            range: '', // 8 values: no_input, alphabet, single_byte, alphanumeric_hyphen,
                            //alphanumeric, double_byte, double_byte_hiragana, full_width_katakana
                            character_limit_from: 1, //number
                            character_limit_to: 1000, //number
                            placeholder: '', //string
                            comment: '', //string
                        },
                        url: '', //string
                        email_address: '', //string
                        email_confirmation: {
                            cfEmlAdd_email: '', //string
                            cfEmlAdd_confirm_email: '', //string
                        },
                        phone_number: {
                            withHyphen: false,
                            number: '' //string
                        }, 
                        password: {
                            character_limit_from: 1, //number
                            character_limit_to: 30, //number
                            password: '', //string
                        },
                        confirm_password: {
                            character_limit_from: 1, //number
                            character_limit_to: 30, //number
                            password: '', //string
                            confirm_password: '', //string
                        },
                    },
                    label: {
                        lbl_content: '', //string
                    },
                    textarea: {
                        save_input_content: '', //string
                        required: 'yes', //yes-no
                        title_require: 'yes', //yes-no
                        title: '', //string
                        type: 'text_input', // 3 values: text_input, invalid_input, consume_api_response(Pending)
                        text_input: {
                            character_limit_from: 1, //number
                            character_limit_to: 30, //number
                            content: '', //string
                        },
                        invalid_input_content: '', //string
                    },
                    radio_button: {
                        save_input_content: 'yes', //yes-no
                        required: 'yes', //yes-no
                        title_require: 'yes', //yes-no
                        title: '', //string
                        type: 'default', //4 values: default, radio_button_img, block_style,consume_api_response(Pending)
                        default: {
                            text: '', //string
                            value: '', //string
                            initial_selection: 'yes', //yes-no
                        },
                        radio_button_img: {
                            img: '', //base64
                            text: '', //string
                            value: '', //string
                            initial_selection: 'yes', // yes-no
                        },
                        consume_api_response: '', //Pending
                        block_style: {
                            text: '', //string
                            value: '', //string
                            initial_selection: 'yes', // yes-no
                        },
                    },
                    checkbox: {
                        save_input_content: 'yes', //yes-no
                        required: 'yes', //yes-no
                        title_require: 'yes', //yes-no
                        title: '', //string
                        all_item_checked: 'yes', //yes-no
                        type: 'default', // 3 values: default, checkbox_img, consume_api_response(Pending)
                        default: {
                            default_text: '', //string
                            default_value: '', //string
                        },
                        checkbox_img: {
                            img: '', //base64
                            checkbox_img_title: '', //string
                            checkbox_img_value: '', //string
                        },
                        consume_api_response: '', //(Pending)
                    },
                    pull_down: {
                        save_input_content: '', //string
                        required: 'yes', //yes-no
                        title_require: 'yes', //yes-no
                        title: '', //string
                        type: 'customization', // 12 values: customization, time_hm, date_ymd, date_md, date_ym, date_ym_hm,dob_ymd,dob_ym, timezone_from_to, period_from_to,prefectures, up_to_municipality,
                        customization: {
                            time_from_to_comment: '', //string
                            time_from_to: 'yes', //yes-no
                            times: [
                                {
                                    from: '', //string,
                                    to: '', //string
                                },
                            ],
                            comment: '', //string
                        },
                        time_hm: {
                            start_at: 2, //number
                            end_at: 5, //number
                            time: 2, //number
                            minute: 30, //number
                            every_minute: '0', //6 values: 0, 5, 10, 15, 30
                            comment: '', //string
                        },
                        date_ymd: {
                            start_year: 2022, //number
                            end_year: 2022, //number
                            year: 2022, //number
                            month: 10, //number
                            day: 25, //number
                            comment: '', //string
                        },
                        date_md: {
                            month: '', //string
                            day: '', //string
                            comment: '', //string
                        },
                        date_ym: {
                            start_year: 2022, //number
                            end_year: 2022, //number
                            year: 2022, //number
                            month: 10, //number
                            comment: '', //string
                        },
                        date_ym_hm: {
                            year: 2022, //string
                            month: 10, //number
                            day: 25, //number
                            start_at: 2, //number
                            end_at: 5, //number
                            time: 2, //number
                            minute: 30, //number
                            every_minute: '0', //6 values: 0, 5, 10, 15, 30
                            comment: '', //string
                        },
                        dob_ymd: {
                            start_year: 2022, //number
                            end_year: 2022, //number
                            sort: 'asc', //asc-desc
                            year: 2022, //number
                            month: 10, //number
                            day: 25, //number
                            comment: '', //string
                        },
                        dob_ym: {
                            start_year: 2022, //number
                            end_year: 2022, //number
                            sort: 'asc', //asc-desc
                            year: 2022, //number
                            month: 10, //number
                            comment: '', //string
                        },
                        timezone_from_to: {
                            range_start: 2, //number
                            range_end: 5, //number
                            hour_start_at: 2, //number
                            hour_end_at: 3, //number
                            minute_start_at: 10, //number
                            minute_end_at: 15, //number
                            every_minute_start_at: '5', //6 values: 0, 5, 10, 15, 30
                            every_minute_end_at: '10', //6 values: 0, 5, 10, 15, 30
                            comment: '', //string
                        },
                        period_from_to: {
                            year_start_at: 2022, //number
                            year_end_at: 2022, //number
                            month_start_at: 10, //number
                            month_end_at: 11, //number
                            day_start_at: 25, //number
                            day_end_at: 25, //number
                            comment: '', //string
                        },
                        prefectures: '', //string
                        up_to_municipality: {
                            prefecture_comment: '', //string
                            prefecture: '', //string
                            city: '', //string
                            city_comment: '', //string
                        },
                        comsume_api_response: '', //(Pending)
                    },
                    zip_code_address: {
                        save_input_content: 'yes', // yes-no
                        use_api_input_value: 'yes', // yes-no
                        require: 'yes', //yes-no
                        all_items_require: 'yes', //yes-no
                        split_postal_code: 'yes', //yes-no
                        post_code: '', //string
                        use_drop_down: 'yes', //yes-no
                        prefecture: '', //string
                        municipality: '', //string
                        address: '', //string
                        building_name: '', //string
                    },
                    attaching_file: {
                        save_input_content: 'yes', // yes-no
                        require: 'yes', //yes-no
                        multifile_upload: 'yes', //yes-no
                        file_type: [
                            'jpg',
                            'png', //.....
                        ],
                        file_content: '', //base64
                    },
                    calendar: {
                        save_input_content: 'yes', // yes-no
                        required: 'yes', //yes-no
                        use_api_input_value: 'yes', // yes-no
                        initial_selection: 'yes', // yes-no
                        title_require: 'yes', //yes-no
                        title: '', //string
                        start_date: '', //string
                        end_date: '', //string
                        non_select_date_time: '', //string
                        select_fixed_date: '',
                        fixed_date: [
                            '2022/09/27',
                            '2022/09/28', //...
                        ],
                        aggregation_target_period_from: 2, //number
                        aggregation_target_period_to: 6, //number
                        type: 'date_selection', //3 values: date_selection, embedded, start_end_date
                        date_selection: {
                            date_select: '', //string
                        },
                        embedded: {
                            date_select: '', //string
                        },
                        start_end_date: {
                            date_select: '', //string
                            specified_period_from: 5, //number
                            specified_period_to: 10, //number
                        },
                    },
                    agree_term: {
                        title_require: 'yes', //yes-no
                        title: '', //string
                        type: 'detail_content', //2 values: detail_content, post_link_only
                        term: '', //string
                        detail_content: {
                            content: '', //string
                        },
                        post_link_only: {
                            title_comment: '', //string
                            title: '', //string
                            urls: '', //string
                            url_comment: '', //string
                        },
                    },
                },
                {
                    type: 'textarea',                    
                    textarea: {
                        save_input_content: '', //string
                        required: 'yes', //yes-no
                        title_require: 'yes', //yes-no
                        title: '', //string
                        type: 'text_input', // 3 values: text_input, invalid_input, consume_api_response(Pending)
                        text_input: {
                            character_limit_from: 1, //number
                            character_limit_to: 30, //number
                            content: '', //string
                        },
                        invalid_input_content: '', //string
                    },
                }
            ]
        },
        {
            id: '2',
            hidden: true,
            belong_to: 'bot',
            type: 'text',
            message_content: [
                {
                    text: {
                        content: '', //string
                        scroll_auto: 'yes', //yes-no
                    },
                    email: {
                        email_id: '', //id get from list email
                    },
                    file: {
                        file_upload: '', //base64
                        scroll_auto: 'yes', //yes-no
                        file_type: '', //string
                    },
                    script: {
                        script_content: '', //string
                    },
                    delay: {
                        delay_second: 1, // number(range: 1-10)
                        typing_on: 'yes', //yes-no
                    },
                    api_link_age: {
                        //Pending
                        api_id: '', // get from api list(pending)
                    },
                }
            ]
        }
    ]
}
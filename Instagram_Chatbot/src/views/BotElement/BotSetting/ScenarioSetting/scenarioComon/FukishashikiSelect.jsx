import React from 'react';
import InputCustom from './InputCustom';
import SelectCustom from './SelectCustom';

const FukushashikiSelect = ({ dataMessages, onChangeValueMessageContent, indexMessageSelect, indexContent }) => {
    const searchMode = dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode'] || '';
    const searchValue = dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_value'] || '';

    const placeholders = {
        id: '複写先要素のIDを入力ください',
        css_selector: '複写先要素のcss_selectorを入力ください',
        xpath: '複写先要素のxPathを入力ください',
    };

    return (
        <>
            <div className='ss-user-setting__item-bottom'>
                <SelectCustom
                    id="title"
                    style={{ width: '90%' }}
                    value={searchMode}
                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_mode', value)} 
                    data={[
                        {
                            key: 1,
                            value: 'id'
                        },
                        {
                            key: 2,
                            value: 'css_selector'
                        },
                        {
                            key: 3,
                            value: 'xpath'
                        }
                    ]}
                    keyValue="key"
                    placeholder="複写先要素の取得方法をお選びください"
                />
            </div>
            <div className='ss-user-setting__item-bottom'>
                <InputCustom
                    styleLabel={{ width: '100%' }}
                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_value', value)}
                    value={searchValue}
                    placeholder={placeholders[searchMode] || ''}
                />
            </div>
        </>
    )
}

export default FukushashikiSelect;
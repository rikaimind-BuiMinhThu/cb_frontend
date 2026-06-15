import React from 'react';
import SelectCustom from '../scenarioComon/SelectCustom';

const AfteePaymentModuleSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  onChangeValueMessageContent,
}) => {
  const afteePaymentModule = content.AFTEE_payment_module;
  return (
    <>
      {content.type === 'AFTEE_payment_module' && (
          <React.Fragment>
            <div className="ss-user-setting__item-bottom">
              <div
                  className="ss-user-setting__item-select-bottom-wrapper-flex">
                <SelectCustom
                    style={{width: '49%'}}
                    value={afteePaymentModule.type}
                    data={[
                  { key: 'aftee', value: 'Aftee' },
                  { key: 'atone', value: 'Atone' },
                  { key: 'paidy', value: 'Paidy' },
                  { key: 'zcom', value: 'ZCom' }
                ]}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
              />
            </div>
          </div>
          <div className="ss-user-setting__item-bottom">
            <textarea
              style={{ width: '90%' }}
              className="ss-user-setting-item-textarea-label ss-input-value"
              placeholder="テキスト"
              rows="5"
              value={afteePaymentModule.content}
              onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'content')}
            />
          </div>
        </React.Fragment>
      )}
    </>
  );
};

export default AfteePaymentModuleSetting;

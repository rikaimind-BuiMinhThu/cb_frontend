import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputCustom from '../scenarioComon/InputCustom';
import { dataSubCondition } from '../constants/scenarioFormConstants';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import SpecialDisplayConditionsContent from './SpecialDisplayConditionsContent';

const AudienceConditionsContent = ({
  variant = 'bot',
  selectedMessage,
  dataMessages,
  setDataMessages,
  isUseFukushashiki,
  onChangeAmazonPayDisplayMode,
}) => {
  const {
    indexMessageSelect,
    dataCondition,
    onChangeValueCondition,
    handleDeleteCondition,
    onClickAddCondition,
  } = useScenarioPanelDestructuring();

  const conditions = dataMessages[indexMessageSelect]?.conditions || [];
  const showAddButtonInContents = variant === 'user' || variant === 'combine';

  return (
    <div className="ss-audience-conditions-content">
      <SpecialDisplayConditionsContent
        selectedMessage={selectedMessage}
        dataMessages={dataMessages}
        setDataMessages={setDataMessages}
        isUseFukushashiki={isUseFukushashiki}
        onChangeAmazonPayDisplayMode={onChangeAmazonPayDisplayMode}
      />
      <div className="ss-audience-conditions-content__section-divider" />
      <div className="ss-bot-setting-condition-header ss-audience-conditions-content__header">
        <div className="ss-bot-setting-condition-header-left">
          <span className="ss-bot-setting-condition-icon-label">Standard</span>
          <span className="ss-bot-setting-condition-icon-label" style={{ width: '50px', backgroundColor: '#7A52A3' }}>Pro</span>
        </div>
      </div>
      <div className="ss-bot-setting-condition-sub-header">
        <span style={{ fontWeight: '400' }}>※設定すると、条件に当てはまるユーザーに対してのみ表示されます。</span>
      </div>
      <div className="ss-bot-setting-condition-contents">
        {conditions.map((condition, indexCondition) => (
          <div key={indexCondition} className="ss-bot-setting-condition-content-container">
            <div className="ss-bot-setting-condition-content">
              {indexCondition !== 0 ? (
                <SelectCustom
                  style={{ width: '14%' }}
                  data={[{ key: 'and', value: 'AND' }, { key: 'or', value: 'OR' }]}
                  value={condition.linkCondition}
                  onChange={(value) => onChangeValueCondition(indexCondition, value, 'linkCondition')}
                />
              ) : (
                <div style={{ width: '14%' }} />
              )}
              <SelectCustom
                style={{ width: '59%', marginBottom: '5px' }}
                data={dataCondition}
                value={condition.nameCondition}
                keyValue="variable_name"
                nameValue="variable_name"
                onChange={(value) => onChangeValueCondition(indexCondition, value, 'nameCondition')}
              />
              <SelectCustom
                style={{ width: '24%' }}
                data={dataSubCondition}
                value={condition.condition}
                onChange={(value) => onChangeValueCondition(indexCondition, value, 'condition')}
              />
              <InputCustom
                style={{ width: '100%' }}
                value={condition.inputCondition}
                onChange={(value) => onChangeValueCondition(indexCondition, value, 'inputCondition')}
              />
            </div>
            <div className="ss-bot-setting-condition-times-icon">
              <MDBIcon fas icon="times-circle" onClick={() => handleDeleteCondition(indexCondition)} />
            </div>
          </div>
        ))}
        {showAddButtonInContents && (
          <div className="ss-bot-setting-condition-add-condition-button">
            <Button onClick={() => onClickAddCondition()} className="ss-bot-setting-add-condition-button" style={{ backgroundColor: '#347AED' }}>
              条件追加
            </Button>
          </div>
        )}
      </div>
      {variant === 'bot' && (
        <div className="ss-bot-setting-condition-footer-button">
          <div className="ss-bot-setting-condition-add-condition-button">
            <Button onClick={() => onClickAddCondition()} className="ss-bot-setting-add-condition-button" style={{ backgroundColor: '#347AED' }}>
              条件追加
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

AudienceConditionsContent.propTypes = {
  variant: PropTypes.oneOf(['user', 'bot', 'combine']),
  selectedMessage: PropTypes.object,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  isUseFukushashiki: PropTypes.bool,
  onChangeAmazonPayDisplayMode: PropTypes.func.isRequired,
};

export default AudienceConditionsContent;

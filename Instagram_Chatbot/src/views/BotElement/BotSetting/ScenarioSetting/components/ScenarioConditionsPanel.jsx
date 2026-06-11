import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputCustom from '../scenarioComon/InputCustom';
import { dataSubCondition } from '../constants/scenarioFormConstants';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';

const ScenarioConditionsPanel = ({ variant = 'bot' }) => {
  const {
    indexMessageSelect,
    dataMessages,
    isConditionUp,
    dataCondition,
    handlePannelCondition,
    onChangeValueCondition,
    handleDeleteCondition,
    onClickAddCondition,
  } = useScenarioPanelDestructuring();

  const role = variant === 'user' ? 'user' : 'bot';
  const containerClass = variant === 'bot'
    ? 'ss-bot-setting-condition-container'
    : 'ss-user-setting-condition-container';

  return (
    <div className={containerClass}>
      <div className="ss-bot-setting-condition-header">
        <div className="ss-bot-setting-condition-header-left">
          <span style={{ fontWeight: '400' }}>表示対象者の条件設定</span>
          <MDBIcon far icon="question-circle" style={{ color: '#FF7E00', padding: '10px' }} />
          <span className="ss-bot-setting-condition-icon-label">Standard</span>
          <span className="ss-bot-setting-condition-icon-label" style={{ width: '50px', backgroundColor: '#7A52A3' }}>Pro</span>
        </div>
        <div className="ss-bot-setting-condition-header-right">
          {isConditionUp
            ? <MDBIcon fas icon="caret-up" onClick={() => handlePannelCondition(false, role)} />
            : <MDBIcon fas icon="caret-down" onClick={() => handlePannelCondition(true, role)} />}
        </div>
      </div>
      <div className="ss-bot-setting-condition-sub-header">
        <span style={{ fontWeight: '400' }}>※設定すると、条件に当てはまるユーザーに対してのみ表示されます。</span>
      </div>
      {isConditionUp && (
        <div className="ss-bot-setting-condition-contents">
          {dataMessages[indexMessageSelect]?.conditions
            && dataMessages[indexMessageSelect]?.conditions.map((condition, indexCondition) => (
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
          {variant === 'user' && isConditionUp && (
            <div className="ss-bot-setting-condition-add-condition-button">
              <Button onClick={() => onClickAddCondition()} className="ss-bot-setting-add-condition-button" style={{ backgroundColor: '#347AED' }}>
                条件追加
              </Button>
            </div>
          )}
        </div>
      )}
      {variant === 'bot' && (
        <div className="ss-bot-setting-condition-footer-button">
          {isConditionUp && (
            <div className="ss-bot-setting-condition-add-condition-button">
              <Button onClick={() => onClickAddCondition()} className="ss-bot-setting-add-condition-button" style={{ backgroundColor: '#347AED' }}>
                条件追加
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioConditionsPanel;

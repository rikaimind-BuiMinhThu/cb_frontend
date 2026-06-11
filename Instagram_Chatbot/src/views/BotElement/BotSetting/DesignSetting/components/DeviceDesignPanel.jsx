import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader, CardBody } from 'reactstrap';
import InputNum from '../../ScenarioSetting/scenarioComon/InputNum';
import { SELECT_STYLE } from '../constants/designChatbotConstants';

const DeviceDesignPanel = ({
  device,
  title,
  displayType,
  width,
  height,
  widthUnit,
  position,
  buttonType,
  rightTitle,
  rightMargin,
  bottomMargin,
  onChange,
}) => {
  const isPc = device === 'pc';
  const fieldPrefix = isPc ? 'Pc' : 'Sp';
  const rightTitleLabel = isPc ? '右のタイトル' : 'タイトル';

  return (
    <div style={{ width: '50%', ...(isPc ? { borderRight: '1px solid #ddd' } : {}) }}>
      <CardHeader>
        <h4 style={{ margin: '10px 0' }}>{title}</h4>
      </CardHeader>
      <CardBody>
        <div className="add-bot-container">
          <div className="bot-haft">
            {isPc && (
              <div className="field-add-bot">
                <div className="add-bot_field-container">
                  <span className="label-field">表示タイプ </span>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <select
                      style={SELECT_STYLE}
                      value={displayType}
                      onChange={(e) => onChange('displayType', Number(e.target.value))}
                    >
                      <option value={1}>リロード</option>
                      <option value={2}>非表示</option>
                      <option value={3}>ボタン押下</option>
                    </select>
                  </div>
                </div>
                <span className="error-message subtile" />
              </div>
            )}

            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">サイズ </span>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    ...(isPc ? {} : { padding: '0px' }),
                  }}
                >
                  <div className="ss-user-setting__item-bottom-flex-start">
                    <InputNum
                      style={{ display: 'flex', flex: 1 }}
                      name={`width_${device}`}
                      min={1}
                      max={isPc ? 1000 : 100}
                      value={width}
                      placeholder="幅"
                      onChange={(e) => onChange(`width${fieldPrefix}`, e)}
                    />
                    <p style={{ textAlign: 'center', margin: 'auto 0' }}>{widthUnit}</p>
                  </div>
                  <div className="ss-user-setting__item-bottom-flex-start">
                    <InputNum
                      style={{ display: 'flex', flex: 1 }}
                      name={`height_${device}`}
                      min={1}
                      max={isPc ? 1000 : 100}
                      value={height}
                      placeholder="高さ"
                      onChange={(e) => onChange(`height${fieldPrefix}`, e)}
                    />
                    <p style={{ textAlign: 'center', margin: 'auto 0' }}>{widthUnit}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">設置場所 </span>
                <div style={{ display: 'flex', width: '100%' }}>
                  <select
                    style={SELECT_STYLE}
                    value={position}
                    onChange={(e) => onChange(`position${fieldPrefix}`, Number(e.target.value))}
                  >
                    <option value={1}>底辺に設置</option>
                    <option value={2}>右辺に設置</option>
                  </select>
                </div>
              </div>
              <span className="error-message subtile" />
            </div>

            {position === 2 && (
              <div className="field-add-bot">
                <div className="add-bot_field-container">
                  <span className="label-field">{rightTitleLabel} </span>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <input
                      type="text"
                      name={`right_position_${device}_title`}
                      className="input-setting"
                      placeholder="タイトル"
                      value={rightTitle}
                      onChange={(e) => onChange(`right${fieldPrefix}Title`, e.target.value)}
                    />
                  </div>
                </div>
                <span className="error-message subtile" />
              </div>
            )}

            {position === 1 && (
              <div className="field-add-bot">
                <div className="add-bot_field-container">
                  <span className="label-field">ボタン内容 </span>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <select
                      style={SELECT_STYLE}
                      value={buttonType}
                      onChange={(e) => onChange(`buttonType${fieldPrefix}`, Number(e.target.value))}
                    >
                      <option value={1}>ボタンとタイトル</option>
                      <option value={2}>ボタンのみ</option>
                    </select>
                  </div>
                </div>
                <span className="error-message subtile" />
              </div>
            )}

            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">右マージン </span>
                <div style={{ display: 'flex', width: '100%' }}>
                  <input
                    type="number"
                    name={`right_margin_${device}`}
                    value={rightMargin}
                    className="input-setting"
                    placeholder="右マージン"
                    onChange={(e) => onChange(`rightMargin${fieldPrefix}`, e.target.value)}
                  />
                </div>
              </div>
              <span className="error-message subtile" />
            </div>

            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">下マージン </span>
                <div style={{ display: 'flex', width: '100%' }}>
                  <input
                    type="number"
                    name={`bottom_margin_${device}`}
                    value={bottomMargin}
                    className="input-setting"
                    placeholder="下マージン"
                    onChange={(e) => onChange(`bottomMargin${fieldPrefix}`, e.target.value)}
                  />
                </div>
              </div>
              <span className="error-message subtile" />
            </div>
          </div>
        </div>
      </CardBody>
    </div>
  );
};

DeviceDesignPanel.propTypes = {
  device: PropTypes.oneOf(['pc', 'sp']).isRequired,
  title: PropTypes.string.isRequired,
  displayType: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  widthUnit: PropTypes.oneOf(['px', '%']).isRequired,
  position: PropTypes.number.isRequired,
  buttonType: PropTypes.number.isRequired,
  rightTitle: PropTypes.string.isRequired,
  rightMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bottomMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DeviceDesignPanel;

import React from 'react';
import PropTypes from 'prop-types';
import { CardBody } from 'reactstrap';

const BubbleSettingsSection = ({ titleBubble, popupCloseBot, onChange }) => (
  <div style={{ width: '50%', paddingLeft: '40px' }}>
    <CardBody>
      <div className="add-bot-container">
        <div className="bot-haft">
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <span className="label-field">タイトル</span>
              <div style={{ display: 'flex', width: '100%' }}>
                <input
                  type="text"
                  name="title_bubble"
                  value={titleBubble}
                  className="input-setting"
                  placeholder="簡単90秒で注文完了"
                  onChange={(e) => onChange('titleBubble', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <span className="label-field">離脱防止</span>
              <span className="d-flex" style={{ width: '100%' }}>
                <input
                  name="popup_close_bot"
                  type="radio"
                  id="in_active"
                  className="in_active_popup"
                  value={false}
                  checked={!popupCloseBot}
                  onChange={() => onChange('popupCloseBot', false)}
                />
                <label htmlFor="in_active" className="radio-btn-action">
                  無効
                </label>
                <input
                  name="popup_close_bot"
                  className="active_popup"
                  type="radio"
                  id="active"
                  value
                  checked={popupCloseBot}
                  onChange={() => onChange('popupCloseBot', true)}
                />
                <label htmlFor="active" className="radio-btn-action">
                  有効
                </label>
              </span>
            </div>
          </div>
        </div>
      </div>
    </CardBody>
  </div>
);

BubbleSettingsSection.propTypes = {
  titleBubble: PropTypes.string.isRequired,
  popupCloseBot: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BubbleSettingsSection;

import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import '../../../../../../assets/css/bot/preview-chat-bot.css';

const resolveIcon = (...candidates) => candidates.find(Boolean) || '';

const BasicInfoStatePreview = ({
  mainColor,
  title,
  subtitle,
  botImage,
  openingBotIcon,
  closingBotIcon,
}) => {
  const openIcon = resolveIcon(openingBotIcon, botImage);
  const closeIcon = resolveIcon(closingBotIcon, openingBotIcon, botImage);

  return (
    <div className="basic-info-state-preview">
      <div className="basic-info-state-preview__section">
        <h6 className="basic-info-state-preview__title">チャットを閉じたとき</h6>
        <div className="basic-info-state-preview__frame basic-info-state-preview__frame--close">
          <div className="basic-info-state-preview__launcher">
            {closeIcon ? (
              <img src={closeIcon} alt="" className="basic-info-state-preview__launcher-icon" />
            ) : (
              <span className="basic-info-state-preview__launcher-placeholder">アイコン</span>
            )}
          </div>
        </div>
      </div>

      <div className="basic-info-state-preview__section">
        <h6 className="basic-info-state-preview__title">チャットを開いたとき</h6>
        <div className="basic-info-state-preview__frame basic-info-state-preview__frame--open">
          <div
            className="basic-info-state-preview__widget sp-container"
            style={{ backgroundColor: '#EBF7FF' }}
          >
            <div
              className="sp-header"
              style={{ backgroundColor: mainColor }}
            >
              <div className="sp-header-left">
                <div className="sp-header-left-avatar sp-avatar">
                  {openIcon ? <img src={openIcon} alt="" /> : null}
                </div>
                <div className="sp-header-left-label">
                  <div className="sp-header-left-label-sub-title">{subtitle || 'サブタイトル'}</div>
                  <div className="sp-header-left-label-title">{title || 'タイトル'}</div>
                </div>
              </div>
              <div className="sp-header-right">
                <div className="sp-header-right-arrow">
                  <MDBIcon fas icon="chevron-down" />
                </div>
              </div>
            </div>
            <div className="sp-body basic-info-state-preview__body" />
          </div>
        </div>
      </div>
    </div>
  );
};

BasicInfoStatePreview.propTypes = {
  mainColor: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  botImage: PropTypes.string,
  openingBotIcon: PropTypes.string,
  closingBotIcon: PropTypes.string,
};

BasicInfoStatePreview.defaultProps = {
  mainColor: '#327AED',
  title: '',
  subtitle: '',
  botImage: '',
  openingBotIcon: '',
  closingBotIcon: '',
};

export default BasicInfoStatePreview;

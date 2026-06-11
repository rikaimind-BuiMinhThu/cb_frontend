import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';

const ChatbotPreview = ({
  isOpen,
  isOpenBot,
  mainColor,
  title,
  subtitle,
  botImage,
  onToggle,
}) => (
  <div
    id="sp-container"
    className="sp-container"
    style={{ display: !isOpen && 'none' }}
  >
    <div
      id="sp-header"
      style={{ backgroundColor: mainColor }}
      className="sp-header"
      onClick={onToggle}
    >
      <div className="sp-header-left">
        <div className="sp-header-left-avatar sp-avatar">
          <img src={botImage} alt="" />
        </div>
        <div className="sp-header-left-label">
          <div className="sp-header-left-label-sub-title">{subtitle}</div>
          <div className="sp-header-left-label-title">{title}</div>
        </div>
      </div>
      <div className="sp-header-right">
        <div className="sp-header-right-arrow">
          {isOpenBot ? (
            <MDBIcon fas icon="chevron-down" />
          ) : (
            <MDBIcon fas icon="chevron-up" />
          )}
        </div>
      </div>
    </div>
    <div id="sp-body" className="sp-body" />
  </div>
);

ChatbotPreview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenBot: PropTypes.bool.isRequired,
  mainColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  botImage: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
};

export default ChatbotPreview;

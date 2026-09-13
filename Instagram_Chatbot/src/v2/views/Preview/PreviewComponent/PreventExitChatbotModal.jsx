import React from "react";
import ReactDom from 'react-dom';
import "v2/assets/css/bot/preview-chat-bot.css";
import { Row, Col } from "antd";
import { Button } from "reactstrap";
import {isMobile} from "./Utils";
import {
  isWithdrawalPreventionEnabled,
  WITHDRAWAL_STATUS_IMAGE,
  WITHDRAWAL_STATUS_STANDARD,
} from "./previewWithdrawalUtils";

const PreventExitChatbotModal = ({ isOpen, onClose, onCloseBot, botConfig }) => {
  const modalClassName = isMobile() ? "ss-bot-prevent-exit-chatbot-modal-sp" : "ss-bot-prevent-exit-chatbot-modal-pc";
  const {widthSp, heightSp, widthPc, heightPc, bottomMarginPc, rightMarginPc, botInfor} = botConfig;
  const modalCssVars = {
    '--prevent-exit-width': isMobile() ? `${widthSp || 100}%` : `${widthPc || 450}px`,
    '--prevent-exit-height': isMobile() ? `${heightSp || 100}%` : `${heightPc || 700}px`,
    '--prevent-exit-bottom': isMobile() ? `0px` : `${bottomMarginPc || 0}px`,
    '--prevent-exit-right': isMobile() ? `0px` : `${rightMarginPc || 30}px`,
  };

  if (!isOpen) return null;

  const isPopUpDisPlayed = isWithdrawalPreventionEnabled(botInfor?.withdrawal_prevention_status)
  if (!isPopUpDisPlayed) return null;
  const {
    withdrawal_prevention_status: preventionStatus,
    withdrawal_prevention_link_url: preventionLinkUrl,
    withdrawal_prevention_image_url: preventionImageUrl,
  } = botInfor;

  const renderMessagePopup = () => {
    if (preventionStatus !== WITHDRAWAL_STATUS_STANDARD) return null;
    return (
      <span className="title-bot-modal">本当に閉じますか？</span>
    );
  };

  const renderImagePopup = () => {
    if (preventionStatus !== WITHDRAWAL_STATUS_IMAGE) return null;
    if (!preventionLinkUrl) {
      return (
        <img
          src={preventionImageUrl}
          className="ss-bot-prevent-exit-chatbot-modal-image"
          alt="prevention"
        />
      );
    }
    return (
      <a
        href={preventionLinkUrl || ""}
        target="_blank" rel="noreferrer"
      >
        <img
          src={preventionImageUrl}
          alt=""
          className="ss-bot-prevent-exit-chatbot-modal-image"
        />
      </a>
    );
  };

  return ReactDom.createPortal(
    <>
      <div className="ss-bot-prevent-exit-chatbot-modal-container" onClick={onClose} />
      <div className="ss-bot-prevent-exit-chatbot-modal-frame" style={modalCssVars}>
        <div className={`ss-bot-prevent-exit-chatbot-modal ${modalClassName}`}>
          <Row>
            <Col span={24} className="ss-bot-prevent-exit-modal-title-col">
              {renderMessagePopup()}
              {renderImagePopup()}
            </Col>
          </Row>

          <Row className="justify-content-around">
            <Col md="6">
              <Button className="btn-cancel__modal-bot" onClick={onClose}>
                チャットに戻る
              </Button>
            </Col>
            <Col md="6">
              <Button className="btn-close__modal-bot" onClick={onCloseBot}>
                閉じる
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default PreventExitChatbotModal;
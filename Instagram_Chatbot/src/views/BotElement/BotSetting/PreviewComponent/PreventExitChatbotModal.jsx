import React from "react";
import ReactDom from 'react-dom';
import "assets/css/bot/preview-chat-bot.css";
import { Row, Col } from "antd";
import { Button } from "reactstrap";
import {isMobile} from "./Utils";

const PreventExitChatbotModal = ({ isOpen, onClose, onCloseBot, botConfig }) => {
  const modalClassName = isMobile() ? "ss-bot-prevent-exit-chatbot-modal-sp" : "ss-bot-prevent-exit-chatbot-modal-pc";
  const {widthSp, heightSp, widthPc, heightPc, bottomMarginPc, rightMarginPc, botInfor} = botConfig;
  const modalStyle = {
    position: 'absolute',
    width: isMobile() ? `${widthSp || 100}%` : `${widthPc || 450}px`,
    height: isMobile() ? `${heightSp || 100}%` : `${heightPc || 700}px`,
    bottom: isMobile() ? `0px` : `${bottomMarginPc || 0}px`,
    right: isMobile() ? `0px` : `${rightMarginPc || 30}px`,
  };

  if (!isOpen) return null;

  const isPopUpDisPlayed = ["standard_exit_popup", "image_popup"].includes(botInfor?.withdrawal_prevention_status)
  if (!isPopUpDisPlayed) return null;
  const {
    withdrawal_prevention_status: preventionStatus,
    withdrawal_prevention_link_url: preventionLinkUrl,
    withdrawal_prevention_image_url: preventionImageUrl,
  } = botInfor;

  const renderMessagePopup = () => {
    if (preventionStatus !== "standard_exit_popup") return null;
    return (
      <span className="title-bot-modal">本当に閉じますか？</span>
    );
  };

  const renderImagePopup = () => {
    if (preventionStatus !== "image_popup") return null;
    if (!preventionLinkUrl) {
      return (
        <img
          src={preventionImageUrl}
          style={{ width: "100%", height: "auto" }}
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
          style={{ width: "100%", height: "auto" }}
        />
      </a>
    );
  };

  return ReactDom.createPortal(
    <>
      <div className="ss-bot-prevent-exit-chatbot-modal-container" onClick={onClose} />
      <div style={modalStyle}>
        <div className={`ss-bot-prevent-exit-chatbot-modal ${modalClassName}`}>
          <Row>
            <Col md="12">
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
import React from "react";
import ReactDom from "react-dom";
import "v2/assets/css/bot/preview-chat-bot.css";
import { Row, Col } from "antd";
import { Button } from "reactstrap";
import {
  normalizeWithdrawalPreventionStatus,
  WITHDRAWAL_POPUP_STATUS,
} from "./preventExitModalUtils";

const MODAL_THEME_VARS = [
  "--c-modal-bg",
  "--c-modal-title-text",
  "--c-modal-title-font-size",
  "--c-modal-title-align",
  "--c-modal-cancel-btn-bg",
  "--c-modal-cancel-btn-text",
  "--c-modal-cancel-btn-border",
  "--c-modal-close-btn-bg",
  "--c-modal-close-btn-text",
  "--c-modal-btn-font-size",
];

const readModalThemeStyle = () => {
  const source = document.getElementById("sp-container1");
  if (!source) return undefined;
  const computed = getComputedStyle(source);
  const style = {};
  MODAL_THEME_VARS.forEach((name) => {
    const value = computed.getPropertyValue(name).trim();
    if (value) style[name] = value;
  });
  return style;
};

const PreventExitChatbotModal = ({ isOpen, onClose, onCloseBot, botConfig }) => {
  if (!isOpen) return null;

  const botInfor = botConfig?.botInfor || {};
  const preventionStatus = normalizeWithdrawalPreventionStatus(
    botInfor.withdrawal_prevention_status,
  );
  const showImagePopup = preventionStatus === WITHDRAWAL_POPUP_STATUS.IMAGE;
  const portalRoot = document.body;
  if (!portalRoot) return null;

  const {
    withdrawal_prevention_link_url: preventionLinkUrl,
    withdrawal_prevention_image_url: preventionImageUrl,
  } = botInfor;

  const renderBody = () => {
    if (showImagePopup && preventionImageUrl) {
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
        <a href={preventionLinkUrl} target="_blank" rel="noreferrer">
          <img
            src={preventionImageUrl}
            style={{ width: "100%", height: "auto" }}
            alt="prevention"
          />
        </a>
      );
    }

    return (
      <span className="title-bot-modal">本当に閉じますか？</span>
    );
  };

  return ReactDom.createPortal(
    <div className="ss-bot-prevent-exit-root" role="dialog" aria-modal="true" style={readModalThemeStyle()}>
      <div className="ss-bot-prevent-exit-chatbot-modal-container" onClick={onClose} />
      <div className="ss-bot-prevent-exit-chatbot-modal-layer">
        <div className="ss-bot-prevent-exit-chatbot-modal ss-bot-prevent-exit-chatbot-modal-pc">
          <Row>
            <Col span={24} className="ss-bot-prevent-exit-modal-title-col">
              {renderBody()}
            </Col>
          </Row>
          <Row className="justify-content-around">
            <Col xs="6" md="6">
              <Button className="btn-cancel__modal-bot" onClick={onClose}>
                チャットに戻る
              </Button>
            </Col>
            <Col xs="6" md="6">
              <Button className="btn-close__modal-bot" onClick={onCloseBot}>
                閉じる
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>,
    portalRoot,
  );
};

export default PreventExitChatbotModal;

import React, {  } from "react";
import "assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";
import { sendCountRequest } from "./Utils";

const Withdrawal = ({
  botInfor,
  deviceReceive,
  scenarioId,
  onOpenPreview,
}) => {
  if (!botInfor) return <></>;

  const renderMessagePopup = () => {
    if (!botInfor.withdrawal_prevention_status === "standard_exit_popup") return;
    return (
      <div>ウィンドウを閉じますか。</div>
    );
  };

  const renderImagePopup = () => {
    if (!botInfor.withdrawal_prevention_status === "image_popup") return;
    return (
      <a
        href={botInfor.withdrawal_prevention_link_url || ""}
        target="_blank" rel="noreferrer"
      >
        <img
          src={botInfor.withdrawal_prevention_image_url}
          style={{ maxHeight: "217px", width: "100%" }}
        />
      </a>
    );
  };

  const sendInteractionData = () => {
    const withdrawal = {
      scenario_data: `${deviceReceive}_close_chatbot_window`,
    };
    sendCountRequest(scenarioId, withdrawal);
  }

  const onReturnChatBtnClick = () => {
    document.getElementById("sp-withdrawal-container").style.display = "none";
    document.getElementById("sp-withdrawal-content").style.display = "none";
  };

  const onCloseBtnClick = () => {
    document.getElementById("sp-withdrawal-container").style.display = "none";
    document.getElementById("sp-withdrawal-content").style.display = "none";

    if (document.getElementById("action-bd")) {
      document.getElementById("action-bd").click();
      sendInteractionData();
    } else {
      sendInteractionData();
      onOpenPreview(false);
    }
  };

  return (
    <>
      <div
        id="sp-withdrawal-container"
        className="sp-withdrawal-container"
      ></div>
      <div id="sp-withdrawal-content" className="sp-withdrawal-content">
        <div className="sp-withdrawal-content-body">
          {renderMessagePopup()}
          {renderImagePopup()}
        </div>
        <div className="sp-withdrawal-content-footer">
          <div
            className="sp-withdrawal-content-footer-button sp-withdrawal-content-footer-button-back"
            onClick={() =>onReturnChatBtnClick()}
          >
            チャットに戻る
          </div>
          <div
            className="sp-withdrawal-content-footer-button sp-withdrawal-content-footer-button-exit"
            onClick={() => onCloseBtnClick()}
          >
            閉じる
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdrawal;
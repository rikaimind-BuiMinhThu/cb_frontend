import React, { useEffect, useRef } from "react";
import "assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";
import { sendCountRequest } from "./Utils";

const Withdrawal = ({
  botInfor,
  deviceReceive,
  scenarioId,
  onOpenPreview,
}) => {
  const timerRef = useRef(null)

  useEffect(()=>{
    if(timerRef.current){
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const isPopUpDisPlayed = botInfor?.withdrawal_prevention_status === "standard_exit_popup" || botInfor?.withdrawal_prevention_status === "image_popup"
    if(isPopUpDisPlayed){
      const hidePopUp = () => {
        const container = document.getElementById("sp-withdrawal-container")
        const content = document.getElementById("sp-withdrawal-content")
        if(container){
          container.style.display = "none";
        } if(content){
          content.style.display = "none";
        }
      }

      timerRef.current = setTimeout(hidePopUp, 10000);

      const resetTimer = () => {
        if(timerRef.current){
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(hidePopUp, 10000);
      }

      const contentElement = document.getElementById("sp-withdrawal-content");

      if(contentElement){
        contentElement.addEventListener("mousemove", resetTimer);
        contentElement.addEventListener("mousedown", resetTimer);
        contentElement.addEventListener("touchstart", resetTimer);
        contentElement.addEventListener("keydown", resetTimer);
      }

      return () => {
        if(timerRef.current){
          clearTimeout(timerRef.current)
          timerRef.current = null;
        }

        if(contentElement){
          contentElement.removeEventListener("mousemove", resetTimer);
          contentElement.removeEventListener("mousedown", resetTimer);
          contentElement.removeEventListener("touchstart", resetTimer);
          contentElement.removeEventListener("keydown", resetTimer);
        }
      }
    }
  }, [botInfor?.withdrawal_prevention_status])

  if (!botInfor) return <></>;

  const renderMessagePopup = () => {
    if (botInfor.withdrawal_prevention_status !== "standard_exit_popup") return null;
    return (
      <div>ウィンドウを閉じますか。</div>
    );
  };

  const renderImagePopup = () => {
    if (botInfor.withdrawal_prevention_status !== "image_popup") return null;
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
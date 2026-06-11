import React from 'react';
import { Button } from 'reactstrap';

const ButtonSubmitPreview = ({
  content,
  message,
  indexContent,
}) => {
  const buttonSubmit = content.button_submit;
  return (
    <>
      {content.type === 'button_submit' &&
        <>
          {buttonSubmit.is_display_error_message &&
            <div className="ss-user-setting__item-text_input-top">
              <div style={{
                width: "92%",
                padding: "5px",
                border: "1px solid #f44336",
                backgroundColor: "#ffebee",
                color: "#d32f2f",
                borderRadius: "5px",
                fontFamily: "Arial, sans-serif",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                margin: "8px",
              }}
              >
                {"エラーが発生しました。もう一度お試しください。"}
              </div>
            </div>
          }
          <div className="ss-user-setting__item-text_input-top">
            <Button
              data-id={message?.message_content[indexContent]?.['button_submit_id'] ?? content.button_submit_id}
              className="ss-user-setting__select-btn-add"
              style={{
                background: "linear-gradient(135deg, #4caf50, #43a047)",
                color: "#fff",
                border: "none",
                borderRadius: "25px",
                padding: "15px 30px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                margin: '5px',
                width: "95%",
                alignContent: "center",
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {content.button_submit_name}
            </Button>
          </div>
        </>
      }
    </>
  );
};

export default ButtonSubmitPreview;

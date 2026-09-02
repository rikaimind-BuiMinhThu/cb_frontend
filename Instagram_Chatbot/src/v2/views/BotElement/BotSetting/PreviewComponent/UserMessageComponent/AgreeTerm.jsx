import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "../Constants";
import CheckboxCustom from "v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/CheckboxCustom";

export default function AgreeTerm({ content, messageIndex, contentIndex, onChangeValue, errors, disabled }) {
if (!content || content.type !== MESSAGE_CONTENT_TYPES.AGREE_TERM) return null;

  const agreeTerm = content.agree_term;

  const renderTitle = () => {
    if (!agreeTerm.title_require && !agreeTerm.require) return null;

    return (
      <div className="ss-message__content--user-agree_to_term-top m-b-0">
        {agreeTerm.title_require && (
          <span className="ss-message__content--user-agree_to_term-title">
            {agreeTerm.title}
          </span>
        )}
        {agreeTerm.require && (
          <span className="ss-message__content--user-text-input-required">
            ※必須
          </span>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (agreeTerm.type) {
      case "detail_content":
        return renderDetailContent();
      case "post_link_only":
        return renderPostLinkOnly();
      default:
        return null;
    }
  };

  const renderDetailContent = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-agree_to_term-detail_content">
          <textarea
            name="ss-message__content--user-agree_to_term-detail_content"
            id=""
            rows={agreeTerm[agreeTerm.type].content?.length > 200 ? 8 : 5}
            value={agreeTerm[agreeTerm.type].content}
            className="ss-input-value"
            readOnly
          ></textarea>
          <CheckboxCustom
            disabled={disabled}
            label={agreeTerm.term}
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "isAgree"
              )
            }
            value={agreeTerm.isAgree}
          />
        </div>
      </React.Fragment>
    );
  };

  const renderPostLinkOnly = () => {
    return (
      <div>
        {agreeTerm[agreeTerm.type].map((item, index) => {
          return (
            <div key={index}
              className="ss-message__content--user-agree_to_term-post_link_only"
            >
              <span className="m-r-8">
                {item.title_comment}
              </span>
              <a href={item.urls} target="_blank" rel="noreferrer">
                {item.title}
              </a>
              <span className="m-l-8">
                {item.url_comment}
              </span>
            </div>
          );
        })}
        <CheckboxCustom
          disabled={disabled}
          onChange={(value) =>
            onChangeValue(
              contentIndex,
              content.type,
              value,
              "isAgree"
            )
          }
          value={agreeTerm.isAgree}
          label={agreeTerm.term}
        />
      </div>
    );
  };
  
  const renderErrorMessage = () => {
    const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;
    if (!errors?.[errorKey]) return null;

    return (
      <div className="validation-error-message">
        {errors?.[errorKey]}
      </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderTitle()}
      {renderContent()}
      {renderErrorMessage()}
    </div>
  );
};
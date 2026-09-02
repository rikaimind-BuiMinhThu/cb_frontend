import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import 'v2/assets/css/bot/preview-chat-bot.css';
import { getElementMessageById } from 'v2/views/BotElement/BotSetting/PreviewComponent/Utils';
import { useScenarioEditor } from '../context/ScenarioEditorContext';
import { getBotFileExtension } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/getBotMessageTitle';
import UserContentPreviewList from './overview/UserContentPreviewList';
import CombineOverviewBlockPreview from './overview/CombineOverviewBlockPreview';
import ScenarioThemeBotMessageContent from './ScenarioThemeBotMessageContent';

const shouldShowNextButton = (message) => {
  const contents = message?.message_content ?? [];
  if (message.not_use_button || contents.length === 0) return false;
  if (contents[0]?.type === 'button_submit' || contents[0]?.type === 'contact_form') return false;
  if (contents.length > 1) return true;
  const first = contents[0];
  const isSelfNavigating =
    first.type === 'product_purchase_radio_button'
    || (first.type === 'carousel' && first.carousel?.require)
    || (first.type === 'radio_button' && !first.radio_button?.initial_selection);
  return !isSelfNavigating;
};

const NextButton = ({ label }) => (
  <div className="ss-user-message__action-wrapper">
    <Button className="ss-user-message__action-btn" disabled>
      {label || '次へ'}
    </Button>
  </div>
);

NextButton.propTypes = {
  label: PropTypes.string,
};

NextButton.defaultProps = {
  label: '',
};

const ScenarioThemePreviewBody = () => {
  const { state } = useScenarioEditor();
  const { dataMessages } = state;

  const messages = dataMessages || [];
  const visibleCount = messages.filter((message) => !message.hidden).length;

  if (visibleCount === 0) {
    return (
      <div className="sp-body-bot-side">
        <div className="sp-body-bot-side-messages">
          <div className="ss-bot-message">
            <div className="ss-bot-message__content-wrapper theme-customize-preview__bot-bubble">
              メッセージがありません
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => {
        if (message.hidden) return null;

        if (message.belong_to === 'bot') {
          const content = message.message_content?.[0];
          const fileType = getBotFileExtension(content);

          return (
            <div key={message.id ?? index} className="sp-body-bot-side">
              <div className="sp-body-bot-side-messages">
                <div className="ss-bot-message">
                  <div className="ss-bot-message__content-wrapper">
                    <ScenarioThemeBotMessageContent
                      content={content}
                      fileType={fileType}
                      hidden={message.hidden}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (message.belong_to === 'combine') {
          const contentGap = message.combine_message?.content_gap ?? 10;

          return (
            <div
              key={message.id ?? index}
              className="ss-combine-message__wrapper ss-combine-message__wrapper--theme"
              id={getElementMessageById(message.id)}
            >
              {message.message_content.map((content, indexContent) => (
                <div
                  key={content.id ?? indexContent}
                  style={indexContent > 0 ? { marginTop: `${contentGap}px` } : undefined}
                >
                  <CombineOverviewBlockPreview
                    content={content}
                    message={message}
                    indexMessage={index}
                    indexContent={indexContent}
                    hidden={message.hidden}
                  />
                </div>
              ))}
              {shouldShowNextButton(message) && (
                <NextButton label={message.buttonName} />
              )}
            </div>
          );
        }

        return (
          <div
            key={message.id ?? index}
            className="sp-body-user-side"
            id={getElementMessageById(message.id)}
          >
            <div className="sp-body-user-side-messages">
              <div className="ss-user-message__content-wrapper">
                <UserContentPreviewList message={message} index={index} />
                {shouldShowNextButton(message) && (
                  <NextButton label={message.buttonName} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ScenarioThemePreviewBody;

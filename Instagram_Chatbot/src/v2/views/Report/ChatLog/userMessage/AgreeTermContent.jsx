/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import CheckboxCustom from 'v2/components/BotMessages/CheckboxCustom';
import {
  REQUIRED_LABEL,
  AGREE_TERM_TYPE,
  LINK_TARGET_BLANK,
  REL_NOREFERRER,
} from './constants';


const AgreeTermContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
}) => {
  const agreeTerm = content.agree_term;
  if (!agreeTerm) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {/* {(agreeTerm.title_require || agreeTerm.require) && */}
                    <div
                      className="ss-message__content--user-agree_to_term-top chat-log-um-mb-0"
                  
                    >
                      {agreeTerm.title_require && (
                        <span className="ss-message__content--user-agree_to_term-title">
                          {agreeTerm.title}
                        </span>
                      )}
                      <span className="ss-message__content--user-text-input-required">
                        {REQUIRED_LABEL}
                      </span>
                    </div>
                    {/* } */}
                    {/* agreeTerm: type = 'detail_content' */}
                    {agreeTerm.type === AGREE_TERM_TYPE.DETAIL_CONTENT && (
                      <React.Fragment>
                        <div className="ss-message__content--user-agree_to_term-detail_content">
                          <textarea
                            name="ss-message__content--user-agree_to_term-detail_content"
                            id=""
                            rows={
                              agreeTerm[agreeTerm.type].content?.length > 200
                                ? 8
                                : 5
                            }
                            value={agreeTerm[agreeTerm.type].content}
                            className="ss-input-value"
                            readOnly
                          ></textarea>
                          <CheckboxCustom
                            disabled={true}
                            label={agreeTerm.term}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "isAgree"
                              )
                            }
                            value={agreeTerm.isAgree}
                          />
                        </div>
                      </React.Fragment>
                    )}
                    {/* agreeTerm: type = 'post_link_only' */}
                    {agreeTerm.type === AGREE_TERM_TYPE.POST_LINK_ONLY && (
                      <div>
                        {agreeTerm[agreeTerm.type].map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="ss-message__content--user-agree_to_term-post_link_only"
                            >
                              <span className="chat-log-um-mr-8" >
                                {item.title_comment}
                              </span>
                              <a href={item.urls} target={LINK_TARGET_BLANK} rel={REL_NOREFERRER}>
                                {item.title}
                              </a>
                              <span className="chat-log-um-ml-8" >
                                {item.url_comment}
                              </span>
                            </div>
                          );
                        })}
                        <CheckboxCustom
                          disabled={true}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "isAgree"
                            )
                          }
                          value={agreeTerm.isAgree}
                          label={agreeTerm.term}
                        />
                      </div>
                    )}
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}`
                    ] && (
                      <div className="chat-log-um-error" >
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}`
                          ]
                        }
                      </div>
                    )}
                  </div>
  );
};

AgreeTermContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default AgreeTermContent;

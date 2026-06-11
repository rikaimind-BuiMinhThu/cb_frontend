import React from 'react';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';

const AgreeTermPreview = ({
  content,
  message,
  indexContent,
}) => {
  const agreeTerm = content.agree_term;
  return (
    <>
      {
        content.type === 'agree_term' && (
          <div style={{ marginBottom: '10px' }}>
            {/* {(agreeTerm.title_require || agreeTerm.require) && */}
            <div className="ss-message__content--user-agree_to_term-top" style={{ marginBottom: '0px' }}>
              {agreeTerm.title_require &&
                <span className="ss-message__content--user-agree_to_term-title">
                  {agreeTerm.title}
                </span>
              }
              <span className="ss-message__content--user-text-input-required">
                ※必須
              </span>
            </div>
            {/* } */}
            {/* agreeTerm: type = 'detail_content' */}
            {agreeTerm.type === 'detail_content' && (
              <React.Fragment>
                <div className="ss-message__content--user-agree_to_term-detail_content">
                  <textarea
                    name="ss-message__content--user-agree_to_term-detail_content"
                    id=""
                    rows="5"
                    value={agreeTerm[agreeTerm.type].content}
                    className="ss-input-value"
                    readOnly
                  ></textarea>
                  <CheckboxCustom
                    onChange={value => console.log(value)}
                    label={agreeTerm.term}
                  />
                </div>
              </React.Fragment>
            )}
            {/* agreeTerm: type = 'post_link_only' */}
            {agreeTerm.type === 'post_link_only' && (
              <div>
                {agreeTerm[agreeTerm.type].map((item, index) => {
                  return <div key={index} className="ss-message__content--user-agree_to_term-post_link_only">
                    <span style={{ marginRight: '8px' }}>{item.title_comment}</span>
                    <a href={item.urls} target="_blank">{item.title}</a>
                    <span style={{ marginLeft: '8px' }}>{item.url_comment}</span>
                  </div>
                })}
                <CheckboxCustom
                  onChange={value => console.log(value)}
                  label={agreeTerm.term}
                />
              </div>
            )}
          </div>
        )
      }
    </>
  );
};

export default AgreeTermPreview;

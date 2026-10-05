import React from 'react';
import { MDBIcon } from 'mdbreact';

const OverviewMessageActions = ({
  index,
  message,
  belongTo,
  contentType,
  messageName,
  onEditIconClick,
  onCopyMessage,
  onHiddenMessage,
  onDeleteMessage,
  emptyContent = false,
}) => {
  const optionStyle = belongTo === 'bot' && contentType !== 'text_input'
    ? { marginTop: '25px' }
    : messageName
      ? { marginTop: '25px' }
      : {};

  return (
    <div className="ss-chat-option" style={optionStyle}>
      <MDBIcon fas icon="pencil-alt" onClick={() => onEditIconClick(index)} />
      <MDBIcon fas icon="grip-vertical" style={{ marginTop: '10px' }} />
      <div className={`ss-edit-option-wrapper ss-edit-option-wrapper-${index}`}>
        <div onClick={() => onCopyMessage(index)} className="ss-option-wrapper">
          <MDBIcon fas icon="copy" className="ss-add-option-icon" />
          <span>コピー</span>
        </div>
        {emptyContent ? (
          <>
            <div className="ss-option-wrapper">
              <MDBIcon fas icon="eye-slash" className="ss-add-option-icon" />
              <span>無効にする</span>
            </div>
            <div className="ss-option-wrapper">
              <MDBIcon fas icon="trash" className="ss-add-option-icon" />
              <span>削除</span>
            </div>
          </>
        ) : (
          <>
            <div className="ss-option-wrapper" onClick={() => onHiddenMessage(index, belongTo)}>
              {message.hidden ? (
                <>
                  <MDBIcon fas icon="angle-double-up" className="ss-add-option-icon" />
                  <span>有効にする</span>
                </>
              ) : (
                <>
                  <MDBIcon fas icon="eye-slash" className="ss-add-option-icon" />
                  <span>無効にする</span>
                </>
              )}
            </div>
            <div className="ss-option-wrapper" onClick={() => onDeleteMessage(index)}>
              <MDBIcon fas icon="trash" className="ss-add-option-icon" />
              <span>削除</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OverviewMessageActions;

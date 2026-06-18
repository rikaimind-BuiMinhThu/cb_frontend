import React from 'react';
import { MDBIcon } from 'mdbreact';

const OverviewAddStatementMenu = ({ index, onCreateStatement }) => (
  <div className="ss-add-action-wrapper">
    <MDBIcon fas icon="plus-circle" className="ss-add-icon" />
    <div className="ss-add-message-option-wrapper">
      <div className="ss-option-wrapper" onClick={() => onCreateStatement('bot', index)}>
        <MDBIcon fas icon="comment" className="ss-add-option-icon" />
        <span>ボット発言</span>
      </div>
      <div className="ss-option-wrapper" onClick={() => onCreateStatement('user', index)}>
        <MDBIcon fas icon="comment" className="ss-add-option-icon" />
        <span>ユーザ入力</span>
      </div>
      <div className="ss-option-wrapper" onClick={() => onCreateStatement('combine', index)}>
        <MDBIcon fas icon="comment" className="ss-add-option-icon" />
        <span>結合メッセージ</span>
      </div>
    </div>
  </div>
);

export default OverviewAddStatementMenu;

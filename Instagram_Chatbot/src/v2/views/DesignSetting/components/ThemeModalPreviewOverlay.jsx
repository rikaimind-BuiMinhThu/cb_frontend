import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Button } from 'reactstrap';
import PreviewRegion from './PreviewRegion';
import {
  MODAL_BACK_TO_CHAT,
  MODAL_CLOSE,
  MODAL_CLOSE_CONFIRM,
} from '../constants/designChatbotConstants';

const ThemeModalPreviewOverlay = ({
  activeSectionId,
  onSectionSelect,
}) => (
  <PreviewRegion
    sectionId="modal"
    activeSectionId={activeSectionId}
    onSectionSelect={onSectionSelect}
    className="theme-customize-preview__modal-overlay"
  >
    <div className="theme-customize-preview__prevent-exit-overlay" aria-hidden="true" />
    <div className="ss-bot-prevent-exit-chatbot-modal ss-bot-prevent-exit-chatbot-modal-pc theme-customize-preview__prevent-exit-panel">
      <Row className="theme-customize-preview__modal-title-row">
        <Col span={24} className="theme-customize-preview__modal-title-col">
          <span className="title-bot-modal">{MODAL_CLOSE_CONFIRM}</span>
        </Col>
      </Row>
      <Row className="justify-content-around">
        <Col md="6">
          <Button type="button" className="btn-cancel__modal-bot" tabIndex={-1}>
            {MODAL_BACK_TO_CHAT}
          </Button>
        </Col>
        <Col md="6">
          <Button type="button" className="btn-close__modal-bot" tabIndex={-1}>
            {MODAL_CLOSE}
          </Button>
        </Col>
      </Row>
    </div>
  </PreviewRegion>
);

ThemeModalPreviewOverlay.propTypes = {
  activeSectionId: PropTypes.string,
  onSectionSelect: PropTypes.func,
};

ThemeModalPreviewOverlay.defaultProps = {
  activeSectionId: '',
  onSectionSelect: null,
};

export default ThemeModalPreviewOverlay;

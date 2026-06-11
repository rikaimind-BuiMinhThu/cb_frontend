import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const ScenarioActionsBar = ({ onSave, onSavePreview }) => (
  <div className="ss-actions">
    <Button onClick={() => onSave()}>保存</Button>
    <Button onClick={() => onSavePreview()}>保存してプレビュー</Button>
  </div>
);

ScenarioActionsBar.propTypes = {
  onSave: PropTypes.func.isRequired,
  onSavePreview: PropTypes.func.isRequired,
};

export default ScenarioActionsBar;

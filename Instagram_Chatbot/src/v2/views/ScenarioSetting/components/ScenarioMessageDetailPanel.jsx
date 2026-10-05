import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bot/user detail settings panel (ss-setting-wrapper).
 */
const ScenarioMessageDetailPanel = ({ children, toolbar }) => (
  <div className="ss-sc-content ss-setting-wrapper ss-layout-detail-column">
    {toolbar && (
      <div className="ss-layout-detail-toolbar">
        {toolbar}
      </div>
    )}
    <div className="ss-layout-detail-body">
      {children}
    </div>
  </div>
);

ScenarioMessageDetailPanel.propTypes = {
  children: PropTypes.node.isRequired,
  toolbar: PropTypes.node,
};

ScenarioMessageDetailPanel.defaultProps = {
  toolbar: undefined,
};

export default ScenarioMessageDetailPanel;

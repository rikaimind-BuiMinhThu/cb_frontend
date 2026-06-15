import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bot/user detail settings panel (ss-setting-wrapper).
 */
const ScenarioMessageDetailPanel = ({ children }) => (
  <div className="ss-sc-content ss-setting-wrapper ss-layout-detail-column">
    <div className="ss-layout-detail-body">
      {children}
    </div>
  </div>
);

ScenarioMessageDetailPanel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScenarioMessageDetailPanel;

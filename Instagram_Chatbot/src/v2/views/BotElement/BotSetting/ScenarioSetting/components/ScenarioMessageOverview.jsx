import React from 'react';
import PropTypes from 'prop-types';

const ScenarioMessageOverview = ({ children }) => (
  <div className="ss-layout-overview-messages">
    <div className="ss-overview-detail">
      {children}
    </div>
  </div>
);

ScenarioMessageOverview.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScenarioMessageOverview;

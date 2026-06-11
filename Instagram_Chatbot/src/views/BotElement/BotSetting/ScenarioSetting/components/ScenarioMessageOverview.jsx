import React from 'react';
import PropTypes from 'prop-types';

/**
 * Message list + drag-drop overview (ss-overview-detail).
 * Body stays in ScenarioEditorContent until further content-type extraction.
 */
const ScenarioMessageOverview = ({ errorScenarioName, children }) => (
  <div style={{ height: `calc(80% - ${errorScenarioName ? '30' : '10'}px)`, backgroundColor: '#f6fbff' }}>
    <div className="ss-overview-detail">
      {children}
    </div>
  </div>
);

ScenarioMessageOverview.propTypes = {
  errorScenarioName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ScenarioMessageOverview;

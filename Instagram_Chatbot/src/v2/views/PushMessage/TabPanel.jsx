import PropTypes from 'prop-types';

const TabPanel = ({ children, value, selected, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== selected}
    id={`simple-tabpanel-${value}`}
    aria-labelledby={`simple-tab-${value}`}
    {...other}
  >
    <div className="push-tab-panel-body">{children}</div>
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TabPanel;

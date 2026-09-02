import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader } from 'reactstrap';
import {
  TAB_BASIC,
  TAB_BASIC_LABEL,
  TAB_DESIGN,
  TAB_DESIGN_LABEL,
  TAB_THEME,
  TAB_THEME_LABEL,
} from '../constants/designChatbotConstants';

const tabClassName = (activeTab, tabId) => (
  `tab-menu ${activeTab === tabId ? 'tab-menu--active' : 'tab-menu--inactive'}`
);

const DesignChatbotTabs = ({ activeTab, onChange }) => (
  <CardHeader>
    <button
      onClick={() => onChange(TAB_BASIC)}
      className={tabClassName(activeTab, TAB_BASIC)}
      type="button"
    >
      {TAB_BASIC_LABEL}
    </button>
    <button
      onClick={() => onChange(TAB_DESIGN)}
      className={tabClassName(activeTab, TAB_DESIGN)}
      type="button"
    >
      {TAB_DESIGN_LABEL}
    </button>
    <button
      onClick={() => onChange(TAB_THEME)}
      className={tabClassName(activeTab, TAB_THEME)}
      type="button"
    >
      {TAB_THEME_LABEL}
    </button>
  </CardHeader>
);

DesignChatbotTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DesignChatbotTabs;

import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader } from 'reactstrap';
import { TAB_BASIC, TAB_DESIGN } from '../constants/designChatbotConstants';

const tabStyle = (activeTab, tabId) => ({
  color: activeTab === tabId ? '#4DBEB6' : '#9B9B9B',
  backgroundColor: activeTab === tabId ? '#fff' : '#F4F3EF',
  boxShadow: activeTab !== tabId
    ? 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
    : 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
});

const DesignChatbotTabs = ({ activeTab, onChange }) => (
  <CardHeader>
    <button
      onClick={() => onChange(TAB_BASIC)}
      style={tabStyle(activeTab, TAB_BASIC)}
      className="tab-menu"
      type="button"
    >
      基本情報
    </button>
    <button
      onClick={() => onChange(TAB_DESIGN)}
      style={tabStyle(activeTab, TAB_DESIGN)}
      className="tab-menu"
      type="button"
    >
      デザインカスタマイズ
    </button>
  </CardHeader>
);

DesignChatbotTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DesignChatbotTabs;

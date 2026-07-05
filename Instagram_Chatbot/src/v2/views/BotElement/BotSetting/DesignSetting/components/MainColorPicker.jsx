import React from 'react';
import PropTypes from 'prop-types';
import PresetColorPicker from './PresetColorPicker';

const MainColorPicker = ({ mainColor, onChange }) => (
  <PresetColorPicker value={mainColor} onChange={onChange} />
);

MainColorPicker.propTypes = {
  mainColor: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MainColorPicker;

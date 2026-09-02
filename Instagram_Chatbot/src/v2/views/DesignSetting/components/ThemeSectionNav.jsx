import React from 'react';
import PropTypes from 'prop-types';
import { THEME_SECTION_NAV_ITEMS } from '../constants/designThemeConstants';

const ThemeSectionNav = ({ activeSectionId, onSectionSelect }) => (
  <nav className="theme-section-nav" aria-label="テーマ設定セクション">
    {THEME_SECTION_NAV_ITEMS.map(({ id, title }) => (
      <button
        key={id}
        type="button"
        className={`theme-section-nav__chip${activeSectionId === id ? ' theme-section-nav__chip--active' : ''}`}
        onClick={() => onSectionSelect(id)}
      >
        {title}
      </button>
    ))}
  </nav>
);

ThemeSectionNav.propTypes = {
  activeSectionId: PropTypes.string.isRequired,
  onSectionSelect: PropTypes.func.isRequired,
};

export default ThemeSectionNav;

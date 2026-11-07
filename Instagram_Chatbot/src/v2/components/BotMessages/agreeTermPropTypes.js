import PropTypes from 'prop-types';
import { AGREE_TERM_ALIGN } from './agreeTermDesign';

export const agreeTermDesignPropType = PropTypes.shape({
  title: PropTypes.shape({
    color: PropTypes.string,
    bold: PropTypes.bool,
  }),
  collapse: PropTypes.shape({
    enabled: PropTypes.bool,
    default_collapsed: PropTypes.bool,
  }),
  checkbox: PropTypes.shape({
    background_color: PropTypes.string,
    border_color: PropTypes.string,
    border_width: PropTypes.number,
    size: PropTypes.number,
    tick_color: PropTypes.string,
    tick_width: PropTypes.number,
  }),
  label: PropTypes.shape({
    font_size: PropTypes.number,
    bold: PropTypes.bool,
    color: PropTypes.string,
  }),
  align: PropTypes.oneOf([
    AGREE_TERM_ALIGN.LEFT,
    AGREE_TERM_ALIGN.CENTER,
    AGREE_TERM_ALIGN.RIGHT,
  ]),
});

export const agreeTermPostLinkPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title_comment: PropTypes.string,
  title: PropTypes.string,
  urls: PropTypes.string,
  url_comment: PropTypes.string,
});

export const agreeTermContentPropType = PropTypes.shape({
  type: PropTypes.string,
  agree_term: PropTypes.shape({
    title: PropTypes.string,
    title_require: PropTypes.bool,
    require: PropTypes.bool,
    term: PropTypes.string,
    type: PropTypes.string,
    isAgree: PropTypes.bool,
    design: agreeTermDesignPropType,
    detail_content: PropTypes.shape({
      content: PropTypes.string,
    }),
    post_link_only: PropTypes.arrayOf(agreeTermPostLinkPropType),
  }),
});

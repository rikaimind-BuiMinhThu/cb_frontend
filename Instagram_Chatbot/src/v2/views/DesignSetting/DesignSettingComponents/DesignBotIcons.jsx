import PropTypes from 'prop-types';
import './DesignBotIcons.css';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  CLOSING_ICON_LABEL,
  ICON_ADD_PLUS,
  MESSAGE_ICON_LABEL,
  OPENING_ICON_LABEL,
  SELECT_ICON_LABEL,
} from '../constants/designChatbotConstants';

const IconSectionHeader = ({ label, tooltipKey }) => (
  <div className="icon_section_header">
    <span className="icon_label">
      {label}
      <AdminInfoTooltip text={getDesignSettingTooltip(tooltipKey)} />
    </span>
  </div>
);

IconSectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
  tooltipKey: PropTypes.string.isRequired,
};

const DesignBotIcons = ({
  botIcon,
  openingBotIcon,
  closingBotIcon,
  activeIndices,
  onBotIconChange,
  onOpeningBotIconChange,
  onClosingBotIconChange,
  onBotIconRemove,
  onOpeningBotIconRemove,
  onClosingBotIconRemove,
  images = [],
  onIconClick,
}) => (
  <div className="icon_holder">
    <div className="icon_holder_section">
      <IconSectionHeader label={MESSAGE_ICON_LABEL} tooltipKey="messageIcon" />
      <div className="icon_preview_container">
        <div className="icon_preview">
          {!!botIcon ? (
            <div className="preview_image_container">
              <img src={botIcon} alt="bot_icon" className="preview_image" />
              <div className="remove-icon" onClick={onBotIconRemove}>
                <span>×</span>
              </div>
            </div>
          ) : (
            <div className="preview_placeholder">
              <span>{SELECT_ICON_LABEL}</span>
            </div>
          )}
        </div>
        <div className="icon_selection">
          <div className="icons_grid">
            {images.map((icon, index) => (
              <div
                key={index}
                className={`icon icon-${index}${activeIndices?.bot === index ? ' active' : ''}`}
                onClick={() => onIconClick && onIconClick(index, icon, 'bot')}
              >
                <img src={icon} alt="" />
              </div>
            ))}
          </div>
          <div className="add-icon">
            <span>{ICON_ADD_PLUS}</span>
            <input
              type="file"
              onChange={onBotIconChange}
              id="bot_icon"
              name="bot_icon"
              accept="image/png, image/jpeg"
              className="input_select_file"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="icon_holder_section">
      <IconSectionHeader label={OPENING_ICON_LABEL} tooltipKey="openingIcon" />
      <div className="icon_preview_container">
        <div className="icon_preview">
          {!!openingBotIcon ? (
            <div className="preview_image_container">
              <img src={openingBotIcon} alt="opening_bot_icon" className="preview_image" />
              <div className="remove-icon" onClick={onOpeningBotIconRemove}>
                <span>×</span>
              </div>
            </div>
          ) : (
            <div className="preview_placeholder">
              <span>{SELECT_ICON_LABEL}</span>
            </div>
          )}
        </div>
        <div className="icon_selection">
          <div className="icons_grid">
            {images.map((icon, index) => (
              <div
                key={`opening-${index}`}
                className={`icon icon-${index}${activeIndices?.opening === index ? ' active' : ''}`}
                onClick={() => onIconClick && onIconClick(index, icon, 'opening')}
              >
                <img src={icon} alt="" />
              </div>
            ))}
          </div>
          <div className="add-icon">
            <span>{ICON_ADD_PLUS}</span>
            <input
              type="file"
              onChange={onOpeningBotIconChange}
              id="opening_bot_icon"
              name="opening_bot_icon"
              accept="image/png, image/jpeg"
              className="input_select_file"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="icon_holder_section">
      <IconSectionHeader label={CLOSING_ICON_LABEL} tooltipKey="closingIcon" />
      <div className="icon_preview_container">
        <div className="icon_preview">
          {!!closingBotIcon ? (
            <div className="preview_image_container">
              <img src={closingBotIcon} alt="closing_bot_icon" className="preview_image" />
              <div className="remove-icon" onClick={onClosingBotIconRemove}>
                <span>×</span>
              </div>
            </div>
          ) : (
            <div className="preview_placeholder">
              <span>{SELECT_ICON_LABEL}</span>
            </div>
          )}
        </div>
        <div className="icon_selection">
          <div className="icons_grid">
            {images.map((icon, index) => (
              <div
                key={`closing-${index}`}
                className={`icon icon-${index}${activeIndices?.closing === index ? ' active' : ''}`}
                onClick={() => onIconClick && onIconClick(index, icon, 'closing')}
              >
                <img src={icon} alt="" />
              </div>
            ))}
          </div>
          <div className="add-icon">
            <span>{ICON_ADD_PLUS}</span>
            <input
              type="file"
              onChange={onClosingBotIconChange}
              id="closing_bot_icon"
              name="closing_bot_icon"
              accept="image/png, image/jpeg"
              className="input_select_file"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

DesignBotIcons.propTypes = {
  botIcon: PropTypes.string,
  openingBotIcon: PropTypes.string,
  closingBotIcon: PropTypes.string,
  activeIndices: PropTypes.shape({
    bot: PropTypes.number,
    opening: PropTypes.number,
    closing: PropTypes.number,
  }),
  onBotIconChange: PropTypes.func.isRequired,
  onOpeningBotIconChange: PropTypes.func.isRequired,
  onClosingBotIconChange: PropTypes.func.isRequired,
  onBotIconRemove: PropTypes.func.isRequired,
  onOpeningBotIconRemove: PropTypes.func.isRequired,
  onClosingBotIconRemove: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  onIconClick: PropTypes.func,
};

DesignBotIcons.defaultProps = {
  botIcon: '',
  openingBotIcon: '',
  closingBotIcon: '',
  activeIndices: {
    bot: null,
    opening: null,
    closing: null,
  },
  images: [],
  onIconClick: null,
};

export default DesignBotIcons;

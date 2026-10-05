import PropTypes from 'prop-types';
import './DesignBotIcons.css';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  CLOSING_ICON_LABEL,
  ICON_ADD_PLUS,
  ICON_ALT_BOT,
  ICON_ALT_CLOSING,
  ICON_ALT_OPENING,
  ICON_FILE_ACCEPT,
  ICON_INPUT_BOT,
  ICON_INPUT_CLOSING,
  ICON_INPUT_OPENING,
  ICON_KIND_BOT,
  ICON_KIND_CLOSING,
  ICON_KIND_OPENING,
  ICON_REMOVE_MARK,
  MESSAGE_ICON_LABEL,
  OPENING_ICON_LABEL,
  SELECT_ICON_LABEL,
} from '../constants/designChatbotConstants';

const DBI_PRESET_CLASS = 'dbi-preset';
const DBI_PRESET_ACTIVE_CLASS = 'dbi-preset dbi-preset--active';

const IconSectionHeader = ({ label, tooltipKey }) => (
  <div className="dbi-header">
    <span className="dbi-label">
      {label}
      <AdminInfoTooltip text={getDesignSettingTooltip(tooltipKey)} />
    </span>
  </div>
);

IconSectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
  tooltipKey: PropTypes.string.isRequired,
};

const DesignBotIconRow = ({
  label,
  tooltipKey,
  iconSrc,
  iconAlt,
  activeIndex,
  images,
  inputId,
  inputName,
  kind,
  onUpload,
  onRemove,
  onIconClick,
}) => (
  <div className="dbi-section">
    <IconSectionHeader label={label} tooltipKey={tooltipKey} />
    <div className="dbi-row">
      <div className="dbi-preview">
        {iconSrc ? (
          <div className="dbi-preview-frame">
            <div className="dbi-preview-image">
              <img src={iconSrc} alt={iconAlt} className="dbi-preview-img" />
            </div>
            <button
              type="button"
              className="dbi-remove"
              onClick={onRemove}
            >
              <span>{ICON_REMOVE_MARK}</span>
            </button>
          </div>
        ) : (
          <div className="dbi-placeholder">
            <span>{SELECT_ICON_LABEL}</span>
          </div>
        )}
      </div>
      <div className="dbi-grid">
        {images.map((icon, index) => (
          <button
            key={`${kind}-${index}`}
            type="button"
            className={activeIndex === index ? DBI_PRESET_ACTIVE_CLASS : DBI_PRESET_CLASS}
            onClick={() => onIconClick?.(index, icon, kind)}
          >
            <img src={icon} alt="" />
          </button>
        ))}
        <div className="dbi-upload">
          <span>{ICON_ADD_PLUS}</span>
          <input
            type="file"
            onChange={onUpload}
            id={inputId}
            name={inputName}
            accept={ICON_FILE_ACCEPT}
            className="dbi-file"
          />
        </div>
      </div>
    </div>
  </div>
);

DesignBotIconRow.propTypes = {
  label: PropTypes.string.isRequired,
  tooltipKey: PropTypes.string.isRequired,
  iconSrc: PropTypes.string,
  iconAlt: PropTypes.string.isRequired,
  activeIndex: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.string),
  inputId: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onIconClick: PropTypes.func,
};

DesignBotIconRow.defaultProps = {
  iconSrc: '',
  activeIndex: null,
  images: [],
  onIconClick: null,
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
  images,
  onIconClick,
}) => (
  <div className="dbi">
    <DesignBotIconRow
      label={MESSAGE_ICON_LABEL}
      tooltipKey="messageIcon"
      iconSrc={botIcon}
      iconAlt={ICON_ALT_BOT}
      activeIndex={activeIndices?.bot}
      images={images}
      inputId={ICON_INPUT_BOT}
      inputName={ICON_INPUT_BOT}
      kind={ICON_KIND_BOT}
      onUpload={onBotIconChange}
      onRemove={onBotIconRemove}
      onIconClick={onIconClick}
    />
    <DesignBotIconRow
      label={OPENING_ICON_LABEL}
      tooltipKey="openingIcon"
      iconSrc={openingBotIcon}
      iconAlt={ICON_ALT_OPENING}
      activeIndex={activeIndices?.opening}
      images={images}
      inputId={ICON_INPUT_OPENING}
      inputName={ICON_INPUT_OPENING}
      kind={ICON_KIND_OPENING}
      onUpload={onOpeningBotIconChange}
      onRemove={onOpeningBotIconRemove}
      onIconClick={onIconClick}
    />
    <DesignBotIconRow
      label={CLOSING_ICON_LABEL}
      tooltipKey="closingIcon"
      iconSrc={closingBotIcon}
      iconAlt={ICON_ALT_CLOSING}
      activeIndex={activeIndices?.closing}
      images={images}
      inputId={ICON_INPUT_CLOSING}
      inputName={ICON_INPUT_CLOSING}
      kind={ICON_KIND_CLOSING}
      onUpload={onClosingBotIconChange}
      onRemove={onClosingBotIconRemove}
      onIconClick={onIconClick}
    />
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

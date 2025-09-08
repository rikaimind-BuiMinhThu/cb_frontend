import './DesignBotIcons.css';

const DesignBotIcons = ({ 
  botIcon, 
  openingBotIcon, 
  closingBotIcon, 
  onBotIconChange, 
  onOpeningBotIconChange, 
  onClosingBotIconChange,
  onBotIconRemove,
  onOpeningBotIconRemove,
  onClosingBotIconRemove,
  images = [],
  onIconClick
}) => {
  return (
    <div className="icon_holder">
      {/* Bot Icon Section */}
      <div className="icon_holder_section">
        <div className="icon_section_header">
          <span className="icon_label">メッセージアイコン</span>
        </div>
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
                <span>アイコンを選択</span>
              </div>
            )}
          </div>
          <div className="icon_selection">
            <div className="icons_grid">
              {images.map((icon, index) => (
                <div
                  key={index}
                  className={`icon icon-${index} ${botIcon === icon ? 'active' : ''}`}
                  onClick={() => onIconClick && onIconClick(index, icon, 'bot')}
                >
                  <img src={icon} alt="" />
                </div>
              ))}
            </div>
            <div className="add-icon">
              <span>+</span>
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

      {/* Opening Bot Icon Section */}
      <div className="icon_holder_section">
        <div className="icon_section_header">
          <span className="icon_label">開く時のボットアイコン</span>
        </div>
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
                <span>アイコンを選択</span>
              </div>
            )}
          </div>
          <div className="icon_selection">
            <div className="icons_grid">
              {images.map((icon, index) => (
                <div
                  key={`opening-${index}`}
                  className={`icon icon-${index} ${openingBotIcon === icon ? 'active' : ''}`}
                  onClick={() => onIconClick && onIconClick(index, icon, 'opening')}
                >
                  <img src={icon} alt="" />
                </div>
              ))}
            </div>
            <div className="add-icon">
              <span>+</span>
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

      {/* Closing Bot Icon Section */}
      <div className="icon_holder_section">
        <div className="icon_section_header">
          <span className="icon_label">閉じる時のボットアイコン</span>
        </div>
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
                <span>アイコンを選択</span>
              </div>
            )}
          </div>
          <div className="icon_selection">
            <div className="icons_grid">
              {images.map((icon, index) => (
                <div
                  key={`closing-${index}`}
                  className={`icon icon-${index} ${closingBotIcon === icon ? 'active' : ''}`}
                  onClick={() => onIconClick && onIconClick(index, icon, 'closing')}
                >
                  <img src={icon} alt="" />
                </div>
              ))}
            </div>
            <div className="add-icon">
              <span>+</span>
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
};

export default DesignBotIcons;
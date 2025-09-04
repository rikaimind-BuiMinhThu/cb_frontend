const DesignMessageIcon = ({ botIcon, messageIcon, onChange, onRemove }) => {
  return (
    <div className="icon_holder">
      <div className="icon_holder_section">
        {!!botIcon && (
          <div className="bot_icon_display">
            <img src={botIcon} alt="bot_icon" />{" "}
          </div>
        )}
      </div>

      <div className="icon_holder_section">
        {!!messageIcon && (
          <div className="bot_icon_display">
            <img src={messageIcon} alt="bot_icon" />{" "}
          </div>
        )}

        <div className="message_icon_select_config">
          <div className="add-icon">
            <span>+</span>
            <input
              type="file"
              onChange={onChange}
              id="bot_message_icon"
              name="bot_message_icon"
              accept="image/png, image/jpeg"
              className="input_select_file"
            />
          </div>

          {!!messageIcon && (
            <div className="remove-icon">
              <span>+</span>
              <div onClick={onRemove} className="input_remove_file" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignMessageIcon;

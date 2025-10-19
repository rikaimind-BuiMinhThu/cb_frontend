import CheckboxCustom from "./scenarioComon/CheckboxCustom";
import SubmitButtonLoadingConfig from "./SubmitButtonLoadingConfig";
import { LABELS } from "../PreviewComponent/Constants";

const SubmitButtonConfig = ({
  content,
  onChange,
  indexMessageSelect,
  indexContent,
  buttonSubmit,
}) => {
  return (
    <div className="submit-button-config_holder">
      <div className="style-submit-button_holder">
        <label 
          id="label-submit-button-style"
          htmlFor="submit-button-style">{LABELS.SUBMIT_BUTTON.STYLE}</label>
        <textarea 
          type="text" 
          id="submit-button-style"
          placeholder={LABELS.SUBMIT_BUTTON.STYLE}
          onChange={(event) => onChange(indexMessageSelect, indexContent, content.type, event?.target?.value, "style")}
          value={buttonSubmit.style || ""}
        />
      </div>

      <div className="loading-submit-button_holder">
        <CheckboxCustom
          label="ローディングテキストを表示する"
          onChange={value => onChange(indexMessageSelect, indexContent, 'button_submit_use_loading_text', value)}
          value={!!content.button_submit_use_loading_text}
        />
        {!!content.button_submit_use_loading_text && (
          <SubmitButtonLoadingConfig
            onChange={onChange} 
            content={content} 
            indexMessageSelect={indexMessageSelect}
            indexContent={indexContent} 
            config={buttonSubmit.loading_config}
          />
        )}
      </div>

    </div>
  )
}

export default SubmitButtonConfig;
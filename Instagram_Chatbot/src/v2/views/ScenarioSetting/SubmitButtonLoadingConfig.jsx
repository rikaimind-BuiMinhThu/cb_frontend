import { LABELS } from "v2/views/Preview/PreviewComponent/Constants";
import { useState } from "react";

const defaultValue = {
  buttonHtml: "",
  buttonStyle: "",
  loadingHtml: "",
  loadingStyle: "",
};

const SubmitButtonLoadingConfig = ({
  onChange,
  content,
  config = {},
  indexMessageSelect,
  indexContent,
}) => {
  const [loadingConfig, setLoadingConfig] = useState({
    ...defaultValue,
    ...(config || {}),
  });

  const handleOnChange = (field) => (event) => {
    const value = event.target?.value || "";
    const newLoadingConfig = { ...loadingConfig, [field]: value };

    setLoadingConfig(newLoadingConfig);
    onChange(
      indexMessageSelect,
      indexContent,
      content.type,
      newLoadingConfig,
      "loading_config",
    );
  };

  return (
    <div className="loading-submit-button-config_holder">
      <div className="with-preview">
        <textarea
          placeholder={LABELS.SUBMIT_BUTTON_LOADING.LOADING_BUTTON_HTML}
          onChange={handleOnChange("buttonHtml")}
          value={loadingConfig.buttonHtml || ""}
        />
        <div className="subtitle">
          <p>
            *送信ボタンのカスタムHTMLを入力してください。必要に応じてHTML要素や属性でカスタマイズできます。
          </p>
        </div>
      </div>

      <div className="with-preview">
        <textarea
          placeholder={LABELS.SUBMIT_BUTTON_LOADING.LOADING_BUTTON_CSS}
          onChange={handleOnChange("buttonStyle")}
          value={loadingConfig.buttonStyle || ""}
        />
        <div className="subtitle">
          <p>
            *送信ボタンのカスタムCSSを入力してください。必要に応じてCSSプロパティでカスタマイズできます。
          </p>
        </div>
      </div>

      <div className="with-preview">
        <textarea
          placeholder={LABELS.SUBMIT_BUTTON_LOADING.LOADING_HTML}
          onChange={handleOnChange("loadingHtml")}
          value={loadingConfig.loadingHtml || ""}
        />
        <div className="subtitle">
          <p>
            *送信ボタンの下に表示されるローディングHTMLを入力してください。必要に応じてHTML要素や属性でカスタマイズできます。
          </p>
        </div>
      </div>

      <div className="with-preview">
        <textarea
          placeholder={LABELS.SUBMIT_BUTTON_LOADING.LOADING_CSS}
          onChange={handleOnChange("loadingStyle")}
          value={loadingConfig.loadingStyle || ""}
        />
        <div className="subtitle">
          <p>
            *送信ボタンの下に表示されるローディングCSSを入力してください。必要に応じてCSSプロパティでカスタマイズできます。
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubmitButtonLoadingConfig;
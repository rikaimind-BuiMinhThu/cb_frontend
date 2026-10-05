import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import ScenarioCodeTextarea from '../shared/ScenarioCodeTextarea';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';
import { buildHtmlUgcConfigContent, UGC_HOSTS } from '../../../HtmlUgcConfigTemplates';

const UGC_ENV_OPTIONS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'local', label: 'Local' },
];

const ScenarioHtmlUgcView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const {
    isUgcInstagram,
    isUgcTiktok,
    isUgcReview,
    ugcEnv,
    htmlUgcConfigContent,
  } = state;
  const {
    setIsUgcInstagram,
    setIsUgcTiktok,
    setIsUgcReview,
    setUgcEnv,
    setHtmlUgcConfigContent,
    setIsUseHtmlUgc,
  } = actions;

  const regenerateTempContent = (nextFlags) => {
    const content = buildHtmlUgcConfigContent(nextFlags);
    setHtmlUgcConfigContent((prevState) => ({
      ...prevState,
      temp: content,
    }));
  };

  const handleToggleUgcType = (type) => (checked) => {
    const next = { isUgcInstagram, isUgcTiktok, isUgcReview, ugcEnv };
    if (type === 'instagram') next.isUgcInstagram = checked;
    if (type === 'tiktok') next.isUgcTiktok = checked;
    if (type === 'review') next.isUgcReview = checked;

    setIsUgcInstagram(next.isUgcInstagram);
    setIsUgcTiktok(next.isUgcTiktok);
    setIsUgcReview(next.isUgcReview);
    regenerateTempContent(next);
  };

  const handleChangeUgcEnv = (nextEnv) => {
    setUgcEnv(nextEnv);
    regenerateTempContent({ isUgcInstagram, isUgcTiktok, isUgcReview, ugcEnv: nextEnv });
  };

  const handleOnCancelHtmlUgc = () => {
    setHtmlUgcConfigContent((prevState) => ({
      ...prevState,
      temp: prevState.final,
    }));
    onBack();
  };

  const handleOnConfirmHtmlUgc = () => {
    setHtmlUgcConfigContent((prevState) => ({
      ...prevState,
      final: prevState.temp,
    }));
    const enabled = isUgcInstagram || isUgcTiktok || isUgcReview || !!htmlUgcConfigContent.temp?.trim();
    setIsUseHtmlUgc(enabled);
    onBack();
  };

  return (
    <div className="ss-settings-html-ugc-view">
      <div className="ss-settings-radio-group">
        {UGC_ENV_OPTIONS.map(({ value, label }) => (
          <label key={value} className="ss-settings-radio-option">
            <input
              type="radio"
              name="ugc_env"
              checked={ugcEnv === value}
              onChange={() => handleChangeUgcEnv(value)}
            />
            {label}
            <span className="ss-settings-radio-option__hint">({UGC_HOSTS[value]})</span>
          </label>
        ))}
      </div>
      <ScenarioFormRow
        label="UGCコンテンツ種別"
        tooltip={SCENARIO_MODAL_TOOLTIPS.ugcTypes}
      >
        <div className="ss-settings-checkbox-group">
          <label className="ss-settings-checkbox-option">
            <input
              type="checkbox"
              checked={isUgcInstagram}
              onChange={(e) => handleToggleUgcType('instagram')(e.target.checked)}
            />
            UGC Instagram
          </label>
          <label className="ss-settings-checkbox-option">
            <input
              type="checkbox"
              checked={isUgcTiktok}
              onChange={(e) => handleToggleUgcType('tiktok')(e.target.checked)}
            />
            UGC TikTok
          </label>
          <label className="ss-settings-checkbox-option">
            <input
              type="checkbox"
              checked={isUgcReview}
              onChange={(e) => handleToggleUgcType('review')(e.target.checked)}
            />
            UGC Review
          </label>
        </div>
      </ScenarioFormRow>
      <ScenarioFormRow
        label="UGCコンテンツ"
        tooltip={SCENARIO_MODAL_TOOLTIPS.htmlUgcConfigContent}
        alignTop
      >
        <ScenarioCodeTextarea
          placeholder="チェックボックスで自動生成されます。手動編集も可能です。"
          value={htmlUgcConfigContent.temp}
          onChange={(value) => setHtmlUgcConfigContent((prevState) => ({
            ...prevState,
            temp: value,
          }))}
          language="html"
          height={280}
        />
      </ScenarioFormRow>
      <ScenarioModalFooter
        onClose={handleOnCancelHtmlUgc}
        onConfirm={handleOnConfirmHtmlUgc}
      />
    </div>
  );
};

export default ScenarioHtmlUgcView;

import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import { AdminInfoTooltip } from '../../../../../../../components/AdminShell';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import ScenarioCodeTextarea from '../shared/ScenarioCodeTextarea';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';
import { buildHtmlUgcConfigContent, UGC_HOSTS } from '../../../HtmlUgcConfigTemplates';

const UGC_ENV_OPTIONS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'local', label: 'Local' },
];

const SectionLabel = ({ label, tooltip }) => (
  <div className="ss-settings-html-ugc-view__label">
    <span>{label}</span>
    {tooltip && <AdminInfoTooltip text={tooltip} />}
  </div>
);

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
      <section className="ss-settings-html-ugc-view__section">
        <SectionLabel label="環境" tooltip={SCENARIO_MODAL_TOOLTIPS.ugcEnv} />
        <div className="ss-settings-html-ugc-view__control">
          <div className="ss-settings-html-ugc-view__radio-group">
            {UGC_ENV_OPTIONS.map(({ value, label }) => (
              <label key={value} className="ss-settings-html-ugc-view__radio-option">
                <input
                  type="radio"
                  name="ugc_env"
                  checked={ugcEnv === value}
                  onChange={() => handleChangeUgcEnv(value)}
                />
                <span className="ss-settings-html-ugc-view__radio-text">
                  <span className="ss-settings-html-ugc-view__radio-title">{label}</span>
                  <span className="ss-settings-html-ugc-view__radio-hint">{UGC_HOSTS[value]}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="ss-settings-html-ugc-view__section">
        <SectionLabel label="UGCコンテンツ種別" tooltip={SCENARIO_MODAL_TOOLTIPS.ugcTypes} />
        <div className="ss-settings-html-ugc-view__control">
          <div className="ss-settings-html-ugc-view__checkbox-group">
            <label className="ss-settings-html-ugc-view__checkbox-option">
              <input
                type="checkbox"
                checked={isUgcInstagram}
                onChange={(e) => handleToggleUgcType('instagram')(e.target.checked)}
              />
              UGC Instagram
            </label>
            <label className="ss-settings-html-ugc-view__checkbox-option">
              <input
                type="checkbox"
                checked={isUgcTiktok}
                onChange={(e) => handleToggleUgcType('tiktok')(e.target.checked)}
              />
              UGC TikTok
            </label>
            <label className="ss-settings-html-ugc-view__checkbox-option">
              <input
                type="checkbox"
                checked={isUgcReview}
                onChange={(e) => handleToggleUgcType('review')(e.target.checked)}
              />
              UGC Review
            </label>
          </div>
        </div>
      </section>

      <section className="ss-settings-html-ugc-view__section">
        <SectionLabel
          label="UGCコンテンツ"
          tooltip={SCENARIO_MODAL_TOOLTIPS.htmlUgcConfigContent}
        />
        <div className="ss-settings-html-ugc-view__control">
          <ScenarioCodeTextarea
            className="ss-settings-html-ugc-view__code"
            placeholder="チェックボックスで自動生成されます。手動編集も可能です。"
            value={htmlUgcConfigContent.temp}
            onChange={(value) => setHtmlUgcConfigContent((prevState) => ({
              ...prevState,
              temp: value,
            }))}
            language="html"
            height={280}
          />
        </div>
      </section>

      <ScenarioModalFooter
        onClose={handleOnCancelHtmlUgc}
        onConfirm={handleOnConfirmHtmlUgc}
      />
    </div>
  );
};

export default ScenarioHtmlUgcView;

import React from 'react';
import InputCustom from '../../../scenarioComon/InputCustom';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import OverviewCheckboxRow from '../../OverviewCheckboxRow';
import ScenarioModalCheckbox from '../shared/ScenarioModalCheckbox';
import { AdminInfoTooltip } from '../../../../../../../components/AdminShell';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import {
  SCENARIO_MODAL_TOOLTIPS,
  SETTINGS_MODAL_VIEWS,
} from '../shared/scenarioModalTooltips';
import { createEmptyAutoLogoutConfig } from '../../../utils/autoLogoutUtils';
import {
  EXECUTION_POLICIES,
  EXECUTION_POLICY_OPTIONS,
} from '../../../../../../../variables/constants';

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <AdminInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </>
);

const ScenarioSettingsMainView = ({ onClose }) => {
  const { state, actions, client: contextClient } = useScenarioEditor();
  const {
    scenarioType,
    urlThanks,
    merchandiseId,
    lpProductUrl,
    coupon,
    isUseOnlyRegularOrder,
    executionPolicy,
    isUseFukushashiki,
    isUseAmazonPay,
    isUseCustomCss,
    isUseCustomJsCode,
    isUseHtmlUgc,
    timerConfig,
    isUseErrMsgByJs,
    launchButtonSelectors,
    isUsedMessageLoadedPast,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
    isUseBtnUpdateTracking,
    isUseGlobalDelay,
    useFullwidthChatbotMobile,
    isShopifyPaymentScenario,
  } = state;
  const {
    setUrlThanks,
    setMerchandiseId,
    setLpProductUrl,
    setCoupon,
    setIsUseOnlyRegularOrder,
    setExecutionPolicy,
    setIsUseFukushashiki,
    setIsUseAmazonPay,
    setIsUseCustomCss,
    setIsUseCustomJsCode,
    setIsUseHtmlUgc,
    setIsUgcInstagram,
    setIsUgcTiktok,
    setIsUgcReview,
    setUgcEnv,
    setHtmlUgcConfigContent,
    setTimerConfig,
    setIsUseErrMsgByJs,
    setLaunchButtonSelectors,
    setIsUsedMessageLoadedPast,
    setIsUsedCrosssell,
    setProductIdCrossSell,
    setIsClearLandingPageSession,
    setAutoLogoutConfig,
    setIsUseBtnUpdateTracking,
    setIsUseGlobalDelay,
    setUseFullwidthChatbotMobile,
    navigateSettingsModalView,
  } = actions;

  const client = contextClient || JSON.parse(sessionStorage.getItem('client') || 'null');
  const isApiPolicy = executionPolicy === EXECUTION_POLICIES.API;
  const isFukushashikiPolicy = executionPolicy === EXECUTION_POLICIES.FUKUSHASHIKI;

  const handleChangeExecutionPolicy = (value) => {
    setExecutionPolicy(value);
    const isFukushashiki = value === EXECUTION_POLICIES.FUKUSHASHIKI;
    setIsUseFukushashiki(isFukushashiki);
    if (!isFukushashiki) {
      setIsUseCustomCss(false);
      setIsUseCustomJsCode(false);
      setIsUseErrMsgByJs(false);
      setIsUseAmazonPay(false);
      setIsClearLandingPageSession(false);
      setAutoLogoutConfig(createEmptyAutoLogoutConfig());
    }
  };

  const handleToggleHtmlUgc = (checked) => {
    setIsUseHtmlUgc(checked);
    if (!checked) {
      setIsUgcInstagram(false);
      setIsUgcTiktok(false);
      setIsUgcReview(false);
      setUgcEnv('staging');
      setHtmlUgcConfigContent({ temp: '', final: '' });
      return;
    }
    navigateSettingsModalView(SETTINGS_MODAL_VIEWS.HTML_UGC);
  };

  const handleToggleAutoLogout = (checked) => {
    if (!checked) {
      setIsClearLandingPageSession(false);
      setAutoLogoutConfig(createEmptyAutoLogoutConfig());
      return;
    }

    setIsClearLandingPageSession(true);
    navigateSettingsModalView(SETTINGS_MODAL_VIEWS.AUTO_LOGOUT);
  };

  return (
    <div className="ss-settings-main-view">
      {scenarioType !== 'faq' && !isApiPolicy && (
        <section className="ss-layout-form-section">
          {isShopifyPaymentScenario && (
            <>
              <ScenarioFormRow
                label="商品IDもしくはバリアントID"
                tooltip={SCENARIO_MODAL_TOOLTIPS.merchandiseId}
              >
                <InputCustom
                  style={{ width: '100%' }}
                  value={merchandiseId}
                  onChange={(value) => setMerchandiseId(value)}
                />
              </ScenarioFormRow>
              {isUsedCrosssell && (
                <ScenarioFormRow
                  label="クロスセル用 商品ID"
                  tooltip={SCENARIO_MODAL_TOOLTIPS.productIdCrossSell}
                >
                  <InputCustom
                    style={{ width: '100%' }}
                    value={productIdCrossSell}
                    onChange={(value) => setProductIdCrossSell(value)}
                  />
                </ScenarioFormRow>
              )}
            </>
          )}
          {client?.cart_system === 'ec_force' && (
            <ScenarioFormRow
              label="Coupon"
              tooltip={SCENARIO_MODAL_TOOLTIPS.coupon}
            >
              <InputCustom
                style={{ width: '100%' }}
                value={coupon}
                onChange={(value) => setCoupon(value)}
              />
            </ScenarioFormRow>
          )}
        </section>
      )}

      <section className="ss-layout-form-section">
        <h3 className="ss-layout-form-section__title">カスタマイズ</h3>
        <OverviewCheckboxRow
          checked={isUseHtmlUgc}
          onChange={handleToggleHtmlUgc}
          label={labelWithTooltip('UGCForce連携', 'isUseHtmlUgc')}
          actionButton={isUseHtmlUgc && (
            <button
              type="button"
              className="ss-settings-modal-action-link"
              onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.HTML_UGC)}
            >
              設定する →
            </button>
          )}
        />
        {scenarioType !== 'faq' && (
          <>
            <OverviewCheckboxRow
              checked={timerConfig.enable}
              onChange={() => {
                setTimerConfig((prevConfig) => ({
                  ...prevConfig,
                  enable: !prevConfig.enable,
                }));
              }}
              label={labelWithTooltip('タイマー', 'timer')}
              actionButton={timerConfig.enable && (
                <button
                  type="button"
                  className="ss-settings-modal-action-link"
                  onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.TIMER)}
                >
                  設定する →
                </button>
              )}
            />
            <ScenarioFormRow
              label="起動ボタンセレクター"
              tooltip={SCENARIO_MODAL_TOOLTIPS.launchButtonSelectors}
            >
              <InputCustom
                style={{ width: '100%' }}
                value={launchButtonSelectors}
                onChange={(value) => setLaunchButtonSelectors(value)}
                placeholder='例: a[href="#target_cart"] img'
              />
            </ScenarioFormRow>
          </>
        )}
      </section>

      {scenarioType !== 'faq' && (
        <section className="ss-layout-form-section">
          <h3 className="ss-layout-form-section__title">実施方針</h3>
          <ScenarioFormRow
            label={labelWithTooltip('実施方針', 'executionPolicy')}
          >
            <select
              className="ss-input-value"
              value={executionPolicy}
              onChange={(e) => handleChangeExecutionPolicy(e.target.value)}
            >
              {EXECUTION_POLICY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </ScenarioFormRow>
          {!isApiPolicy && (
            <>
              <ScenarioFormRow
                label="商品購入のURL"
                tooltip={SCENARIO_MODAL_TOOLTIPS.lpProductUrl}
              >
                <InputCustom
                  style={{ width: '100%' }}
                  value={lpProductUrl}
                  onChange={(value) => setLpProductUrl(value)}
                />
              </ScenarioFormRow>
              <ScenarioFormRow
                label="サンクスページのURL"
                tooltip={SCENARIO_MODAL_TOOLTIPS.urlThanks}
              >
                <InputCustom
                  style={{ width: '100%' }}
                  value={urlThanks}
                  onChange={(value) => setUrlThanks(value)}
                />
              </ScenarioFormRow>
              <div className="ss-layout-checkbox-item">
                <ScenarioModalCheckbox
                  checked={isUseOnlyRegularOrder}
                  onChange={(checked) => setIsUseOnlyRegularOrder(checked)}
                  label={labelWithTooltip('定期注文のみ', 'isUseOnlyRegularOrder')}
                />
              </div>
            </>
          )}
          {isFukushashikiPolicy && (
            <div className="ss-layout-checkbox-item">
              <ScenarioModalCheckbox
                checked={isUseBtnUpdateTracking}
                onChange={(checked) => setIsUseBtnUpdateTracking(checked)}
                label={labelWithTooltip('「登録」ボタンの変更を有効化する', 'isUseBtnUpdateTracking')}
              />
            </div>
          )}

          {isUseFukushashiki && (
            <>
              <OverviewCheckboxRow
                checked={isUseCustomCss}
                onChange={(checked) => setIsUseCustomCss(checked)}
                label={labelWithTooltip('カスタムCSSを適用する', 'isUseCustomCss')}
                actionButton={isUseCustomCss && (
                  <button
                    type="button"
                    className="ss-settings-modal-action-link"
                    onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.CSS)}
                  >
                    設定する →
                  </button>
                )}
              />
              <OverviewCheckboxRow
                checked={isUseCustomJsCode}
                onChange={(checked) => setIsUseCustomJsCode(checked)}
                label={labelWithTooltip('カスタムJSを適用する', 'isUseCustomJsCode')}
                actionButton={isUseCustomJsCode && (
                  <button
                    type="button"
                    className="ss-settings-modal-action-link"
                    onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.JS)}
                  >
                    設定する →
                  </button>
                )}
              />
              <OverviewCheckboxRow
                checked={isUseErrMsgByJs}
                onChange={(checked) => setIsUseErrMsgByJs(checked)}
                label={labelWithTooltip('エラーメッセージを取得する', 'isUseErrMsgByJs')}
                actionButton={isUseErrMsgByJs && (
                  <button
                    type="button"
                    className="ss-settings-modal-action-link"
                    onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.ERR_MSG)}
                  >
                    設定する →
                  </button>
                )}
              />
              {!isShopifyPaymentScenario && (
                <OverviewCheckboxRow
                  checked={isClearLandingPageSession}
                  onChange={handleToggleAutoLogout}
                  label={labelWithTooltip('ページ読み込み時にログアウトする', 'isClearLandingPageSession')}
                  actionButton={isClearLandingPageSession && (
                    <button
                      type="button"
                      className="ss-settings-modal-action-link"
                      onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.AUTO_LOGOUT)}
                    >
                      設定する →
                    </button>
                  )}
                />
              )}
              <OverviewCheckboxRow
                checked={isUseAmazonPay}
                onChange={(checked) => setIsUseAmazonPay(checked)}
                label={labelWithTooltip('Amazon Payを利用する', 'isUseAmazonPay')}
                actionButton={isUseAmazonPay && (
                  <button
                    type="button"
                    className="ss-settings-modal-action-link"
                    onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.AMAZON_PAY)}
                  >
                    設定する →
                  </button>
                )}
              />
            </>
          )}
        </section>
      )}

      <section className="ss-layout-form-section">
        <h3 className="ss-layout-form-section__title">オプション</h3>
        <div className="ss-layout-option-grid">
          <div className="ss-layout-checkbox-item">
            <ScenarioModalCheckbox
              checked={isUsedMessageLoadedPast}
              onChange={(checked) => setIsUsedMessageLoadedPast(checked)}
              label={labelWithTooltip('過去メッセージを読み込む', 'isUsedMessageLoadedPast')}
            />
          </div>
          <div className="ss-layout-checkbox-item">
            <ScenarioModalCheckbox
              checked={useFullwidthChatbotMobile}
              onChange={(checked) => setUseFullwidthChatbotMobile(checked)}
              label={labelWithTooltip('モバイル全画面チャット', 'useFullwidthChatbotMobile')}
            />
          </div>
          {isShopifyPaymentScenario && (
            <div className="ss-layout-checkbox-item">
              <ScenarioModalCheckbox
                checked={isUsedCrosssell}
                onChange={(checked) => {
                  setIsUsedCrosssell(checked);
                  if (!checked) setProductIdCrossSell('');
                }}
                label={labelWithTooltip('クロスセル商品をカートに追加する', 'isUsedCrosssell')}
              />
            </div>
          )}
          <OverviewCheckboxRow
            checked={isUseGlobalDelay}
            onChange={(checked) => setIsUseGlobalDelay(checked)}
            label={labelWithTooltip('表示待ち時間を設定する', 'isUseGlobalDelay')}
            actionButton={isUseGlobalDelay && (
              <button
                type="button"
                className="ss-settings-modal-action-link"
                onClick={() => navigateSettingsModalView(SETTINGS_MODAL_VIEWS.GLOBAL_DELAY)}
              >
                設定する →
              </button>
            )}
          />
        </div>
      </section>

      <ScenarioModalFooter
        onClose={onClose}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioSettingsMainView;

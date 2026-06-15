import React from 'react';
import { Button } from 'reactstrap';
import ModalShort from '../../../../../Popup/ModalShort';
import InputCustom from '../../scenarioComon/InputCustom';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';
import OverviewCheckboxRow from '../OverviewCheckboxRow';

const OverviewCheckboxItem = ({ checked, onChange, label }) => (
  <div className="ss-layout-checkbox-item">
    <input
      type="checkbox"
      className="ss-user-setting-checkbox-custom"
      onChange={onChange}
      checked={checked}
    />
    <label>{label}</label>
  </div>
);

const ScenarioSettingsModal = () => {
  const { state, actions, client: contextClient } = useScenarioEditor();
  const {
    scenarioType,
    urlThanks,
    merchandiseId,
    lpProductUrl,
    coupon,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    isUsedCartConfirmPage,
    urlCartConfirmPage,
    isUseCustomJsCode,
    timerConfig,
    isUseErrMsgByJs,
    isUsedMessageLoadedPast,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
    isUseBtnUpdateTracking,
    useFullwidthChatbotMobile,
    isShopifyPaymentScenario,
    isOpenScenarioSettingsModal,
  } = state;
  const {
    setUrlThanks,
    setMerchandiseId,
    setLpProductUrl,
    setCoupon,
    setIsUseOnlyRegularOrder,
    setIsUseFukushashiki,
    setIsUseCustomCss,
    setIsOpenModalCustomCss,
    setIsUseCustomJsCode,
    setIsOpenModalCustomJsCode,
    setTimerConfig,
    setIsOpenErrMsgByJsSettingModal,
    setIsUseErrMsgByJs,
    setIsUsedCartConfirmPage,
    setUrlCartConfirmPage,
    setIsUsedMessageLoadedPast,
    setIsUsedCrosssell,
    setProductIdCrossSell,
    setIsClearLandingPageSession,
    setIsUseBtnUpdateTracking,
    setUseFullwidthChatbotMobile,
    setIsOpenScenarioSettingsModal,
  } = actions;

  const client = contextClient || JSON.parse(sessionStorage.getItem('client') || 'null');

  const handleChangeOpenModalCustomCss = (value) => () => {
    setIsOpenModalCustomCss(value);
  };

  const handleChangeOpenModalCustomJsCode = (value) => () => {
    setIsOpenModalCustomJsCode(value);
  };

  const handleChangeTimerConfig = ({ keyPath = [], instanceValue = null, useEventValue = false, transform = (v) => v, defaultValue = null }) => (e) => {
    if (!keyPath.length) return;

    let value = instanceValue;

    if (!!e && useEventValue) {
      e.preventDefault?.();
      value = e.target?.value ?? e;
    }

    setTimerConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      let current = newConfig;

      for (let i = 0; i < keyPath.length - 1; i++) {
        const key = keyPath[i];
        current[key] = { ...(current[key] || {}) };
        current = current[key];
      }

      current[keyPath[keyPath.length - 1]] = transform(value || defaultValue);
      return newConfig;
    });
  };

  const handleClose = () => {
    setIsOpenScenarioSettingsModal(false);
  };

  return (
    <ModalShort open={isOpenScenarioSettingsModal} onClose={handleClose}>
      <div className="sl-popup-create-scenario-wrapper ss-layout-settings-modal" style={{ width: '750px' }}>
        <h4>シナリオ設定</h4>

        {scenarioType !== 'faq' && (
          <section className="ss-layout-form-section">
            <h3 className="ss-layout-form-section__title">URL設定</h3>
            <InputCustom
              style={{ width: '100%' }}
              value={lpProductUrl}
              onChange={value => setLpProductUrl(value)}
              placeholder="商品購入のURL"
            />
            <InputCustom
              style={{ width: '100%' }}
              value={urlThanks}
              onChange={value => setUrlThanks(value)}
              placeholder="サンクスページのURL"
            />
            {isUsedCartConfirmPage && (
              <InputCustom
                style={{ width: '100%' }}
                value={urlCartConfirmPage}
                onChange={value => setUrlCartConfirmPage(value)}
                placeholder="カートの注文確認ページのURL"
              />
            )}
            {isShopifyPaymentScenario && (
              <>
                <InputCustom
                  style={{ width: '100%' }}
                  value={merchandiseId}
                  onChange={value => setMerchandiseId(value)}
                  placeholder="商品IDもしくはバリアントID"
                />
                {isUsedCrosssell && (
                  <InputCustom
                    style={{ width: '100%' }}
                    value={productIdCrossSell}
                    onChange={value => setProductIdCrossSell(value)}
                    placeholder="クロスセル用 商品IDもしくはバリアントID"
                  />
                )}
              </>
            )}
            {client?.cart_system === 'ec_force' && (
              <InputCustom
                style={{ width: '100%' }}
                value={coupon}
                onChange={value => setCoupon(value)}
                placeholder="Coupon"
              />
            )}
          </section>
        )}

        <section className="ss-layout-form-section">
          <h3 className="ss-layout-form-section__title">カスタマイズ</h3>
          <OverviewCheckboxRow
            checked={isUseCustomCss}
            onChange={() => setIsUseCustomCss(!isUseCustomCss)}
            label="CSSカスタムを使用"
            actionButton={isUseCustomCss && (
              <button
                type="button"
                className="ss-user-setting-checkbox-custom-css_toggle"
                onClick={handleChangeOpenModalCustomCss(true)}
              >
                ( CSSコンテンツ設定モダルを開く )
              </button>
            )}
          />
          <OverviewCheckboxRow
            checked={isUseCustomJsCode}
            onChange={() => setIsUseCustomJsCode(!isUseCustomJsCode)}
            label="JSカスタムを使用"
            actionButton={isUseCustomJsCode && (
              <button
                type="button"
                className="ss-user-setting-checkbox-custom-css_toggle"
                onClick={handleChangeOpenModalCustomJsCode(true)}
              >
                ( JSコンテンツ設定モダルを開く )
              </button>
            )}
          />
          {scenarioType !== 'faq' && (
            <>
              <OverviewCheckboxRow
                checked={timerConfig.enable}
                onChange={handleChangeTimerConfig({ keyPath: ['enable'], instanceValue: !timerConfig.enable })}
                label="タイマー"
                actionButton={timerConfig.enable && (
                  <button
                    type="button"
                    className="ss-user-setting-checkbox-custom-css_toggle"
                    onClick={handleChangeTimerConfig({ keyPath: ['isOpen'], instanceValue: true })}
                  >
                    ( タイマーを設定する )
                  </button>
                )}
              />
              <OverviewCheckboxRow
                checked={isUseErrMsgByJs}
                onChange={() => setIsUseErrMsgByJs(!isUseErrMsgByJs)}
                label="エラーメッセンジ取得をJSコード使用"
                actionButton={isUseErrMsgByJs && (
                  <button
                    type="button"
                    className="ss-user-setting-checkbox-custom-css_toggle"
                    onClick={() => setIsOpenErrMsgByJsSettingModal(true)}
                  >
                    ( JSコード設定モダルを開く )
                  </button>
                )}
              />
            </>
          )}
        </section>

        <section className="ss-layout-form-section">
          <h3 className="ss-layout-form-section__title">オプション</h3>
          <div className="ss-layout-option-grid">
            {scenarioType !== 'faq' && (
              <>
                <OverviewCheckboxItem
                  checked={isUseOnlyRegularOrder}
                  onChange={() => setIsUseOnlyRegularOrder(!isUseOnlyRegularOrder)}
                  label="定期注文のみ"
                />
                <OverviewCheckboxItem
                  checked={isUseFukushashiki}
                  onChange={() => setIsUseFukushashiki(!isUseFukushashiki)}
                  label="複写式利用フラグ"
                />
                <OverviewCheckboxItem
                  checked={isUsedCartConfirmPage}
                  onChange={() => setIsUsedCartConfirmPage(!isUsedCartConfirmPage)}
                  label="カートシステムの注文確認ページを利用"
                />
              </>
            )}
            <OverviewCheckboxItem
              checked={isUsedMessageLoadedPast}
              onChange={() => setIsUsedMessageLoadedPast(!isUsedMessageLoadedPast)}
              label="過去メッセージを読み込む"
            />
            <OverviewCheckboxItem
              checked={useFullwidthChatbotMobile}
              onChange={() => setUseFullwidthChatbotMobile(!useFullwidthChatbotMobile)}
              label="モバイル全画面チャット"
            />
            {isShopifyPaymentScenario && (
              <OverviewCheckboxItem
                checked={isUsedCrosssell}
                onChange={() => {
                  const next = !isUsedCrosssell;
                  setIsUsedCrosssell(next);
                  if (!next) setProductIdCrossSell('');
                }}
                label="クロスセル商品をカートに追加する"
              />
            )}
            <OverviewCheckboxItem
              checked={isClearLandingPageSession}
              onChange={() => setIsClearLandingPageSession(!isClearLandingPageSession)}
              label="読み込み時に自動ログアウト処理を実行する"
            />
            <OverviewCheckboxItem
              checked={isUseBtnUpdateTracking}
              onChange={() => setIsUseBtnUpdateTracking(!isUseBtnUpdateTracking)}
              label="「登録ボタ」ボタンの変更を有効化します。"
            />
          </div>
        </section>

        <div className="sl-popup-create-scenario-btn-wrapper">
          <Button
            className="ss-popup-add-variable-input-close-button"
            onClick={handleClose}
          >
            閉じる
          </Button>
        </div>
      </div>
    </ModalShort>
  );
};

export default ScenarioSettingsModal;

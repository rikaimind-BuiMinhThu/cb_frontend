import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';
import { useScenarioEditor } from '../context/ScenarioEditorContext';

const ScenarioOverviewPanel = () => {
  const { state, actions, client: contextClient } = useScenarioEditor();
  const {
    scenarioName,
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
    errorScenarioName,
    isUsedMessageLoadedPast,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
    isUseBtnUpdateTracking,
    useFullwidthChatbotMobile,
    isShopifyPaymentScenario,
  } = state;
  const {
    setScenarioName,
    setScenarioType,
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

  return (
    <>
      {/* Input name of scenario */}
      <div>
        <InputCustom
          style={{ width: '100%' }}
          value={scenarioName}
          onChange={value => setScenarioName(value)}
          placeholder="シナリオ名入力"
        />
        {errorScenarioName && <span style={{ fontSize: '12px', color: '#FF621D' }}>{errorScenarioName}</span>}
      </div>
      {/* Scenario Type Selector */}
      <div style={{ marginTop: '10px' }}>
        <label style={{ fontSize: '14px', fontWeight: '400', marginBottom: '5px', display: 'block' }}>シナリオタイプ</label>
        <select
          style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid gray', fontSize: '14px' }}
          value={scenarioType}
          onChange={(e) => setScenarioType(e.target.value)}
        >
          <option value="payment">Payment</option>
          <option value="faq">FAQ</option>
        </select>
      </div>
      {scenarioType !== 'faq' && (
        <>
          <div>
            <InputCustom
              style={{ width: '100%', marginTop: '5px' }}
              value={lpProductUrl}
              onChange={value => setLpProductUrl(value)}
              placeholder="商品購入のURL"
            />
          </div>
          <div>
            <InputCustom
              style={{ width: '100%', marginTop: '5px' }}
              value={urlThanks}
              onChange={value => setUrlThanks(value)}
              placeholder="サンクスページのURL"
            />
          </div>
          {
            isUsedCartConfirmPage && (
              <div>
                <InputCustom
                  style={{ width: '100%', marginTop: '5px' }}
                  value={urlCartConfirmPage}
                  onChange={value => setUrlCartConfirmPage(value)}
                  placeholder="カートの注文確認ページのURL"
                />
              </div>
            )
          }
          {isShopifyPaymentScenario && (
            <div>
              <InputCustom
                style={{ width: '100%', marginTop: '5px' }}
                value={merchandiseId}
                onChange={value => setMerchandiseId(value)}
                placeholder="商品IDもしくはバリアントID"
              />
              {isUsedCrosssell && (
                <InputCustom
                  style={{ width: '100%', marginTop: '5px' }}
                  value={productIdCrossSell}
                  onChange={value => setProductIdCrossSell(value)}
                  placeholder="クロスセル用 商品IDもしくはバリアントID"
                />
              )}
            </div>
          )}
          {client?.cart_system === "ec_force" && <div>
            <InputCustom
              style={{ width: '100%', marginTop: '5px' }}
              value={coupon}
              onChange={value => setCoupon(value)}
              placeholder="Coupon"
            />
          </div>}
          <div>
            <input
              type="checkbox"
              className="ss-user-setting-checkbox-custom"
              onChange={(value) => setIsUseOnlyRegularOrder(!isUseOnlyRegularOrder)}
              checked={isUseOnlyRegularOrder}
            />
            <label>定期注文のみ</label>
          </div>
        </>
      )}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        justifyContent: "start",
        width: "100%",
      }}>
        <div className='ss-user-setting-checkbox-custom_css'>
          <input
            type="checkbox"
            className="ss-user-setting-checkbox-custom"
            onChange={(value) => setIsUseCustomCss(!isUseCustomCss)}
            checked={isUseCustomCss}
          />
          <label style={{whiteSpace: "nowrap", wordBreak: "normal"}}>CSSカスタムを使用</label>
        </div>
        {isUseCustomCss && (
          <div>
            <button class="ss-user-setting-checkbox-custom-css_toggle" onClick={handleChangeOpenModalCustomCss(true)}>
              {`( CSSコンテンツ設定モダルを開く )`}
            </button>
          </div>
        )}
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        justifyContent: "start",
        width: "100%",
      }}>
        <div className='ss-user-setting-checkbox-custom_css'>
          <input
            type="checkbox"
            className="ss-user-setting-checkbox-custom"
            onChange={(value) => setIsUseCustomJsCode(!isUseCustomJsCode)}
            checked={isUseCustomJsCode}
          />
          <label style={{whiteSpace: "nowrap", wordBreak: "normal"}}>JSカスタムを使用</label>
        </div>
        {isUseCustomJsCode && (
          <div>
            <button class="ss-user-setting-checkbox-custom-css_toggle" onClick={handleChangeOpenModalCustomJsCode(true)}>
              {`( JSコンテンツ設定モダルを開く )`}
            </button>
          </div>
        )}
      </div>
      {scenarioType !== 'faq' && (
        <>
          <div className="timer_config-checkbox">
            <div className='ss-user-setting-checkbox-custom_css'>
              <input
                type="checkbox"
                className="ss-user-setting-checkbox-custom"
                onChange={handleChangeTimerConfig({ keyPath: ["enable"], instanceValue: !timerConfig.enable })}
                checked={timerConfig.enable}
              />
              <label className="timer_config-label">タイマー</label>
            </div>
            {timerConfig.enable && (
              <div>
                <button className="ss-user-setting-checkbox-custom-css_toggle" onClick={handleChangeTimerConfig({ keyPath: ["isOpen"], instanceValue: true })}>
                  {`( タイマーを設定する )`}
                </button>
              </div>
            )}
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            justifyContent: "start",
            width: "100%",
          }}>
            <div className='ss-user-setting-checkbox-custom_css'>
              <input
                type="checkbox"
                className="ss-user-setting-checkbox-custom"
                onChange={() => setIsUseErrMsgByJs(!isUseErrMsgByJs)}
                checked={isUseErrMsgByJs}
              />
              <label style={{whiteSpace: "nowrap", wordBreak: "normal"}}>エラーメッセンジ取得をJSコード使用</label>
            </div>
            {isUseErrMsgByJs && (
              <div>
                <button class="ss-user-setting-checkbox-custom-css_toggle" onClick={() => setIsOpenErrMsgByJsSettingModal(true)}>
                  {`( JSコード設定モダルを開く )`}
                </button>
              </div>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              className="ss-user-setting-checkbox-custom"
              onChange={(value) => setIsUseFukushashiki(!isUseFukushashiki)}
              checked={isUseFukushashiki}
            />
            <label>複写式利用フラグ</label>
          </div>
          <div>
            <input
              type="checkbox"
              className="ss-user-setting-checkbox-custom"
              onChange={(value) => setIsUsedCartConfirmPage(!isUsedCartConfirmPage)}
              checked={isUsedCartConfirmPage}
            />
            <label>カートシステムの注文確認ページを利用</label>
          </div>
        </>
      )}
      <div>
        <input
          type="checkbox"
          className="ss-user-setting-checkbox-custom"
          onChange={() =>
            setIsUsedMessageLoadedPast(!isUsedMessageLoadedPast)}
          checked={isUsedMessageLoadedPast}
        />
        <label>過去メッセージを読み込む</label>
      </div>
      <div>
        <input
          type="checkbox"
          className="ss-user-setting-checkbox-custom"
          onChange={() => setUseFullwidthChatbotMobile(!useFullwidthChatbotMobile)}
          checked={useFullwidthChatbotMobile}
        />
        <label>モバイル全画面チャット</label>
      </div>
      {isShopifyPaymentScenario && (
        <div>
          <input
            type="checkbox"
            className="ss-user-setting-checkbox-custom"
            onChange={() => {
              const next = !isUsedCrosssell;
              setIsUsedCrosssell(next);
              if (!next) setProductIdCrossSell('');
            }}
            checked={isUsedCrosssell}
          />
          <label>クロスセル商品をカートに追加する</label>
        </div>
      )}
      <div>
        <input
          type="checkbox"
          className="ss-user-setting-checkbox-custom"
          onChange={() => setIsClearLandingPageSession(!isClearLandingPageSession)}
          checked={isClearLandingPageSession}
        />
        <label>読み込み時に自動ログアウト処理を実行する</label>
      </div>
      <div>
        <input
          type="checkbox"
          className="ss-user-setting-checkbox-custom"
          onChange={() => setIsUseBtnUpdateTracking(!isUseBtnUpdateTracking)}
          checked={isUseBtnUpdateTracking}
        />
        <label>「登録ボタ」ボタンの変更を有効化します。</label>
      </div>
    </>
  );
};

export default ScenarioOverviewPanel;

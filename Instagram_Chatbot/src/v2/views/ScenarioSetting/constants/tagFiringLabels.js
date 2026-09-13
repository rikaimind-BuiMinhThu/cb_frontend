export const TAG_FIRING_LABELS = {
  useTagFiring: 'タグ発火を利用する',
  openSettings: '設定する →',
  provider: '配信先',
  providerGtm: 'Google タグマネージャー（dataLayer.push）',
  providerGa4: 'Google アナリティクス 4（gtag）',
  measurementId: '測定ID',
  measurementIdHelp: 'iframe内でgtagを読み込み、チャット画面のURLとして計測します。LPへgtagを入れる必要はありません。',
  measurementIdError: 'G- で始まる測定IDを入力してください。',
  openEvent: 'チャットボットを開いたとき',
  startEvent: 'シナリオ開始時',
  completeEvent: 'シナリオ完了時',
  eventName: 'イベント名',
  eventLabel: 'イベントラベル',
  help: 'イベントはチャットボット内の操作で発火します。LPの要素は対象外です。親ページにGTMのコンテナが必要です。',
  helpGtm: 'イベントはチャットボット内の操作で発火します。LPの要素は対象外です。親ページにGTMのコンテナが必要です。',
  helpGa4: 'イベントはチャットボット内の操作で発火します。測定IDを入れるとiframe内のgtagへ送ります。LPのgtagは使いません。',
  fireTag: 'タグを発火する',
};

export const TAG_FIRING_TOOLTIPS = {
  useTagFiring: 'チャットボット内の操作でGTMまたはGA4へイベントを送信します。',
  fireTag: 'このボタンをクリックしたときにタグを発火します。',
  measurementId: 'GA4のデータストリームの測定IDです。プレビューiframe内のgtagに渡します。',
};

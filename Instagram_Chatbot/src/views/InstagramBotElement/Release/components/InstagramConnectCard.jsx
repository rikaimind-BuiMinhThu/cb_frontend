import React, { useEffect, useRef } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Avatar, Button, Card, Spin, Typography } from 'antd';
import { FACEBOOK_APP_ID, META_GRAPH_API_VERSION } from '../../../../variables/constants';
import { isFbOAuthReturn } from '../hooks/useInstagramConnect';
import { useReleaseEditor } from '../context/ReleaseEditorContext';

const FB_SCOPES = [
  'public_profile',
  'email',
  'instagram_basic',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_metadata',
  'pages_messaging',
  'business_management',
  'instagram_manage_messages',
  'instagram_manage_comments',
].join(',');

const FB_SDK_VERSION = META_GRAPH_API_VERSION.replace(/^v/, '');

let fbSdkInitialized = false;

function initFacebookSdk(onReady) {
  if (fbSdkInitialized) {
    onReady?.();
    return;
  }
  if (!window.FB) return;
  window.FB.init({
    appId: FACEBOOK_APP_ID,
    cookie: true,
    xfbml: true,
    version: META_GRAPH_API_VERSION,
  });
  fbSdkInitialized = true;
  onReady?.();
}

export default function InstagramConnectCard() {
  const { connect } = useReleaseEditor();
  const checkFbLoginStatusRef = useRef(connect.checkFbLoginStatus);
  const loadingRef = useRef(connect.loading);
  const isConnectedRef = useRef(connect.isConnected);

  useEffect(() => {
    checkFbLoginStatusRef.current = connect.checkFbLoginStatus;
    loadingRef.current = connect.loading;
    isConnectedRef.current = connect.isConnected;
  });

  useEffect(() => {
    const tryCheckLogin = () => {
      if (!loadingRef.current && !isConnectedRef.current) {
        checkFbLoginStatusRef.current(isFbOAuthReturn());
      }
    };

    const previousFbAsyncInit = window.fbAsyncInit;
    window.fbAsyncInit = () => {
      initFacebookSdk(tryCheckLogin);
      previousFbAsyncInit?.();
    };

    if (document.getElementById('facebook-jssdk')) {
      initFacebookSdk(tryCheckLogin);
      return undefined;
    }

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    document.body.appendChild(script);
    return undefined;
  }, []);

  useEffect(() => {
    if (connect.loading || connect.isConnected) return;
    if (!window.FB || !fbSdkInitialized) return;
    connect.checkFbLoginStatus(isFbOAuthReturn());
  }, [connect.loading, connect.isConnected, connect.checkFbLoginStatus]);

  if (connect.loading) {
    return (
      <Card className="release-connect-card">
        <Spin />
      </Card>
    );
  }

  if (connect.isConnected && connect.profile) {
    return (
      <Card className="release-connect-card">
        <div className="release-connect-profile">
          <Avatar size={96} src={connect.profile.profile_picture_url} />
          <Typography.Title level={4}>@{connect.profile.username}</Typography.Title>
          <Typography.Text type="secondary">{connect.profile.name}</Typography.Text>
          <Button danger loading={connect.connecting} onClick={connect.disconnect} style={{ marginTop: 16 }}>
            インスタグラムログアウト
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="release-connect-card">
      <div className={`release-connect-login${connect.showPageList ? ' release-connect-login--page-list' : ''}`}>
        {!connect.showPageList ? (
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            autoLoad={false}
            cookie
            fields="name,email,picture"
            scope={FB_SCOPES}
            version={FB_SDK_VERSION}
            returnScopes
            callback={connect.handleFbLogin}
            onFailure={connect.handleFbLoginFailure}
            textButton="Facebookでログイン"
            cssClass="release-fb-login-button"
          />
        ) : (
          <div className="release-connect-page-list">
            <Typography.Title level={5} className="release-connect-page-list__title">
              Instagramページを選択
            </Typography.Title>
            {connect.pagesLoading ? (
              <div className="release-connect-page-list__loading">
                <Spin />
              </div>
            ) : connect.pages.length === 0 ? (
              <div className="release-connect-page-list__empty">
                <Typography.Text type="secondary">
                  {connect.pagesError || 'Facebookページが見つかりません。Metaでページアクセス権限を確認してください。'}
                </Typography.Text>
                <Button onClick={() => connect.checkFbLoginStatus(true)}>
                  再読み込み
                </Button>
              </div>
            ) : (
              connect.pages.map((page) => {
                const hasInstagram = Boolean(page.instagram_business_account?.id);
                return (
                  <div key={page.id} className="release-connect-page-item">
                    <Avatar src={page.picture?.data?.url} size={48} />
                    <div className="release-connect-page-item__info">
                      <span className="release-connect-page-item__name">{page.name}</span>
                      {!hasInstagram && (
                        <Typography.Text type="secondary" className="release-connect-page-item__hint">
                          Instagram未連携
                        </Typography.Text>
                      )}
                    </div>
                    <Button
                      type="primary"
                      disabled={!hasInstagram}
                      loading={connect.connecting}
                      onClick={() => connect.selectPage(page.id)}
                    >
                      選択
                    </Button>
                  </div>
                );
              })
            )}
            <Button
              danger
              loading={connect.connecting}
              onClick={connect.disconnect}
              className="release-connect-page-list__logout"
            >
              インスタグラムログアウト
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

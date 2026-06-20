import React, { useEffect, useRef } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Avatar, Button, Card, List, Spin, Typography } from 'antd';
import { FACEBOOK_APP_ID, META_GRAPH_API_VERSION } from '../../../../variables/constants';
import { useReleaseEditor } from '../context/ReleaseEditorContext';

const FB_SCOPES = [
  'public_profile',
  'email',
  'instagram_basic',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_metadata',
  'instagram_manage_messages',
  'instagram_manage_comments',
  'pages_messaging',
].join(',');

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
        checkFbLoginStatusRef.current();
      }
    };

    window.fbAsyncInit = () => initFacebookSdk(tryCheckLogin);

    if (document.getElementById('facebook-jssdk')) {
      initFacebookSdk(tryCheckLogin);
      return undefined;
    }

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (connect.loading || connect.isConnected) return;
    if (!window.FB || !fbSdkInitialized) return;
    connect.checkFbLoginStatus();
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
      <div className="release-connect-login">
        {!connect.showPageList ? (
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            scope={FB_SCOPES}
            callback={connect.handleFbLogin}
            textButton="Facebookでログイン"
            cssClass="release-fb-login-button"
          />
        ) : (
          <List
            header="Instagramページを選択"
            dataSource={connect.pages}
            renderItem={(page) => (
              <List.Item
                actions={[
                  <Button key="select" type="primary" loading={connect.connecting} onClick={() => connect.selectPage(page.id)}>
                    選択
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={page.picture?.data?.url} />}
                  title={page.name}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  );
}

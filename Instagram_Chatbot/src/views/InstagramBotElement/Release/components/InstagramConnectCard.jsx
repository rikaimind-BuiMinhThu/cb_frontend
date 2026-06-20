import React, { useEffect } from 'react';
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

function initFacebookSdk() {
  if (fbSdkInitialized || !window.FB) return;
  window.FB.init({
    appId: FACEBOOK_APP_ID,
    cookie: true,
    xfbml: true,
    version: META_GRAPH_API_VERSION,
  });
  fbSdkInitialized = true;
}

export default function InstagramConnectCard() {
  const { connect } = useReleaseEditor();

  useEffect(() => {
    window.fbAsyncInit = initFacebookSdk;
    if (document.getElementById('facebook-jssdk')) {
      initFacebookSdk();
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

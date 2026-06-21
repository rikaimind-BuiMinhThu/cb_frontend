import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  connectInstagram,
  fetchInstagramProfile,
  fetchInstagramSettings,
  logoutInstagram,
} from '../api/releaseApi';
import { TOAST_MESSAGES } from '../constants';
import {
  fetchAllInstagramPages,
  fetchInstagramMedia,
  parseGraphError,
} from '../utils/metaGraphApi';

export function isFbOAuthReturn() {
  const params = new URLSearchParams(window.location.search);
  return params.has('code') || params.has('granted_scopes');
}

export default function useInstagramConnect({ onNotify }) {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [pagesError, setPagesError] = useState(null);
  const [showPageList, setShowPageList] = useState(false);
  const [account, setAccount] = useState(null);

  const syncCookies = useCallback((settings) => {
    if (!settings) return;
    Cookies.set('ig_id', settings.ig_id);
    if (settings.page_access_token) {
      Cookies.set('page_access_token', settings.page_access_token);
    }
  }, []);

  const loadConnection = useCallback(async () => {
    setLoading(true);
    try {
      const settingsList = await fetchInstagramSettings();
      const current = settingsList[0];
      if (!current?.page_access_token) {
        setIsConnected(false);
        setAccount(null);
        setProfile(null);
        return;
      }

      setAccount(current);
      syncCookies(current);
      const profileData = await fetchInstagramProfile();
      setProfile(profileData);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      setAccount(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [syncCookies]);

  useEffect(() => {
    loadConnection();
  }, [loadConnection]);

  const fetchInstagramPages = useCallback(async () => {
    setPagesLoading(true);
    setPagesError(null);

    if (!window.FB) {
      setPagesLoading(false);
      setPagesError('Facebook SDKが読み込まれていません。');
      setShowPageList(true);
      return [];
    }

    try {
      const { pages: pageList, error } = await fetchAllInstagramPages();

      if (error && pageList.length === 0) {
        setPages([]);
        setPagesError(parseGraphError(error));
        setShowPageList(true);
        return [];
      }

      setPages(pageList);
      setShowPageList(true);

      if (pageList.length === 0) {
        setPagesError(
          'Facebookページが見つかりません。Business Portfolio（ECCH）へのアクセス権限をMeta Business Suiteで確認してください。',
        );
      }

      return pageList;
    } catch (err) {
      setPages([]);
      setPagesError(err.message || 'ページ一覧の取得に失敗しました。');
      setShowPageList(true);
      return [];
    } finally {
      setPagesLoading(false);
    }
  }, []);

  const clearOAuthParams = useCallback(() => {
    if (isFbOAuthReturn()) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const statusChangeCallback = useCallback(async (response) => {
    if (response.status === 'connected' && response.authResponse?.userID) {
      await fetchInstagramPages();
      clearOAuthParams();
    }
  }, [clearOAuthParams, fetchInstagramPages]);

  const checkFbLoginStatus = useCallback((force = false) => {
    if (!window.FB) return;
    const shouldForce = force || isFbOAuthReturn();
    window.FB.getLoginStatus(statusChangeCallback, shouldForce);
  }, [statusChangeCallback]);

  const handleFbLogin = useCallback(async (response) => {
    if (!response?.accessToken) return;
    await fetchInstagramPages();
    clearOAuthParams();
  }, [clearOAuthParams, fetchInstagramPages]);

  const handleFbLoginFailure = useCallback((error) => {
    const message = error?.status
      ? `Facebookログインに失敗しました (${error.status})。`
      : 'Facebookログインに失敗しました。';
    onNotify?.(message, 'error');
  }, [onNotify]);

  const selectPage = useCallback(async (pageId) => {
    setConnecting(true);
    try {
      const selectedPage = pages.find((p) => p.id === pageId);
      if (!selectedPage) {
        onNotify?.('選択したページが見つかりません。ページ一覧を再読み込みしてください。', 'error');
        return;
      }

      const igUserId = selectedPage.instagram_business_account?.id;
      const pageAccessToken = selectedPage.access_token;

      if (!igUserId) {
        onNotify?.('このFacebookページにはInstagramビジネスアカウントが連携されていません。', 'error');
        return;
      }

      if (!pageAccessToken) {
        onNotify?.(
          'ページアクセストークンを取得できませんでした。business_management権限を許可して再度ログインしてください。',
          'error',
        );
        return;
      }

      // Smoke test: confirm Page token works for Instagram media API
      await fetchInstagramMedia(igUserId, pageAccessToken);

      const fbAuthResponse = window.FB.getAuthResponse();

      await connectInstagram({
        fb_AuthResponse: fbAuthResponse,
        page_id: pageId,
        ig_id: igUserId,
        page_access_token: pageAccessToken,
      });

      syncCookies({ ig_id: igUserId, page_access_token: pageAccessToken });
      setShowPageList(false);
      await loadConnection();
      onNotify?.(TOAST_MESSAGES.CONNECT_SUCCESS, 'success');
    } catch (error) {
      const message = error.metaError
        ? parseGraphError(error.metaError)
        : (error.message || 'Instagram接続に失敗しました。');
      onNotify?.(message, 'error');
    } finally {
      setConnecting(false);
    }
  }, [loadConnection, onNotify, pages, syncCookies]);

  const disconnect = useCallback(async () => {
    setConnecting(true);
    try {
      if (account?.ig_id) {
        await logoutInstagram(account.ig_id);
      }

      Cookies.remove('ig_id');
      Cookies.remove('page_access_token');

      await new Promise((resolve) => {
        if (!window.FB) {
          resolve();
          return;
        }
        window.FB.getLoginStatus((response) => {
          if (response.authResponse) {
            window.FB.logout(resolve);
          } else {
            resolve();
          }
        });
      });

      setIsConnected(false);
      setAccount(null);
      setProfile(null);
      setPages([]);
      setPagesError(null);
      setShowPageList(false);

      onNotify?.(TOAST_MESSAGES.LOGOUT_SUCCESS, 'success');
    } catch (error) {
      onNotify?.(error.message || 'ログアウトに失敗しました。', 'error');
    } finally {
      setConnecting(false);
    }
  }, [account, onNotify]);

  return {
    isConnected,
    loading,
    connecting,
    profile,
    pages,
    pagesLoading,
    pagesError,
    showPageList,
    account,
    loadConnection,
    handleFbLogin,
    handleFbLoginFailure,
    checkFbLoginStatus,
    selectPage,
    disconnect,
  };
}

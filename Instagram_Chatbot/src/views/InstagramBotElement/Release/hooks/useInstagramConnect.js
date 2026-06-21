import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  connectInstagram,
  fetchInstagramProfile,
  fetchInstagramSettings,
  logoutInstagram,
} from '../api/releaseApi';
import { TOAST_MESSAGES } from '../constants';

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

  const fetchFbPages = useCallback(() => {
    setPagesLoading(true);
    setPagesError(null);

    return new Promise((resolve) => {
      if (!window.FB) {
        setPagesLoading(false);
        setPagesError('Facebook SDKが読み込まれていません。');
        setShowPageList(true);
        resolve([]);
        return;
      }

      window.FB.api('/me/accounts?fields=id,name,picture,instagram_business_account&limit=100', (resPage) => {
        setPagesLoading(false);

        if (resPage?.error) {
          setPages([]);
          setPagesError(resPage.error.message);
          setShowPageList(true);
          resolve([]);
          return;
        }

        const pageList = resPage?.data || [];
        setPages(pageList);
        setShowPageList(true);
        resolve(pageList);
      });
    });
  }, []);

  const clearOAuthParams = useCallback(() => {
    if (isFbOAuthReturn()) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const statusChangeCallback = useCallback(async (response) => {
    if (response.status === 'connected' && response.authResponse?.userID) {
      await fetchFbPages();
      clearOAuthParams();
    }
  }, [clearOAuthParams, fetchFbPages]);

  const checkFbLoginStatus = useCallback((force = false) => {
    if (!window.FB) return;
    const shouldForce = force || isFbOAuthReturn();
    window.FB.getLoginStatus(statusChangeCallback, shouldForce);
  }, [statusChangeCallback]);

  const handleFbLogin = useCallback(async (response) => {
    if (!response?.accessToken) return;
    await fetchFbPages();
    clearOAuthParams();
  }, [clearOAuthParams, fetchFbPages]);

  const handleFbLoginFailure = useCallback((error) => {
    onNotify?.(error?.status || 'Facebookログインに失敗しました。', 'error');
  }, [onNotify]);

  const selectPage = useCallback(async (pageId) => {
    setConnecting(true);
    try {
      const fbAuthResponse = window.FB.getAuthResponse();
      const pageResponse = await new Promise((resolve) => {
        window.FB.api(`/${pageId}?fields=instagram_business_account`, resolve);
      });

      if (!pageResponse?.instagram_business_account?.id) {
        onNotify?.('このアカウントはInstagramページにリンクされていません。', 'error');
        return;
      }

      const igResponse = await new Promise((resolve) => {
        window.FB.api(`/${pageResponse.instagram_business_account.id}`, resolve);
      });

      await connectInstagram({
        fb_AuthResponse: fbAuthResponse,
        page_id: pageId,
        ig_id: igResponse.id,
      });

      syncCookies({ ig_id: igResponse.id, page_access_token: fbAuthResponse.accessToken });
      setShowPageList(false);
      await loadConnection();
      onNotify?.(TOAST_MESSAGES.CONNECT_SUCCESS, 'success');
    } catch (error) {
      onNotify?.(error.message || 'Instagram接続に失敗しました。', 'error');
    } finally {
      setConnecting(false);
    }
  }, [loadConnection, onNotify, syncCookies]);

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

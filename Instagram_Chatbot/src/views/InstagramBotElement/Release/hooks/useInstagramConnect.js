import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  connectInstagram,
  fetchInstagramProfile,
  fetchInstagramSettings,
  logoutInstagram,
} from '../api/releaseApi';
import { TOAST_MESSAGES } from '../constants';

export default function useInstagramConnect({ onNotify }) {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pages, setPages] = useState([]);
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

  const fetchFbPages = useCallback((userID) => {
    window.FB.api(`${userID}/accounts?fields=id,name,picture`, (resPage) => {
      setPages(resPage?.data || []);
      setShowPageList(true);
    });
  }, []);

  const statusChangeCallback = useCallback((response) => {
    if (response.status === 'connected' && response.authResponse?.userID) {
      fetchFbPages(response.authResponse.userID);
    }
  }, [fetchFbPages]);

  const checkFbLoginStatus = useCallback(() => {
    if (!window.FB) return;
    window.FB.getLoginStatus(statusChangeCallback);
  }, [statusChangeCallback]);

  const handleFbLogin = useCallback((response) => {
    if (!response?.accessToken) return;
    fetchFbPages(response.userID);
  }, [fetchFbPages]);

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
    showPageList,
    account,
    loadConnection,
    handleFbLogin,
    checkFbLoginStatus,
    selectPage,
    disconnect,
  };
}

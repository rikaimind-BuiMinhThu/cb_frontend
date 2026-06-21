/**
 * Meta Graph API helpers for Instagram Business connect flow (v25.0).
 * Discovers Pages via Business Portfolio owned_pages (not just /me/accounts).
 */

const PAGE_FIELDS = 'id,name,picture,access_token,instagram_business_account{id,username}';
const PAGE_LIMIT = 100;

/**
 * Promise wrapper around window.FB.api.
 * @returns {{ data: object|null, error: object|null }}
 */
export function fbApi(path, params = {}) {
  return new Promise((resolve) => {
    if (!window.FB) {
      resolve({ data: null, error: { message: 'Facebook SDKが読み込まれていません。', code: -1 } });
      return;
    }
    window.FB.api(path, params, (response) => {
      if (response?.error) {
        resolve({ data: null, error: response.error });
      } else {
        resolve({ data: response, error: null });
      }
    });
  });
}

/**
 * Map Meta Graph API errors to user-facing messages.
 */
export function parseGraphError(error) {
  if (!error) return '不明なエラーが発生しました。';

  const code = error.code;
  const subcode = error.error_subcode;
  const message = error.message || '';

  if (code === 190) {
    return 'アクセストークンの有効期限が切れています。再度Facebookでログインしてください。';
  }

  if (code === 100) {
    if (message.toLowerCase().includes('permission') || message.includes('(#100)')) {
      return '必要な権限がありません。Facebookからログアウトし、すべての権限を許可して再度ログインしてください。';
    }
    return message || 'Graph APIエラー (#100): 権限またはパラメータが不足しています。';
  }

  if (subcode === 33 || message.toLowerCase().includes('instagram account is not connected')) {
    return 'このFacebookページにはInstagramビジネスアカウントが連携されていません。';
  }

  return message || 'Graph APIリクエストに失敗しました。';
}

/**
 * Fetch all pages from a paginated Graph API edge.
 */
async function fetchAllFromEdge(path) {
  const items = [];
  let nextPath = path;

  while (nextPath) {
    const { data, error } = await fbApi(nextPath);
    if (error) {
      return { items, error };
    }
    items.push(...(data?.data || []));
    nextPath = data?.paging?.next
      ? data.paging.next.replace(/^https:\/\/graph\.facebook\.com\/v[\d.]+/, '')
      : null;
  }

  return { items, error: null };
}

/**
 * Fallback: pages where the user is a direct admin (/me/accounts).
 */
export async function fetchMeAccounts() {
  const { items, error } = await fetchAllFromEdge(
    `/me/accounts?fields=${PAGE_FIELDS}&limit=${PAGE_LIMIT}`,
  );
  return { pages: items, error };
}

/**
 * Primary path: Business Portfolio → owned_pages.
 * Required when Pages are owned by a Business (not personal profile).
 */
export async function fetchBusinessOwnedPages() {
  const { data: businessesRes, error: bizError } = await fbApi('/me/businesses?fields=id,name');

  if (bizError) {
    return { pages: [], error: bizError };
  }

  const businesses = businessesRes?.data || [];
  if (businesses.length === 0) {
    return { pages: [], error: null };
  }

  const allPages = [];
  let firstError = null;

  await Promise.all(
    businesses.map(async (business) => {
      const { items, error } = await fetchAllFromEdge(
        `/${business.id}/owned_pages?fields=${PAGE_FIELDS}&limit=${PAGE_LIMIT}`,
      );
      if (error && !firstError) {
        firstError = error;
      }
      allPages.push(...items);
    }),
  );

  return { pages: allPages, error: firstError };
}

/**
 * Merge business-owned pages and /me/accounts, dedupe by page id.
 * Pages with a linked Instagram account are sorted first.
 */
export async function fetchAllInstagramPages() {
  const [businessResult, accountsResult] = await Promise.all([
    fetchBusinessOwnedPages(),
    fetchMeAccounts(),
  ]);

  const error = businessResult.error || accountsResult.error;
  const pageMap = new Map();

  [...businessResult.pages, ...accountsResult.pages].forEach((page) => {
    if (page?.id) {
      pageMap.set(page.id, page);
    }
  });

  const pages = Array.from(pageMap.values()).sort((a, b) => {
    const aHasIg = Boolean(a.instagram_business_account?.id);
    const bHasIg = Boolean(b.instagram_business_account?.id);
    if (aHasIg !== bHasIg) return bHasIg - aHasIg;
    return (a.name || '').localeCompare(b.name || '');
  });

  return { pages, error };
}

/**
 * Validate Instagram profile using the Page access token.
 */
export async function fetchInstagramProfile(igUserId, pageAccessToken) {
  const { data, error } = await fbApi(
    `/${igUserId}?fields=id,username,name,profile_picture_url`,
    { access_token: pageAccessToken },
  );
  if (error) {
    throw new Error(parseGraphError(error));
  }
  return data;
}

/**
 * Smoke test: fetch IG media to confirm Page token + instagram_basic scope work.
 */
export async function fetchInstagramMedia(igUserId, pageAccessToken) {
  const { data, error } = await fbApi(
    `/${igUserId}/media?fields=id,caption,media_type,media_url&limit=5`,
    { access_token: pageAccessToken },
  );
  if (error) {
    throw new Error(parseGraphError(error));
  }
  return data?.data || [];
}

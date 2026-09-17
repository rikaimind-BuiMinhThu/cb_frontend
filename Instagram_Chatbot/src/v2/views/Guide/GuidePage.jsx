import React from 'react';
import Cookies from 'js-cookie';
import { USER_ROLE_COOKIE_KEY } from 'v2/api/constants';
import { EMPTY_VALUE, parseStoredClient } from 'v2/components/AdminShell/constants';
import { getDefaultLandingPath } from 'v2/variables/constants';
import guideUrl from './guide.htm';
import './guidePage.css';

const IFRAME_TITLE = 'ECチャットボット 設定ガイド';
const BACK_LINK_LABEL = '管理画面へ';

const GuidePage = () => {
  const userRole = Cookies.get(USER_ROLE_COOKIE_KEY) || EMPTY_VALUE;
  const client = parseStoredClient();
  const backHref = getDefaultLandingPath(userRole, client);

  return (
    <div className="guide-page">
      <a className="guide-page__back" href={backHref}>
        {BACK_LINK_LABEL}
      </a>
      <iframe
        className="guide-page__iframe"
        title={IFRAME_TITLE}
        src={guideUrl}
      />
    </div>
  );
};

export default GuidePage;

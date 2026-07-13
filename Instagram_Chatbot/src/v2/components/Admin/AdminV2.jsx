import React from 'react';
import { Route, Switch } from 'react-router-dom';
import V2Admin from '../../layouts/Admin';
import V2Login from './Login';
import V2PreviewFukushashiki from 'v2/views/BotElement/BotSetting/PreviewFukushashiki';
import V2PreviewFaq from 'v2/views/BotElement/BotSetting/PreviewFaq';
import ScenarioPreviewEditorPage from 'v2/views/BotElement/BotSetting/ScenarioSetting/preview/ScenarioPreviewEditorPage';

/**
 * V2-only route shell. Must not import v1 layouts/Admin, routes.js, or views/ Preview*.
 * Mounted under /v2 by the root App BrowserRouter.
 */
const AdminV2 = () => (
  <Switch>
    <Route path="/v2/sign-in" component={V2Login} />
    <Route exact path="/v2/preview-customer-fukushashiki" component={V2PreviewFukushashiki} />
    <Route exact path="/v2/preview-faq" component={V2PreviewFaq} />
    <Route exact path="/v2/preview-scenario-editor" component={ScenarioPreviewEditorPage} />
    <Route path="/v2/admin" render={(props) => <V2Admin {...props} />} />
  </Switch>
);

export default AdminV2;

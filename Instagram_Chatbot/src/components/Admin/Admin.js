import React, { Component } from 'react';
import Login from './Login';
import Admin from '../../layouts/Admin';
import V2Admin from '../../v2/layouts/Admin';
import V2Login from '../../v2/components/Admin/Login';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Index from 'views/Public/Index';
import Plan from 'views/Public/Plan';
import PrivacyPolicy from 'views/Public/PrivacyPolicy';
import Security from 'views/Public/Security';
import Agreement from 'views/Public/Agreement';
import Company from 'views/Public/Company';
import Contact from 'views/Public/Contact';
import ShortUrl from 'views/Public/ShortUrl';
import PreviewClone from 'views/BotElement/BotSetting/PreviewClone';
import PreviewFukushashiki from 'views/BotElement/BotSetting/PreviewFukushashiki';
import PreviewFaq from 'views/BotElement/BotSetting/PreviewFaq';
import V2PreviewFukushashiki from 'v2/views/BotElement/BotSetting/PreviewFukushashiki';
import V2PreviewFaq from 'v2/views/BotElement/BotSetting/PreviewFaq';
import V2ScenarioPreviewEditorPage from 'v2/views/BotElement/BotSetting/ScenarioSetting/preview/ScenarioPreviewEditorPage';
import News from 'views/Public/News';
import Instagram from 'views/Public/Instagram';

class App extends Component {
  componentDidMount() {
    var meta = document.createElement('meta');
    meta.name = 'format-detection';
    meta.content = 'telephone=yes';

    document.head.appendChild(meta);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/payment" component={Index} />
            <Route exact path="/plan" component={Plan} />
            <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route exact path="/security" component={Security} />
            <Route exact path="/agreement" component={Agreement} />
            <Route exact path="/company" component={Company} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/preview-customer" component={PreviewClone} />
            <Route exact path="/preview-customer-fukushashiki" component={PreviewFukushashiki} />
            <Route exact path="/preview-faq" component={PreviewFaq} />
            <Route exact path="/v2/preview-customer-fukushashiki" component={V2PreviewFukushashiki} />
            <Route exact path="/v2/preview-faq" component={V2PreviewFaq} />
            <Route exact path="/v2/preview-scenario-editor" component={V2ScenarioPreviewEditorPage} />
            <Route exact path="/news" component={News} />
            {/* <Route exact path="/instagram" component={Instagram} /> */}
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/v2/sign-in" component={V2Login} />
            <Route path="/admin" render={(props) => <Admin {...props} />} />
            <Route path="/v2/admin" render={(props) => <V2Admin {...props} />} />
            <Route component={ShortUrl}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

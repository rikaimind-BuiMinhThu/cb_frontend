import React, { Component } from 'react';
import Login from './Login';
import Admin from '../../layouts/Admin';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Index from 'views/Public/Index';
import Plan from 'views/Public/Plan';
import PrivacyPolicy from 'views/Public/PrivacyPolicy';
import Security from 'views/Public/Security';
import Agreement from 'views/Public/Agreement';
import Company from 'views/Public/Company';
import Contact from 'views/Public/Contact';
import ShortUrl from 'views/Public/ShortUrl';
import PreviewFukushashiki from 'views/BotElement/BotSetting/PreviewFukushashiki';
import PreviewFaq from 'views/BotElement/BotSetting/PreviewFaq';
import ScenarioPreviewEditorPage from 'views/BotElement/BotSetting/ScenarioSetting/preview/ScenarioPreviewEditorPage';
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
            <Route exact path="/preview-customer-fukushashiki" component={PreviewFukushashiki} />
            <Route exact path="/preview-faq" component={PreviewFaq} />
            <Route exact path="/preview-scenario-editor" component={ScenarioPreviewEditorPage} />
            <Route exact path="/news" component={News} />
            {/* <Route exact path="/instagram" component={Instagram} /> */}
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/v2/admin" render={(props) => <Admin {...props} />} />
            <Route component={ShortUrl}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

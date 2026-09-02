import React, { Component, Suspense, lazy } from 'react';
import Login from './Login';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Index from 'views/Public/Index';
import Plan from 'views/Public/Plan';
import PrivacyPolicy from 'views/Public/PrivacyPolicy';
import Security from 'views/Public/Security';
import Agreement from 'views/Public/Agreement';
import Company from 'views/Public/Company';
import Contact from 'views/Public/Contact';
import ShortUrl from 'views/Public/ShortUrl';
import News from 'views/Public/News';
import AdminV2 from 'v2/app/AdminV2';

const Admin = lazy(() => import('../../layouts/Admin'));
const PreviewClone = lazy(() => import('views/BotElement/BotSetting/PreviewClone'));
const PreviewFukushashiki = lazy(() => import('views/BotElement/BotSetting/PreviewFukushashiki'));
const PreviewFaq = lazy(() => import('views/BotElement/BotSetting/PreviewFaq'));

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
            <Route
              exact
              path="/preview-customer"
              render={(props) => (
                <Suspense fallback={null}>
                  <PreviewClone {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/preview-customer-fukushashiki"
              render={(props) => (
                <Suspense fallback={null}>
                  <PreviewFukushashiki {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/preview-faq"
              render={(props) => (
                <Suspense fallback={null}>
                  <PreviewFaq {...props} />
                </Suspense>
              )}
            />
            <Route exact path="/news" component={News} />
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/v2" component={AdminV2} />
            <Route
              path="/admin"
              render={(props) => (
                <Suspense fallback={null}>
                  <Admin {...props} />
                </Suspense>
              )}
            />
            <Route component={ShortUrl} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

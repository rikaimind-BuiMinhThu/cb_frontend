import React, { Component } from 'react';
import Login from './Login';
import Admin from '../../layouts/Admin';
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import HtmlScreen from 'views/HtmlScreen';
import Index from 'views/Public/Index';
import Plan from 'views/Public/Plan';
import PrivacyPolicy from 'views/Public/PrivacyPolicy';
import Security from 'views/Public/Security';
import Agreement from 'views/Public/Agreement';
import Company from 'views/Public/Company';
import Contact from 'views/Public/Contact';
import ShortUrl from 'views/Public/ShortUrl';
class App extends Component {
  render() {
    return (
      // <div>
      //   <Login />
      // </div>
      <BrowserRouter>
        <div>
          {/* <div>
            <Link to="/">Sign-in</Link>
            <Link to="/sign-in">Sign-in</Link>
            <Link to="/admin/dashboard">Dashboard</Link>
          </div> */}
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/index" component={Index} />
            <Route exact path="/plan" component={Plan} />
            <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route exact path="/security" component={Security} />
            <Route exact path="/agreement" component={Agreement} />
            <Route exact path="/company" component={Company} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/admin" render={(props) => <Admin {...props} />} />
            <Route component={ShortUrl}></Route>
            {/* <Redirect to="/admin/dashboard" /> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
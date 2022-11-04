import React, { Component } from 'react';
import Login from './Login';
import Admin from '../../layouts/Admin';
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import HtmlScreen from 'views/HtmlScreen';
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
            <Route exact path="/top" component={HtmlScreen} />
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/admin" render={(props) => <Admin {...props} />} />
            <Redirect to="/admin/dashboard" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
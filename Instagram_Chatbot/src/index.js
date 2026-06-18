import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "antd/dist/antd.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "assets/css/login.css"
import "perfect-scrollbar/css/perfect-scrollbar.css";
import Admin from './components/Admin/Admin'

ReactDOM.render(
  <Admin />,
  document.getElementById("root")
);

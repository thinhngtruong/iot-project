/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import * as Firebase from 'firebase'
// core components
import Admin from "layouts/Admin.js";
import Login from "components/Login/Login.js"
import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();

var config = {
  apiKey: "AIzaSyCrehuqA63lfqnj-BnYwgmWXH3Z-eOTeIM",
  authDomain: "iottest1-e66c5.firebaseapp.com",
  databaseURL: "https://iottest1-e66c5.firebaseio.com",
  projectId: "iottest1-e66c5",
  storageBucket: "iottest1-e66c5.appspot.com",
  messagingSenderId: "531924809218",
}
Firebase.initializeApp(config)

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/" component={Login} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
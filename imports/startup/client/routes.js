import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MainNav from "./../../ui/components/MainNav/index";

import AboutPage from "./../../ui/pages/AboutPage/index";
import HomePage from "./../../ui/pages/HomePage/index";
import NotFoundPage from "./../../ui/pages/NotFoundPage/index";
import PoliciesPage from "./../../ui/pages/PoliciesPage/index";
import ProductsContainer from "./../../ui/pages/Products/ProductsContainer";

const Routes = () => (
  <Router>
    <div>
      <MainNav />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/products" component={ProductsContainer} />
        <Route exact path="/policies" component={PoliciesPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default Routes;

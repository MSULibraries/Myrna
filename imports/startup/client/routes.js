import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import MainNav from "./../../ui/components/MainNav/index";
import HomePage from "./../../ui/pages/HomePage/index";
import ProductsContainer from "./../../ui/pages/products/ProductsContainer";

const Routes = () => (
  <Router>
    <div>
      <MainNav />
      <Route exact path="/" component={HomePage} />
      <Route exact path="/products" component={ProductsContainer} />
    </div>
  </Router>
);

export default Routes;

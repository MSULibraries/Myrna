import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import MainNav from './../../ui/components/MainNav/index';
import AboutPage from './../../ui/pages/AboutPage/index';
import CartPage from './../../ui/pages/CartPage/index';
import HomePage from './../../ui/pages/HomePage/index';
import LoginPage from './../../ui/pages/LoginPage/index';
import OrdersPage from './../../ui/pages/OrdersPage/index';
import NotFoundPage from './../../ui/pages/NotFoundPage/index';
import PoliciesPage from './../../ui/pages/PoliciesPage/index';
import ProductsContainer from './../../ui/pages/Products/ProductsContainer';
import ProfilePage from './../../ui/pages/ProfilePage/index';

const Routes = () => (
  <Router>
    <div>
      <MainNav />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={AboutPage} />
        <AuthRoute path="/cart" component={CartPage} />
        <Route exact path="/login" component={LoginPage} />
        <AuthRoute exact path="/orders" component={OrdersPage} />
        <Route exact path="/policies" component={PoliciesPage} />
        <Route exact path="/products" component={ProductsContainer} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default Routes;

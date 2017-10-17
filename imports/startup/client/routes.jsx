import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import MainNav from './../../ui/components/MainNav/index';
import AboutPage from './../../ui//components/pages/AboutPage/index';
import AddressesPage from './../../ui//components/pages/AddressesPage/index';
import CartPage from './../../ui//components/pages/CartPage/index';
import HomePage from './../../ui//components/pages/HomePage/index';
import LoginPage from './../../ui//components/pages/LoginPage/index';
import OrdersPage from './../../ui//components/pages/OrdersPage/index';
import NotFoundPage from './../../ui//components/pages/NotFoundPage/index';
import PoliciesPage from './../../ui//components/pages/PoliciesPage/index';
import ProductsContainer from './../../ui//components/pages/Products/ProductsContainer';
import ProfilePage from './../../ui//components/pages/ProfilePage/index';

const Routes = () => (
  <Router>
    <div>
      <MainNav />
      <Switch>
        <AuthRoute exact path="/addresses" component={AddressesPage} />
        <AuthRoute path="/cart" component={CartPage} />
        <AuthRoute exact path="/orders" component={OrdersPage} />
        <AuthRoute exact path="/profile" component={ProfilePage} />

        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/policies" component={PoliciesPage} />
        <Route exact path="/products" component={ProductsContainer} />

        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default Routes;

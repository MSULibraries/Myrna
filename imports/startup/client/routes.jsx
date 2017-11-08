import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';

// Main UI components
import MainNav from './../../ui/components/MainNav/index';
import BottomNav from './../../ui/components/BottomNav/index';
// Pages
import AboutPage from './../../ui/pages/AboutPage/index';
import AddressesPage from './../../ui/pages/AddressesPage/index';
import CartPage from './../../ui/pages/CartPage/index';
import HomePage from './../../ui/pages/HomePage/index';
import LoginPage from './../../ui/pages/LoginPage/index';
import OrdersPage from './../../ui/pages/OrdersPage/index';
import NotFoundPage from './../../ui/pages/NotFoundPage/index';
import PaymentSuccess from './../../ui/pages/PaymentSuccess/index';
import PoliciesPage from './../../ui/pages/PoliciesPage/index';
import ProductsContainer from './../../ui/pages/Products/ProductsContainer';
import ProfilePage from './../../ui/pages/ProfilePage/index';

const Routes = () => (
  <Router>
    <div>
      <MainNav />
      {/* Making room for content covered by bottom nav */}
      <div style={{ marginBottom: '84px' }}>
        <Switch>
          <AuthRoute exact path="/addresses/" component={AddressesPage} />
          <AuthRoute exact path="/addresses/:option" component={AddressesPage} />
          <AuthRoute path="/cart" component={CartPage} />
          <AuthRoute exact path="/orders" component={OrdersPage} />
          <AuthRoute exact path="/payment/success" component={PaymentSuccess} />
          <AuthRoute exact path="/profile" component={ProfilePage} />

          <Route exact path="/" component={HomePage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/policies" component={PoliciesPage} />
          <Route exact path="/products" component={ProductsContainer} />

          <Route component={NotFoundPage} />
        </Switch>
      </div>
      <BottomNav />
    </div>
  </Router>
);

export default Routes;

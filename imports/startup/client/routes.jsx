import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';

// Main UI components
import MainNav from './../../ui/components/MainNav/index';
import MobileMainNav from './../../ui/components/MainNav/mobile';
import BottomNav from './../../ui/components/BottomNav/index';
// Pages
import AboutPage from './../../ui/pages/AboutPage/index';
import AddressesPage from './../../ui/pages/AddressesPage/index';
import CartPage from './../../ui/pages/CartPage/index';
import HomePage from './../../ui/pages/HomePage/index';
import LoginPage from './../../ui/pages/LoginPage/index';
import OrdersPage from './../../ui/pages/OrdersPage/index';
import OrderDetails from './../../ui/pages/OrdersPage/OrderDetails/index';
import NotFoundPage from './../../ui/pages/NotFoundPage/index';
import PaymentSuccess from './../../ui/pages/PaymentSuccess/index';
import PoliciesPage from './../../ui/pages/PoliciesPage/index';
import ProductsContainer from './../../ui/pages/Products/ProductsContainer';
import ProductsDetails from './../../ui/pages/Products/ProductsDetails/index';
import ProfilePage from './../../ui/pages/ProfilePage/index';
import RestrictedPage from './../../ui/pages/RestrictedPage/index';

const Routes = ({ userLoggedIn }) => (
  <Router>
    <div>
      <MainNav />
      <MobileMainNav />
      {/* Making room for content covered by bottom nav */}
      <div style={{ marginBottom: '84px', marginTop: '74px' }}>
        <Switch>
          <AuthRoute
            userLoggedIn={userLoggedIn}
            exact
            path="/addresses/"
            component={AddressesPage}
          />
          <AuthRoute
            userLoggedIn={userLoggedIn}
            exact
            path="/addresses/:option"
            component={AddressesPage}
          />
          <AuthRoute userLoggedIn={userLoggedIn} path="/cart" component={CartPage} />
          <AuthRoute userLoggedIn={userLoggedIn} exact path="/orders" component={OrdersPage} />
          <AuthRoute
            userLoggedIn={userLoggedIn}
            exact
            path="/orders/details/:orderId"
            component={OrderDetails}
          />
          <AuthRoute
            userLoggedIn={userLoggedIn}
            exact
            path="/payment/success"
            component={PaymentSuccess}
          />
          <AuthRoute userLoggedIn={userLoggedIn} exact path="/profile" component={ProfilePage} />

          <Route exact path="/" component={HomePage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/policies" component={PoliciesPage} />
          <Route exact path="/products" component={ProductsContainer} />
          <Route exact path="/products/details/:productId" component={ProductsDetails} />
          <Route exact path="/restricted" component={RestrictedPage} />

          <Route component={NotFoundPage} />
        </Switch>
      </div>
      <BottomNav />
    </div>
  </Router>
);

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(Routes);

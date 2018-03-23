import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import MaintainerRoute from './MaintainerRoute';
import ScrollToTop from './ScrollToTop/index';

// Main UI components
import BottomNav from './../../ui/components/BottomNav/index';
import Footer from './../../ui/components/Footer/index';
import Loader from './../../ui/components/Loader/index';
import MainNav from './../../ui/components/MainNav/index';
import MobileMainNav from './../../ui/components/MainNav/mobile';

// Pages
const AboutPage = Loadable({
  loader: () => import('./../../ui/pages/AboutPage/index'),
  delay: 500,
  loading: Loader,
});

const AddressesPage = Loadable({
  loader: () => import('./../../ui/pages/AddressesPage/index'),
  delay: 500,
  loading: Loader,
});

const CartPage = Loadable({
  loader: () => import('./../../ui/pages/CartPage/index'),
  delay: 500,
  loading: Loader,
});

const HomePage = Loadable({
  loader: () => import('./../../ui/pages/HomePage/index'),
  delay: 500,
  loading: Loader,
});

const LoginPage = Loadable({
  loader: () => import('./../../ui/pages/LoginPage/index'),
  delay: 500,
  loading: Loader,
});

const OrdersPage = Loadable({
  loader: () => import('./../../ui/pages/OrdersPage/index'),
  delay: 500,
  loading: Loader,
});

const OrderDetails = Loadable({
  loader: () => import('./../../ui/pages/OrdersPage/OrderDetails/index'),
  delay: 500,
  loading: Loader,
});

const NewUserPage = Loadable({
  loader: () => import('./../../ui/pages/NewUserPage/index'),
  delay: 500,
  loading: Loader,
});

const NotFoundPage = Loadable({
  loader: () => import('./../../ui/pages/NotFoundPage/index'),
  delay: 500,
  loading: Loader,
});

const PaymentSuccess = Loadable({
  loader: () => import('./../../ui/pages/PaymentSuccess/index'),
  delay: 500,
  loading: Loader,
});

const PoliciesPage = Loadable({
  loader: () => import('./../../ui/pages/PoliciesPage/index'),
  delay: 500,
  loading: Loader,
});

const ProductsContainer = Loadable({
  loader: () => import('./../../ui/pages/Products/ProductsContainer'),
  delay: 500,
  loading: Loader,
});

const ProductsDetails = Loadable({
  loader: () => import('./../../ui/pages/Products/ProductsDetails/index'),
  delay: 500,
  loading: Loader,
});

const ProfilePage = Loadable({
  loader: () => import('./../../ui/pages/ProfilePage/index'),
  delay: 500,
  loading: Loader,
});

const RestrictedPage = Loadable({
  loader: () => import('./../../ui/pages/RestrictedPage/index'),
  delay: 500,
  loading: Loader,
});

const ShowsPage = Loadable({
  loader: () => import('./../../ui/pages/ShowsPage/index'),
  delay: 500,
  loading: Loader,
});

const Routes = ({ userLoggedIn }) => (
  <Router>
    <ScrollToTop>
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
            MaintainerRoute
          />
          <AuthRoute
            userLoggedIn={userLoggedIn}
            exact
            path="/payment/success"
            component={PaymentSuccess}
          />
          <AuthRoute userLoggedIn={userLoggedIn} exact path="/profile" component={ProfilePage} />
          <AuthRoute userLoggedIn={userLoggedIn} exact path="/shows/" component={ShowsPage} />

          <Route exact path="/" component={HomePage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/policies" component={PoliciesPage} />
          <Route exact path="/products" component={ProductsContainer} />
          <Route exact path="/products/details/:productId" component={ProductsDetails} />
          <Route exact path="/restricted" component={RestrictedPage} />

          <MaintainerRoute exaxt path="/user/new" component={NewUserPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
      <BottomNav />
      <Footer />
    </ScrollToTop>
  </Router>
);

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(Routes);

import { withTracker } from 'meteor/react-meteor-data';
import Proptypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const BottomNav = ({ userLoggedIn }) =>
  userLoggedIn && (
    <BottomNavContainer>
      <Item>
        <BottomNavLink to="cart">
          Cart
          <img src="icons/ic_shopping_cart_white_24px.svg" alt="Cart Icon" />
        </BottomNavLink>
      </Item>
      <Item>
        <BottomNavLink to="orders">
          Orders
          <img src="icons/ic_list_white_24px.svg" alt="Orders Icon" />
        </BottomNavLink>
      </Item>
      <Item>
        <BottomNavLink to="profile">
          Profile
          <img src="icons/ic_account_box_white_24px.svg" alt="Profile Icon" />
        </BottomNavLink>
      </Item>
    </BottomNavContainer>
  );

const BottomNavContainer = styled.nav`
  align-items: center;
  background-color: #9e52c7;
  bottom: 0px;
  display: flex;
  height: 64px;
  justify-content: center;
  position: fixed;
  width: 100%;
  z-index: 2;
`;
const Item = styled.div`flex-grow: 1;`;

const BottomNavLink = styled(Link)`
  align-items: center;
  color: white;
  display: flex;
  justify-content: center;
  text-align: center;
  text-decoration: none;
`;

BottomNav.defaultProps = {
  userLoggedIn: false,
};

BottomNav.prototypes = {
  userLoggedIn: Proptypes.bool,
};
BottomNav.prototypes = {
  userLoggedIn: Proptypes.bool,
};

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(BottomNav);

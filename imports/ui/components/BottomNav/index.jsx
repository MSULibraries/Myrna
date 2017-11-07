import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { userLoggedIn } from './../../../../lib/user';

const BottomNav = () =>
  (Meteor.user() ? (
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
  ) : (
    <div />
  ));

const height = '64px';

const BottomNavContainer = styled.nav`
  align-items: center;
  background-color: #9e52c7;
  bottom: 0px;
  display: flex;
  height: ${height};
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

export default BottomNav;

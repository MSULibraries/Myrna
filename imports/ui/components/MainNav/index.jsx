/**
*
* MainNav
*
*/

import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const MainNav = ({ userLoggedIn }) => (
  <MainNavContainer>
    <LogoContainer>
      <img src="images/main_logo.png" alt="Myrna Colley-Lee Costume Collection Logo" />
    </LogoContainer>
    <LinkListContainer>
      <LinkList>
        <MainLink to="/">Home</MainLink>
        <MainLink to="/about">About</MainLink>
        <MainLink to="/products">Product</MainLink>
        <MainLink to="/policies">Policies</MainLink>
        <MainLink to="/profile">Profile</MainLink>
        <MainLink to="/login">{userLoggedIn ? 'Logout' : 'Login'}</MainLink>
      </LinkList>
    </LinkListContainer>
  </MainNavContainer>
);

const LogoContainer = styled.div`
  display: flex;
  min-height: 141px;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;
const LinkListContainer = styled.div`
  background-color: #9e52c7;
  display: flex;
  flex-direction: row;
  height: 40px;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
`;

const LinkList = styled.nav`
  display: flex;
  justify-content: space-around;
  width: 60%;
`;

const MainLink = styled(Link)`
  align-self: center;
  color: white;
  text-decoration: none;
  text-size: 1em;
`;

const MainNavContainer = styled.header`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-top: 10px;
`;

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(MainNav);

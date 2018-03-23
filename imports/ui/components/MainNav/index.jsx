/**
 *
 * MainNav
 *
 */

import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { media } from './../../breakpoints';

export const MainNav = ({ userLoggedIn }) => (
  <MainNavContainer>
    <a href="//library.msstate.edu/">
      <MsStateBrand
        src={`${document.location.origin}/images/lib_logo.png`}
        alt="Mississippi State University Logo"
      />
    </a>
    <LogoContainer>
      <Link to="/">
        <img
          src={`${document.location.origin}/images/main_logo.jpg`}
          alt="Myrna Colley-Lee Costume Collection Logo"
        />
      </Link>
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

const MsStateBrand = styled.img`
  width: 400px;
  ${media.desktop`  display: none !important;`} display: flex;

  ${media.giant` position: static;`}position: absolute;
  top: 15px;
  left: 15px;
`;

const LogoContainer = styled.div`
  display: flex;
  min-height: 141px;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;
const LinkListContainer = styled.div`
  background-color: #642f6c;
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
  ${media.desktop`  display: none !important;`} display: flex;

  flex-direction: column;
  justify-content: space-around;
  padding-top: 10px;
`;

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(MainNav);

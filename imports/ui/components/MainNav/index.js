/**
*
* MainNav
*
*/

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import AccountsUIWrapper from "./../AccountsUIWrapper/index";

const LogoContainer = styled.div`
  display: flex;
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

function MainNav() {
  return (
    <MainNavContainer>
      <div id="asdf">
        <AccountsUIWrapper />
      </div>
      <LogoContainer>
        <img
          src="images/main_logo.png"
          alt="Myrna Colley-Lee Costume Collection Logo"
        />
      </LogoContainer>
      <LinkListContainer>
        <LinkList>
          <MainLink to="/">Home</MainLink>
          <MainLink to="/about">About</MainLink>
          <MainLink to="/products">Product</MainLink>
          <MainLink to="/policies">Policies</MainLink>
          {/*<MainLink to="/login">Login</MainLink>
                 <MainLink to="/order">Order</MainLink>
          <MainLink to="/admin">Admin</MainLink>
          <MainLink to="/cart">Cart</MainLink>*/}
        </LinkList>
      </LinkListContainer>
    </MainNavContainer>
  );
}

MainNav.propTypes = {};

export default MainNav;

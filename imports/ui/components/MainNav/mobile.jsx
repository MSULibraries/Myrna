import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { media } from './../../breakpoints';

class MobileMainNav extends Component {
  constructor() {
    super();
    this.state = {
      drawerOpen: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
  }
  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  /**
   * Handles when something tries to change the draw's
   * open or close status
   * @param {Bool} open
   * @param {String} reason
   */
  handleRequestChange(open, reason) {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  render() {
    return (
      <MobileNavContainer>
        <AppBar
          title="Myrna"
          onLeftIconButtonTouchTap={() => this.handleToggle()}
          style={{ backgroundColor: '#642F6C', position: 'fixed', top: '0' }}
        />
        <Drawer
          docked={false}
          open={this.state.drawerOpen}
          onRequestChange={() => this.handleRequestChange()}
        >
          <Link to="/">
            <img
              src={`${document.location.origin}/images/main_logo.png`}
              alt="Myrna Colley-Lee Costume Collection Logo"
              style={{ width: '100%' }}
            />
          </Link>
          <MainLink to="/">
            <MenuItem
              onClick={() => {
                window.scrollTo(0, 0);
                this.handleToggle();
              }}
            >
              Home
            </MenuItem>
          </MainLink>
          <MainLink to="/about">
            <MenuItem
              onClick={() => {
                window.scrollTo(0, 0);
                this.handleToggle();
              }}
            >
              About
            </MenuItem>
          </MainLink>
          <MainLink to="/products">
            <MenuItem
              onClick={() => {
                window.scrollTo(0, 0);
                this.handleToggle();
              }}
            >
              Product
            </MenuItem>
          </MainLink>
          <MainLink to="/policies">
            <MenuItem
              onClick={() => {
                window.scrollTo(0, 0);
                this.handleToggle();
              }}
            >
              Policies
            </MenuItem>
          </MainLink>
          <MainLink to="/profile">
            <MenuItem
              onClick={() => {
                window.scrollTo(0, 0);
                this.handleToggle();
              }}
            >
              Profile
            </MenuItem>
          </MainLink>
          <MainLink to="/login">
            <MenuItem
              onClick={() => {
                window.scrollTo(0, 0);
                this.handleToggle();
              }}
            >
              {this.props.userLoggedIn ? 'Logout' : 'Login'}
            </MenuItem>
          </MainLink>
        </Drawer>
      </MobileNavContainer>
    );
  }
}

const MainLink = styled(Link)`
  color: black;
  text-decoration: none;
`;

const MobileNavContainer = styled.div`
  ${media.desktop`  display: flex !important;`} display: none;
`;

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(MobileMainNav);

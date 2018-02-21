import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import styled from 'styled-components';

const Footer = ({ userLoggedIn }) => (
  <FooterContainer userLoggedIn={userLoggedIn}>
    <a href="//www.comm.msstate.edu/">
      <img
        src="images/msstate_dept_comm_logo.png"
        alt="Mississippi State Department of Communications Logo"
      />
    </a>
    <LinkContainer>
      <a href="//lib.msstate.edu/problem/">Report a Problem</a>
      <a href="//www.msstate.edu/legal/">Legal</a>
    </LinkContainer>
    <p>
      Mississippi State University is an equal opportunity institution. Discrimination in university
      employment, programs or activities based on race, color, ethnicity, sex, pregnancy, religion,
      national origin, disability, age, sexual orientation, genetic information, status as a U.S.
      veteran, or any other status protected by applicable law is prohibited. For more information,
      please contact the Office of Compliance and Integrity.
    </p>
  </FooterContainer>
);

const FooterContainer = styled.div`
  background-color: #99729e;
  height: 200px;
  text-align: center;
  padding: 3%;
  margin-bottom: ${props => (props.userLoggedIn ? '64px' : '0px')};
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    color: black;
    text-decoration: none;
    margin: 10px;
  }
`;

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(Footer);

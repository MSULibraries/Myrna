import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import styled from 'styled-components';

const Footer = ({ userLoggedIn }) => (
  <FooterContainer userLoggedIn={userLoggedIn}>
    <a href="//www.comm.msstate.edu/">
      <CommLogo
        src="images/msstate_dept_comm_logo.png"
        alt="Mississippi State Department of Communications Logo"
      />
    </a>

    <div>
      <p>
        The Myrna Colley-Lee collection is maintained by<a href="mailto:mharris@comm.msstate.edu">
          Melanie Harris
                                                        </a>.
      </p>
    </div>

    <LinkContainer>
      <a href="http://lib.msstate.edu/problem/">Report a Problem</a>
      <a href="//www.msstate.edu/legal/">Legal</a>
    </LinkContainer>
    <LegalStatement>
      Mississippi State University is an equal opportunity institution. Discrimination in university
      employment, programs or activities based on race, color, ethnicity, sex, pregnancy, religion,
      national origin, disability, age, sexual orientation, genetic information, status as a U.S.
      veteran, or any other status protected by applicable law is prohibited. For more information,
      please contact the Office of Compliance and Integrity.
    </LegalStatement>
  </FooterContainer>
);

const CommLogo = styled.img`
  width: 100%;
  max-width: 320px;
`;

const FooterContainer = styled.div`
  background-color: #99729e;
  text-align: center;
  padding: 3%;
  margin-bottom: ${props => (props.userLoggedIn ? '64px' : '0px')};
  word-wrap: break-word;

  a {
    color: black;
    text-decoration: none;
    margin: 10px;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LegalStatement = styled.p`
  font-size: 11px;
`;

export default withTracker(() => ({
  userLoggedIn: Meteor.userId(),
}))(Footer);

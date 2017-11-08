/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { AccountsUIWrapper } from './../index';

configure({ adapter: new Adapter() });

describe('<AccountsUIWrapper/>', () => {
  it('should render', () => {
    const component = shallow(<AccountsUIWrapper AccountsUIWrapper />);
    chai.assert(component);
  });
});

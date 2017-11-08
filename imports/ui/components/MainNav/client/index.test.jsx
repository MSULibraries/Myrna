/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { MainNav } from './../index';

configure({ adapter: new Adapter() });

describe('<MainNav/>', () => {
  it('should render', () => {
    const component = shallow(<MainNav MainNav />);
    chai.assert(component);
  });
});

/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { BottomNav } from './../index';

configure({ adapter: new Adapter() });

describe('<BottomNav/>', () => {
  it('should render', () => {
    const component = shallow(<BottomNav BottomNav />);
    chai.assert(component);
  });
});

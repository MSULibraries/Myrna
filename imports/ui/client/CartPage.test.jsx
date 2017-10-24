/* eslint-env mocha */

import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import { CartPage } from './../pages/CartPage/index';

configure({ adapter: new Adapter() });

describe('<CartPage/>', () => {
  it('should render', () => {
    const component = shallow(<CartPage />);
    chai.assert(component);
  });

});

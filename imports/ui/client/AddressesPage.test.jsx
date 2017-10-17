/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import { AddressesPage } from './../pages/AddressesPage/index';

configure({ adapter: new Adapter() });

describe('<AddressesPage/>', () => {
  it('should render', () => {
    const component = shallow(<AddressesPage />);
    chai.assert(component);
  });
});

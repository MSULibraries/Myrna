/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { AddressesPage } from './../index';

configure({ adapter: new Adapter() });

describe('<AddressesPage/>', () => {
  const mockProps = { crumbs: ['a', 'b'] };
  it('should render', () => {
    const component = shallow(<AddressesPage AddressesPage />);
    chai.assert(component);
  });
});

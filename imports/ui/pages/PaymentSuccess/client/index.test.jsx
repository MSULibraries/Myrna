/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { PaymentSuccess } from './../index';

configure({ adapter: new Adapter() });

describe('<PaymentSuccess/>', () => {
  const mockProps = { crumbs: ['a', 'b'] };
  it('should render', () => {
    const component = shallow(<PaymentSuccess {...mockProps} />);
    chai.assert(component);
  });
});

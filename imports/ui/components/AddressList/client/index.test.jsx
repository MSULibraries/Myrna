/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { AddressList } from './../index';

configure({ adapter: new Adapter() });

describe('<AddressList/>', () => {
  it('should render', () => {
    const component = shallow(<AddressList
      addresses={[
          {
            company: 'Byson',
            name: 'Tyler',
            street1: 'Asbury',
            city: 'Starkville',
            state: 'Mississippi',
            zip: '39759',
          },
        ]}
    />);
    chai.assert(component);
  });
});

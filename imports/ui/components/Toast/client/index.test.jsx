/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { Toast } from './../index';

configure({ adapter: new Adapter() });

describe('<Toast/>', () => {
  it('should render', () => {
    const component = shallow(<Toast closeToast message="" open={true | false} />);
    chai.assert(component);
  });
});

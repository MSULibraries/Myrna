/* eslint-env mocha */

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { chai } from 'meteor/practicalmeteor:chai';

import { ProductCard } from './../index';

configure({ adapter: new Adapter() });

describe('<ProductCard/>', () => {
  it('should render', () => {
    const component = shallow(<ProductCard
      _id={{}}
      addProductToCart
      category=""
      description="{}"
      disabled=""
      imgSrc=""
      isAuthed={true | false}
      name=""
      oldId
      shortDescription=""
    />);

    chai.assert(component);
  });
});

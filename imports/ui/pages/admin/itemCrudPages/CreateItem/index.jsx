import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class CreateItem extends Component {
  render() {
    return (
      <div>
        <h1>Create Item </h1>
        <form>
          <label htmlFor="shortDescription">
            Short Description
            <input type="text" name="shortDescription" id="shortDescription" />
          </label>
          <label htmlFor="quality">
            Quality
            <select name="" id="">
              <option value="good">good</option>
            </select>
          </label>
        </form>
      </div>
    );
  }
}

export default CreateItem;

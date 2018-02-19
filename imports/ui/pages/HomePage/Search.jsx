import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { media } from './../../breakpoints';

class Search extends Component {
  constructor() {
    super();

    this.possibleCategories = ['Categories', 'Dress', 'Pants', 'Shirt', 'Skirt'];
    this.state = {
      activeCategory: this.possibleCategories[0],
      query: '',
      possibleCategories: this.possibleCategories,
      submitQuery: false,
    };
  }

  handleNewCategory = newCategory => {
    // If the new category isn't the one telling a user to pick something
    if (newCategory !== this.possibleCategories[0]) {
      this.setState({ activeCategory: newCategory });
    }
  };

  handleNewSearch = newQuery => {
    this.setState({ query: newQuery });
  };

  submitSearch = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ submitQuery: true });
  };

  render() {
    return (
      <Paper style={{ marginTop: '20px', marginBottom: '20px' }} zDepth={2}>
        {this.state.submitQuery && (
          <Redirect
            to={`products?searchQuery=${this.state.query}&categories=${this.state.activeCategory}`}
          />
        )}
        <form
          onSubmit={e => {
            this.submitSearch(e);
          }}
        >
          <SearchContainer>
            <DropDownContainer>
              <DropDownMenu
                value={this.state.activeCategory}
                onChange={(e, t, newCategory) => this.handleNewCategory(newCategory)}
                selectedMenuItemStyle={{
                  color: '#642F6C',
                }}
                style={{ width: '100%' }}
              >
                {this.state.possibleCategories.map(category => (
                  <MenuItem key={category} value={category} primaryText={category} />
                ))}
              </DropDownMenu>
            </DropDownContainer>

            <SearchFieldContainer>
              <TextField
                ref={input => {
                  this.nameInput = input;
                }}
                label="Search"
                hintText="Search"
                onChange={(e, newQuery) => this.handleNewSearch(newQuery)}
                style={{ marginTop: '8px' }}
                hintStyle={{ paddingBottom: '3px' }}
                underlineFocusStyle={{
                  borderColor: '#642F6C',
                }}
                fullWidth
              />
            </SearchFieldContainer>
            <SubmitButtonContainer>
              <FlatButton
                disabled={this.state.query === ''}
                label="Submit"
                onClick={() => this.submitSearch()}
                fullWidth
              />
            </SubmitButtonContainer>
          </SearchContainer>
        </form>
      </Paper>
    );
  }
}

export default Search;

const DropDownContainer = styled.div`
  ${media.tablet` width: 100%; !important;`}width: auto;
`;

const SearchContainer = styled.div`
  align-items: center;
  display: flex;
  ${media.tablet`flex-direction: column !important;`} flex-direction: row;
  justify-content: space-around;
`;

const SearchFieldContainer = styled.div`
  flex-grow: 1;
  width: 90%;
`;

const SubmitButtonContainer = styled.div`
  ${media.tablet` width: 90%; padding-right: 0px; !important;`}width: auto;
  padding-right: 24px;
`;

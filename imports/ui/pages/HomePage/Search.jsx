import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

class Search extends Component {
  constructor() {
    super();

    const possibleCategories = ['Dress', 'Pants', 'Shirts', 'Gowns'];
    this.state = {
      activeCategory: possibleCategories[0],
      query: '',
      possibleCategories,
      submitQuery: false,
    };
  }

  handleNewCategory = newCategory => {
    this.setState({ activeCategory: newCategory });
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
            <div>
              <DropDownMenu
                value={this.state.activeCategory}
                onChange={(e, t, newCategory) => this.handleNewCategory(newCategory)}
                selectedMenuItemStyle={{
                  color: '#9e52c7',
                }}
              >
                {this.state.possibleCategories.map(category => (
                  <MenuItem key={category} value={category} primaryText={category} />
                ))}
              </DropDownMenu>
            </div>

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
                  borderColor: '#9e52c7',
                }}
                fullWidth
              />
            </SearchFieldContainer>
            <SubmitButtonContainer>
              <FlatButton
                disabled={this.state.query === ''}
                label="Submit"
                onClick={() => this.submitSearch()}
              />
            </SubmitButtonContainer>
          </SearchContainer>
        </form>
      </Paper>
    );
  }
}

export default Search;

const SearchContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const SearchFieldContainer = styled.div`
  flex-grow: 1;
`;

const SubmitButtonContainer = styled.div`
  padding-right: 24px;
`;

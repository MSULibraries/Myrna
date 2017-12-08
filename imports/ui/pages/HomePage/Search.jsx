import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';

class Search extends Component {
  constructor() {
    super();

    const possibleCategories = ['Dress', 'Pants', 'Shirts', 'Gowns'];

    this.state = {
      activeCategory: possibleCategories[0],
      query: '',
      possibleCategories,
    };
  }

  handleNewCategory = newCategory => {
    this.setState({ activeCategory: newCategory });
  };

  handleNewSearch = newQuery => {
    this.setState({ query: newQuery });
  };

  render() {
    return (
      <Paper style={{ marginTop: '20px', marginBottom: '20px' }} zDepth={2}>
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
              fullWidth
              hintText="Search"
              hintStyle={{ paddingBottom: '3px' }}
              label="Search"
              onChange={(e, newQuery) => this.handleNewSearch(newQuery)}
              underlineFocusStyle={{
                borderColor: '#9e52c7',
              }}
              style={{ marginTop: '8px' }}
            />
          </SearchFieldContainer>
        </SearchContainer>
      </Paper>
    );
  }
}

export default Search;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SearchFieldContainer = styled.div`
  flex-grow: 1;
  padding-right: 24px;
`;

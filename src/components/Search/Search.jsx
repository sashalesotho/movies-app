import React, { Component } from 'react';
import './Search.css';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Input } from 'antd';

import MoviesService from '../../services/MoviesService';

export default class Search extends Component {
  moviesService = new MoviesService();

  state = {
    value: '',
  };

  componentDidMount() {
    const { searchString } = this.props;
    this.setState({ value: searchString });
  }

  componentDidUpdate(prevProp, prevState) {
    const { currentPage, handleSearch } = this.props;
    const { value } = this.state;

    if ((prevState.value !== value || prevProp.currentPage !== currentPage) && value !== '') {
      handleSearch(value, currentPage);
    }
  }

  componentWillUnmount() {
    const { setSearchString } = this.props;
    const { value } = this.state;
    setSearchString(value);
  }

  changeSearch = (event) => {
    if (event.target.value.trim().length) {
      this.setState({ value: event.target.value });
    }
  };

  render() {
    return (
      <Input
        type="text"
        placeholder="Type to search..."
        className="search"
        onInput={debounce((event) => {
          this.changeSearch(event);
        }, 1000)}
      />
    );
  }
}

Search.defaultProps = {
  handleSearch: () => {},
  currentPage: 1,
};

Search.propTypes = {
  handleSearch: PropTypes.func,
  currentPage: PropTypes.number,
  setSearchString: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
};

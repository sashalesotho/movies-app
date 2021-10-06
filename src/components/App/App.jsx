import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';

import { Alert, Pagination, Tabs } from 'antd';

import MoviesService from '../../services/MoviesService';
import { GenresProvider } from '../GenresContext/GenresContext';
import Search from '../Search/Search';
import MoviesList from '../MoviesList/MoviesList';

const { TabPane } = Tabs;

export default class App extends Component {
  moviesService = new MoviesService();

  state = {
    movies: [],
    ratedMovies: [],
    isLoading: false,
    isSearch: true,
    error: false,
    notFound: false,
    currentPage: 1,
    totalPages: null,
    sessionId: '',
    genres: null,
    searchString: '',
  };

  componentDidMount() {
    this.moviesService
      .getGenres()
      .then((res) => this.setState({ genres: res }))
      .catch((rej) => {
        this.setState({ error: rej.message });
      });

    this.moviesService
      .getSessionId()
      .then((res) => {
        this.setState({ sessionId: res });
      })
      .catch((rej) => {
        this.setState({ error: rej.message });
      });
  }

  componentDidCatch(err) {
    this.setState({ error: err });
  }

  setLoading = () => {
    this.setState((state) => ({
      isLoading: !state.isLoading,
    }));
  };

  setError = (err) => {
    this.setState({ error: err.message });
  };

  setSearchString = (value) => {
    this.setState({ searchString: value });
  };

  setSearch = (event) => {
    if (event.target.name === 'search') {
      this.setState({
        isSearch: true,
      });
    } else {
      this.setState({ isSearch: false });
    }
  };

  handleSearch = (title, page) => {
    this.setState((state) => ({
      isLoading: !state.isLoading,
      totalPages: null,
    }));

    this.moviesService
      .getMovies(title, page)
      .then((res) => {
        this.setState((state) => ({
          movies: res.results,
          isLoading: !state.isLoading,
          totalPages: res.total_pages,
          notFound: res.results.length === 0,
        }));
      })
      .catch((rej) => {
        this.setState({ error: rej.message });
      });
  };

  handleRated = (event, sesId) => {
    this.setLoading();
    this.moviesService
      .getRatedMovies(sesId)
      .then((resolve) => {
        this.setState({
          ratedMovies: resolve.results,
        });
      })
      .then(() => this.setSearch(event))
      .then(() => this.setLoading())
      .catch((reject) => {
        this.setError(reject);
      });
  };

  setCurrentPage = (page) => {
    this.setState({ currentPage: page });
  };

  content = () => {
    const { movies, isLoading, sessionId, ratedMovies, isSearch, notFound } = this.state;

    if (notFound) {
      return <p className="not-found">MOVIE NOT FOUND</p>;
    }

    return (
      <MoviesList
        movies={movies}
        ratedMovies={ratedMovies}
        isSearch={isSearch}
        isLoading={isLoading}
        sessionId={sessionId}
      />
    );
  };

  render() {
    const { sessionId, movies, isLoading, error, totalPages, currentPage, isSearch, genres, searchString } = this.state;

    return (
      <GenresProvider value={genres}>
        <div className="app">
          <div className="container">
            <Tabs centered defaultActiveKey="1">
              <TabPane
                tab={
                  <button
                    className="tabs-button"
                    type="button"
                    name="search"
                    onClick={(event) => {
                      this.setSearch(event);
                    }}
                  >
                    Search
                  </button>
                }
                key="1"
              />
              <TabPane
                tab={
                  <button
                    className="tabs-button"
                    type="button"
                    name="rated"
                    onClick={(event) => {
                      this.handleRated(event, sessionId);
                    }}
                  >
                    Rated
                  </button>
                }
                key="2"
              />
            </Tabs>

            {isSearch ? (
              <Search
                handleSearch={this.handleSearch}
                currentPage={currentPage}
                searchString={searchString}
                setSearchString={this.setSearchString}
              />
            ) : null}
            {!window.navigator.onLine ? <Alert type="warning" message="INTERNET DISCONNECTED" /> : null}
            {error ? <Alert type="error" message={`ERROR ${error}`} /> : this.content()}
            {!isLoading && movies && isSearch ? (
              <Pagination
                className="pagination"
                defaultCurrent={currentPage}
                total={totalPages * 10}
                showSizeChanger={false}
                onChange={(page) => {
                  this.setCurrentPage(page);
                }}
              />
            ) : null}
          </div>
        </div>
      </GenresProvider>
    );
  }
}

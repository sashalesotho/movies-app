import React from 'react';
import './MoviesList.css';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import Movie from '../Movie/Movie';

const MoviesList = ({ movies, isLoading, sessionId, isSearch, ratedMovies }) => {
  const renderMovies = (search) => {
    const films = search ? movies : ratedMovies;
    if (!movies) {
      return null;
    }

    const moviesCards = films.map((item) => (
      <li key={item.id} className="movies-list-item">
        <Movie
          id={item.id}
          title={item.original_title}
          overview={item.overview}
          poster={item.poster_path}
          releaseDate={item.release_date}
          averageRating={item.vote_average}
          rating={item.rating}
          genreIds={item.genre_ids}
          sessionId={sessionId}
        />
      </li>
    ));
    return moviesCards;
  };

  if (isLoading) {
    return <Spin size="large" className="spin" />;
  }

  return (
    <ul className="movies-list" type="none">
      {renderMovies(isSearch)}
    </ul>
  );
};

MoviesList.defaultProps = {
  movies: null,
  isLoading: false,
  sessionId: null,
  ratedMovies: null,
};

MoviesList.propTypes = {
  movies: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.oneOf([null])]),
  isLoading: PropTypes.bool,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  isSearch: PropTypes.bool.isRequired,
  ratedMovies: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([null])]),
};

export default MoviesList;

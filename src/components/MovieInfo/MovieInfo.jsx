import React from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import { GenresConsumer } from '../GenresContext/GenresContext';
import MoviesService from '../../services/MoviesService';

import './MovieInfo.css';

const MovieInfo = ({ title, averageRating, releaseDate, genreIds, overview, rating, sessionId, id, truncStr }) => {
  const moviesService = new MoviesService();

  let colorClass = '';
  if (averageRating <= 3) colorClass = 'red';
  else if (averageRating <= 5) colorClass = 'orange';
  else if (averageRating <= 7) colorClass = 'yellow';
  else colorClass = 'green';

  const renderGenres = (allIds, arr) => {
    const genresOfMovie = arr.map((genreId) => {
      const genre = allIds.find((item) => item.id === genreId);
      if (!genre) {
        return null;
      }
      return (
        <li className="movie-genre" key={genreId}>
          {genre.name}
        </li>
      );
    });
    return genresOfMovie;
  };

  const sizeTitle = (ttl) => {
    if (ttl.length > 25) {
      return 'large-title';
    }
    return '';
  };

  return (
    <GenresConsumer>
      {(getGenres) => (
        <div className="movie-info">
          <h1 className={`movie-title ${sizeTitle(title)}`}>{title}</h1>
          <div className={`movie-rating ${colorClass}`}>
            <p>{averageRating}</p>
          </div>
          <p className="movie-date">{releaseDate}</p>
          {genreIds.length > 0 ? (
            <ul className="movie-genres-list" type="none">
              {renderGenres(getGenres, genreIds)}
            </ul>
          ) : null}

          {window.innerWidth > 420 ? <p className="movie-overview">{truncStr(overview, title, genreIds)}</p> : null}
          <Rate
            count={10}
            allowHalf
            defaultValue={rating}
            style={{ width: `${231}px` }}
            onChange={(num) => {
              moviesService.postRate(num, id, sessionId);
            }}
          />
        </div>
      )}
    </GenresConsumer>
  );
};

MovieInfo.defaultProps = {
  releaseDate: 'no release date',
  averageRating: 0,
  overview: 'no overview',
  id: 0,
  sessionId: null,
  rating: 0,
};

MovieInfo.propTypes = {
  title: PropTypes.string.isRequired,
  releaseDate: PropTypes.string,
  averageRating: PropTypes.number,
  overview: PropTypes.string,
  id: PropTypes.number,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  rating: PropTypes.number,
  genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  truncStr: PropTypes.func.isRequired,
};

export default MovieInfo;

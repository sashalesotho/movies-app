import React from 'react';
import './Movie.css';
import { Image } from 'antd';
import PropTypes from 'prop-types';
import MovieInfo from '../MovieInfo/MovieInfo';

const Movie = ({ title, poster, releaseDate, id, averageRating, overview, sessionId, rating, genreIds }) => {
  const truncStr = (str) => {
    if (typeof str === 'undefined') {
      return '';
    }
    const idx = str.indexOf(' ', 100);
    return str.slice(0, idx).concat('…');
  };

  const posterPath = (path) => {
    if (poster === null) {
      return null;
    }
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div className="movie">
      <Image className="movie-poster" src={posterPath(poster)} alt="poster" />
      <MovieInfo
        title={title}
        id={id}
        averageRating={averageRating}
        releaseDate={releaseDate}
        genreIds={genreIds}
        overview={overview}
        rating={rating}
        sessionId={sessionId}
        truncStr={truncStr}
      />

      {window.innerWidth <= 420 ? <p className="movie-overview-mob">{truncStr(overview)}</p> : null}
    </div>
  );
};

Movie.defaultProps = {
  releaseDate: 'no release date',
  averageRating: 0,
  overview: 'no overview',
  poster: null,
  id: 0,
  sessionId: null,
  rating: 0,
};

Movie.propTypes = {
  title: PropTypes.string.isRequired,
  poster: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
  releaseDate: PropTypes.string,
  averageRating: PropTypes.number,
  overview: PropTypes.string,
  id: PropTypes.number,
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  rating: PropTypes.number,
  genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Movie;

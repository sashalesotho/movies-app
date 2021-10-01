export default class MoviesService {
  apiKey = '54443e94fe977a2256e2806672f09a87';

  apiBase = 'https://api.themoviedb.org/3';

  getResourse = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`could not fetch ${url} , recieved ${res.status}`);
    }
    const body = await res.json();
    return body;
  };

  getMovies = async (movie, page) => {
    let currentPage = page;
    if (page) {
      currentPage = `&page=${page}`;
    } else {
      currentPage = ``;
    }
    const movies = await this.getResourse(
      `${this.apiBase}/search/movie?api_key=${this.apiKey}&query=${movie}${currentPage}`
    );
    return movies;
  };

  getGenres = async () => {
    const genres = await this.getResourse(`${this.apiBase}/genre/movie/list?api_key=${this.apiKey}&language=en-US`);
    return genres.genres;
  };

  getSessionId = async () => {
    const getGuestSession = await this.getResourse(
      `${this.apiBase}/authentication/guest_session/new?api_key=${this.apiKey}`
    );
    return getGuestSession.guest_session_id;
  };

  postRate = async (stars, movieId, guestId) => {
    const response = await fetch(
      `${this.apiBase}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: stars }),
      }
    );
    await response.json();
  };

  getRatedMovies = async (sessionId) => {
    const movies = await this.getResourse(
      `${this.apiBase}/guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}`
    );
    return movies;
  };
}

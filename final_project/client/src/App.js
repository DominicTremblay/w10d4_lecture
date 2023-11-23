import './App.scss';

import useApplicationData from './hooks/useApplicationData';

function App() {
  const { movies, loading, error } = useApplicationData();

  const movieList = movies.map((movie) => (
    <li key={movie.id}>
      Title: {movie.title} Release Date: {movie.release_date} Runtime(mins):{' '}
      {movie.runtime_mins}
    </li>
  ));

  return (
    <div className="App">
      <h1>Movies</h1>

      {loading && <h3>Loading movies...</h3>}

      {error && <h3>{error}</h3>}

      {!loading && !error && <ul>{movieList}</ul>}
    </div>
  );
}

export default App;

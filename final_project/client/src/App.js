import './App.css';
import useApplicationData from './hooks/useApplicationData';

function App() {
  const { movies, setMovies, loading, error } = useApplicationData();

  const movieList = movies?.map(({ id, title, runtime_mins, release_date }) => (
    <li key={id}>
      Title: {title}
      Runtime: {runtime_mins}
      Date Release: {release_date}
    </li>
  ));

  return (
    <div className="App">
      <h1>Movie List</h1>

      <ul>{movieList}</ul>
    </div>
  );
}

export default App;

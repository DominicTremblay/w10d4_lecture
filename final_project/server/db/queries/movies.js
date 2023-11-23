const db = require('../connection');

const getMovies = async () => {
  const queryDef = {
    text: `SELECT * FROM movies;`,
  };

  const data = await db.query(queryDef);

  return data.rows;
};

const getMovieById = async (id) => {
  const queryDef = {
    text: `SELECT * FROM movies WHERE id = $1`,
    values: [id],
  };

  const data = await db.query(queryDef);

  return data.rows[0];
};

const createMovie = async (title, releaseDate, runtime) => {
  const queryDef = {
    text: `INSERT INTO movies(title, release_date, runtime_mins) VALUES ($1, $2, $3) RETURNING *`,
    values: [title, releaseDate, Number(runtime)],
  };

  const data = await db.query(queryDef);

  return data.rows[0];
};

const updateMovie = async (id, movieInfo) => {
  const setColumns = Object.keys(movieInfo).map((property, index) => `${property}=$${index + 2}`).join(', ')

  const queryDef = {
      text: `
    UPDATE movies
    SET ${setColumns}
    WHERE id = $1 RETURNING *`,
      values: [id, ...Object.values(movieInfo)],
  };

  console.log(queryDef);

  const data = await db.query(queryDef);
  return data.rows[0];
};

const deleteMovie = async (id) => {
  const queryDef = {
      text: `DELETE FROM movies WHERE id=$1 RETURNING *`,
      values: [id],
  };

  const data = await db.query(queryDef);
  return data.rows[0];
};

const getMovieGenres = async (id) => {
  const queryDef = {
      text: `
  SELECT movies.id as movie_id, title, release_date, runtime_mins, genres.id as genre_id, genre
  FROM movies
  INNER JOIN movie_genres
  ON movies.id = movie_genres.movie_id
  INNER JOIN genres
  ON movie_genres.genre_id = genres.id
  WHERE movies.id = $1
  `,
      values: [id],
  };

  const data = await db.query(queryDef);
  return data.rows;
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, getMovieGenres };

const db = require('../connection');

const getMovies = async () => {
  const queryDef = {
    text: `SELECT * FROM movies`,
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

const getGenresByMovie = async (id) => {
  const queryDef = {
    text: `SELECT
            movies.id as movie_id,
            movies.title,
            movies.release_date,
            movies.runtime_mins,
            genres.id as genre_id,
            genres.genre
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

  console.log({data})

  return data.rows;
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  getGenresByMovie
};

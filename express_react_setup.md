# Express Back-End with React Front-End

## Git Worflow

* [Git Worflow](./git_workflow.md)

## Back-End Setup

We have a few options to setup the back-end:

1. use an existing boilderplate (midterm)
2. use the `express generator`
3. start from scratch

### 1. use an existing boilerplate

* [The midterm boilerplate](https://github.com/lighthouse-labs/node-skeleton)  


### 1.1 Repo Setup

* create a `<project_name>`
* clone your midterm `node-skeleton` and name your destination folder `server`
* example:

`git clone git@github.com:<your_github_username>/node-skeleton.git server`

* change the port to 3001 in `server.js` (optional)
* copy .env.example to .env
* `npm i`

### 1.2 database setup

* create the database: `createdb final_project_name -O labber`
* enter your database details in `.env`
* create your schema files in `db/schema`

1.2.1 `db/schema/01_movies.sql`

```sql
DROP TABLE IF EXISTS movies CASCADE;
CREATE TABLE movies (
    id SERIAL PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    release_date TIMESTAMP NOT NULL,
    runtime_mins INTEGER NOT NULL
);
```

1.2.2 `db/schema/02_genres.sql`

```sql
DROP TABLE IF EXISTS genres CASCADE;
CREATE TABLE genres (
    id SERIAL PRIMARY KEY NOT NULL,
    genre TEXT NOT NULL
);
```

1.2.3 `db/schema/03_movie_genres.sql`

```sql
DROP TABLE IF EXISTS movie_genres CASCADE;
CREATE TABLE movie_genres (
    id SERIAL PRIMARY KEY NOT NULL,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE
);
```

1.2.4 `db/seeds/01_movies.sql`

```sql
INSERT INTO movies (title, release_date, runtime_mins) VALUES ('Prey', '2022-08-22', 99);
INSERT INTO movies (title, release_date, runtime_mins) VALUES ('Top Gun: Maverick', '2022-05-22', 130);
INSERT INTO movies (title, release_date, runtime_mins) VALUES ('Everything Everywhere All at Once', '2022-03-25', 139);
INSERT INTO movies (title, release_date, runtime_mins) VALUES ('Elvis', '2022-06-24', 159);
```

1.2.5 `db/seeds/02_genres.sql`

```sql
  INSERT INTO genres (genre) VALUES ('Action');
  INSERT INTO genres (genre) VALUES ('Adventure');
  INSERT INTO genres (genre) VALUES ('Comedy');
  INSERT INTO genres (genre) VALUES ('Crime');
  INSERT INTO genres (genre) VALUES ('Documentary');
  INSERT INTO genres (genre) VALUES ('Drama');
  INSERT INTO genres (genre) VALUES ('Fantasy');
  INSERT INTO genres (genre) VALUES ('Musical');
  INSERT INTO genres (genre) VALUES ('Mystery');
  INSERT INTO genres (genre) VALUES ('Mystery');
  INSERT INTO genres (genre) VALUES ('Science Fiction');
  INSERT INTO genres (genre) VALUES ('Thriller');
```

1.2.6 `db/seeds/03_movie_genres.sql`

```sql
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1,1);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1,2);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2,1);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2,6);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3,1);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3,2);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3,3);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (4,6);
INSERT INTO movie_genres (movie_id, genre_id) VALUES (4,9);
```

1.2.7 run `npm run db:reset`

### 1.3 Create the queries

1.3.1 Create the movie queries

* `db/queries/movieQueries.js`

```js
import db from '../connection.js';

const getMovies = async () => {
    const data = await db.query('SELECT * FROM movies;');
    return data.rows;
};

const getMovieById = async (id) => {
    const queryDef = {
        text: 'SELECT * FROM movies WHERE id=$1',
        values: [id],
    };
    const data = await db.query(queryDef);
    return data.rows[0];
};

const createMovie = async ({
    title,
    release_date,
    runtime_mins
}) => {
    const queryDef = {
        text: 'INSERT INTO movies (title, release_date, runtime_mins) VALUES ($1, $2, $3) RETURNING *',
        values: [title, release_date, Number(runtime_mins)],
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
```

### 1.4 Create the routes

1.4.1 Create `routes/movieRoutes.js`

```js
const express = require('express');
const {
  createMovie,
  deleteMovie,
  getMovieById,
  getMovieGenres,
  getMovies,
  updateMovie,
} = require('../db/queries/movies.js');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await getMovies();
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const movie = await getMovieById(id);
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await createMovie(req.body);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {

  const id = Number(req.params.id);

  try {
    const data = await updateMovie(id, req.body);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const data = await deleteMovie(id);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/genres', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await getMovieGenres(id);
    const data = result.reduce(
      (result, next) => {
        result.genres.push({
          genre_id: next.genre_id,
          genre: next.genre,
        });
        delete next.genre;
        delete next.genre_id;
        return Object.assign(result, next);
      },
      { genres: [] }
    );
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

### 1.4 Add the Router to the Server

1.4.1 in `server.js`

```js
const movieRoutes = require('./routes/movies.js');

app.use('/api/movies', movieRoutes);
```

1.4.2 in `server.js`

- add `json` body parser

`app.use(express.json());`

## Install the Front-End

### 1. Setup

1.1 Install React

At the root of the project folder, type the following:

 `npx create-react-app client`

1.2 Install Axios

 `npm install axios`

1.3 Add a Proxy in `package.json`

```js
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:3001",

...

}
```

### 2. Create a `useApplicationData` custom hook with a `useEffect` hook to load the movies

- Create `src/hooks/useApplicationData.js`

```js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApplicationData = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getMovies = async () => {
    try {
      const result = await axios({
        url: '/api/movies',
        method: 'GET',
      });

      setLoading(false);
      
      // this depends on what your api is returning as a key
      setMovies(result.data.data);

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return {movies, loading, error};
};

export default useApplicationData;
```


### 3. Display the list of movies in App

```js
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

```

To use Sass, install node-sass

 `npm i node-sass`

## Ports

* React front-end is running on port 3000
* Rails back-end is running on port 3001 (or any other)

## Cors

**Cross-Origin Resource Sharing**

* A web application makes a cross-origin HTTP request when it requests a resource that has a different domain (i.e. different ports)
* Web application using APIs can only request HTTP resources from the same origin the application was loaded from, unless the response from the other origin includes the right CORS headers.

## Proxy API Calls on The Client

Add a proxy to package.json:

```js
{
    "name": "client",
    "version": "0.1.0",
    "private": true,
    "proxy": "http://localhost:3001",
    ...
```

## References

[Create React App with an Express Backend](https://daveceddia.com/create-react-app-express-backend/)

[Access-Control-Allow-Origin: Dealing with CORS Errors in React and Express](https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/)



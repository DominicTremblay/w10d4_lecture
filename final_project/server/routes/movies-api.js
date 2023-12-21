const express = require('express');
const {
  getMovies,
  getMovieById,
  getGenresByMovie,
  createMovie,
} = require('../db/queries/movies');
const router = express.Router();


router.post('/', async (req, res) => {
  const { title, release_date, runtime_mins } = req.body;

  try {
    const data = await createMovie(title, release_date, runtime_mins);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await getMovies();

    console.log({ data });

    res.json({ data });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  // id is of type string
  const { id } = req.params;

  try {
    const data = await getMovieById(Number(id));

    res.json({ data });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get('/:id/genres', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getGenresByMovie(Number(id));

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
    res.json({ error: err.message });
  }
});



module.exports = router;

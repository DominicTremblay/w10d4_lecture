const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieGenres,
} = require('../db/queries/movies');

router.get('/', async (req, res) => {
  try {
    const data = await getMovies();

    console.log({ data });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const data = await getMovieById(Number(id));
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, release_date, runtime_mins } = req.body;

  console.log('Body', req.body);

  try {
    const data = await createMovie(title, release_date, runtime_mins);
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
});

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

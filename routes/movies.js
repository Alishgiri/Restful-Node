const express = require("express");

const { Genre } = require("../models/genre");
const { Movie, validateMovie } = require("../models/movie");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.post("/", async ({ body }, res) => {
  const { error } = validateMovie(body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  const genre = await Genre.findById(body.genreId);
  if (!genre) return res.status(400).send("Invalid genre!");
  const movie = new Movie({
    title: body.title,
    numberInStock: body.numberInStock,
    dailyRentalRate: body.dailyRentalRate,
    genre: { _id: genre._id, name: genre.name }
  });
  await movie.save();
  res.send(movie);
});

router.put(":id", async ({ body }, res) => {
  const { error } = validateMovie(body);
  if (error) return res.status(400).send("Invalid request!");
  const genre = await Genre.findById(body.genreId);
  if (!genre) return res.status(404).send("Genre with the id not found!");
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: body.title,
      numberInStock: body.numberInStock,
      dailyRentalRate: body.dailyRentalRate,
      genre: { _id: genre._id, name: genre.name }
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("Movie with the id not found!");
  res.send(movie);
});

router.delete(":id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("Movie with the id not found.");
  res.send(movie);
});

module.exports = router;

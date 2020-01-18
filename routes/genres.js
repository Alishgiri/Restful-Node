const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validateCourse } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  throw new Error("Could not get genres.");
  const genres = await Genre.find().sort("name");
  return res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    // 400 Bad Request
    return res.status(400).send(error.details[0].message);
  }
  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true } // to get the updated genre
  );
  if (!genre) return res.status(404).send({ message: "Item not found!" });
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    // 404 Not Found
    res.status(404).send({ message: "genre with the id not found!" });
  } else {
    res.send(genre);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    // 404 Not Found
    res.status(404).send({ message: "genre with the id not found!" });
  }
  res.send(genre);
});

module.exports = router;

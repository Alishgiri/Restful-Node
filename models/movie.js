const Joi = require("joi");
const mongoose = require("mongoose");

const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, default: 0, min: 0, max: 255 },
  dailyRentalRate: { type: Number, default: 0, min: 0, max: 255 },
  title: { type: String, required: true, trim: true, min: 5, max: 255 }
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = {
    genreId: Joi.objectId().required(),
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    numberInStock: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required()
  };
  return Joi.validate(movie, schema);
}

module.exports = { Movie, validateMovie };

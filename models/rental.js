const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        trim: true,
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
      },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true, minlength: 5, maxlength: 50 }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        trim: true,
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

module.exports = { Rental, validateRental };

const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    trim: true,
    type: String,
    minlength: 4,
    maxlength: 50,
    required: true
  },
  email: {
    trim: true,
    type: String,
    minlength: 4,
    unique: true,
    maxlength: 255,
    required: true
  },
  password: {
    trim: true,
    type: String,
    minlength: 6,
    required: true,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(4)
      .max(50)
      .required(),
    email: Joi.string()
      .min(4)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = { User, validateUser };

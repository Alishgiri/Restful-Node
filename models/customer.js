const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, required: true },
    isGold: { type: Boolean, default: false },
    phone: { type: Number, required: true, minlength: 2 }
  })
);

function validateCustomer(customer) {
  const schema = {
    phone: Joi.number().required(),
    name: Joi.string()
      .min(2)
      .required(),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;

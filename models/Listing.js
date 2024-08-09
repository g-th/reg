const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  sity: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  
  coordinates: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  isVIP: {
    type: Boolean,
    default: false,
  },
  kode: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: false,
  },
  description: {
    type: String,
    required: false,
  },
  electrisity: {
    type: String,
    required: false,
  },
  water: {
    type: Boolean,
    required: false,
  },
  naturalGas: {
    type: Boolean,
    required: false,
  },
  floor: {
    type: Number,
    required: false,
  },
  bathroom: {
    type: Boolean,
    required: false,
  },
  internet: {
    type: boolean,
    required: false,
  },
  curentCondition: {
    type: String,
    required: false,
  },
 
});
module.exports = mongoose.model("Listing", listingSchema);

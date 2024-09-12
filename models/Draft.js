const mongoose = require("mongoose");
const DraftSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  sity: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  
  coordinates: {
    type: String,
    required: false,
  },
  area: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: false,
  },
  isVIP: {
    type: Boolean,
    default: false,
  },
  kode: {
    type: String,
    required: false,
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
    type: Boolean,
    required: false,
  },
  curentCondition: {
    type: String,
    required: false,
  },
 
});
module.exports = mongoose.model("Draft", DraftSchema);
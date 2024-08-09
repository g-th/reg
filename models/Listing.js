const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  address: {
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
});
module.exports = mongoose.model("Listing", listingSchema);

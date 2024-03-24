const mongoose = require("mongoose");
const listingImageSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("ListingImage", listingImageSchema);

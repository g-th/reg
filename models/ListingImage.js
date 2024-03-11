const mongoose = require("mongoose");
const listingImageSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
  },

  imageName: {
    type: String,
    required: true,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});
module.exports = mongoose.model("ListingImage", listingImageSchema);

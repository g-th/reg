const mongoose = require("mongoose");
const savedItemsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  listingId:{
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("SavedItems", savedItemsSchema);
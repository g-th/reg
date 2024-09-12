const mongoose = require("mongoose");
const DraftImageSchema = new mongoose.Schema({
  DraftId: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },

});
module.exports = mongoose.model("DraftImage", DraftImageSchema);

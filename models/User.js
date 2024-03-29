const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  contactnumber: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("User", userSchema);

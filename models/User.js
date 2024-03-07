const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },

  lastname: {
    type: String,
  },
  buisnestype: {
    type: String,
  },
  contactnumber: {
    type: String,
    unique: true,
    index: true,
  },
  birthdate: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    unique: true,
    index: true,
  },
  password: {
    type: String,
  },
});
module.exports = mongoose.model("User", userSchema);

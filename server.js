const express = require("express");
const app = express();
const User = require("./models/User");

const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));

app.use(express.json());

app.post("/register", async (req, res) => {
  const user = new User({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    buisnestype: req.body.buisnesType,
    contactnumber: req.body.contactNumber,
    birthdate: req.body.birthDate,
    email: req.body.email,
    username: req.body.userName,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.listen(3000, () => {
  console.log("server started");
});

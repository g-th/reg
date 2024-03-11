const express = require("express");
const app = express();
const User = require("./models/User");
const Listing = require("./models/Listing");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./auth");
const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));

app.use(express.json());
app.use(cors());
app.post("/addListing", auth, async (req, res) => {
  const { userId, address, area, type, price, isVIP, kode, views } = req.body;
  const listing = new Listing({
    userId,
    address,
    area,
    type,
    price,
    isVIP,
    kode,
    views,
  });

  try {
    const newListing = await listing.save();
    console.log(newListing);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    buisnestype: req.body.buisnesType,
    contactnumber: req.body.contactNumber,
    birthdate: req.body.birthDate,
    email: req.body.email,
    username: req.body.userName,
    password: passwordHash,
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

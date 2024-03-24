const express = require("express");
const app = express();
const User = require("./models/User");
const Listing = require("./models/Listing");
const ListingImage = require("./models/ListingImage");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const filesPayloadExists = require("./middleware/filesPayloadExists");

const fileSizeLimiter = require("./middleware/filesSizeLimiter");
const fileExtLimiter = require("./middleware/filesExtLimiter");
const auth = require("./middleware/auth");
const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));

app.use(express.json());
app.use(cors());

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  async (req, res) => {
    const files = req.files;
    console.log(files);

    const { userId, address, area, type, price, kode } = req.body;
    const listing = new Listing({
      userId: userId,
      address: address,
      area: area,
      type: type,
      price: price,
      kode: kode,
    });
    let listingId = "";
    try {
      const newListing = await listing.save();
      console.log(newListing);
      listingId = newListing._id;
      console.log(listingId);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
    Object.keys(files).forEach(async (key) => {
      const filepath = path.join(__dirname, "files", files[key].name);
      try {
        const listingImage = new ListingImage({
          listingId: listingId,
          path: filepath,
        });
        const savedImage = await listingImage.save();
        console.log(savedImage);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
      files[key].mv(filepath, (err) => {
        if (err) return res.status(500).json({ status: "error", message: err });
      });
    });

    return res.json({
      status: "success",
      message: Object.keys(files).toString(),
    });
  }
);

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
    //buisnestype: req.body.buisnesType,
    contactnumber: req.body.contactNumber,
    // birthdate: req.body.birthDate,
    email: req.body.email,
    // username: req.body.userName,
    password: passwordHash,
  });

  try {
    const newUser = await user.save();
    console.log(newUser);
    delete newUser.password;
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("server started");
});

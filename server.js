const express = require("express");
const app = express();
const User = require("./models/User");
const Listing = require("./models/Listing");
const ListingImage = require("./models/ListingImage");
const SavedItem=require("./models/SavedItem");
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
app.get("/image/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const image = await ListingImage.findById(req.params.id);
    console.log(image.path);
    res.sendFile(image.path);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/getListing/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const listing = await Listing.findById(id);
    const images = await ListingImage.find({ listingId: id });
    res.status(200).json({ listing, images });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
app.put("/listing", async (req, res) => {
  try{
  const { listing} = req.body;
  const updatedListing=await Listing.findOneAndUpdate({_id : listing._id}, listing,  {
    new: true
  });
  res.status(200).json(updatedListing);
}catch(err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
  
})
app.delete("/listing/:id", async (req, res) => {
  try{
    const id = req.params.id;
  await Listing.deleteOne({_id:id})
  await ListingImage.deleteMany({listingId:id})
  res.status(200);
}catch(err) {
  console.log(err);
  res.status(500);
}
  
})
app.get("/getListings" /*/:page*/, async (req, res) => {
  //carielze qrashavs gaaswore
  try {
    //const page = parseInt(req.params.page);
    const listings = await Listing.find({}).limit(20);
    //.skip(page * 10);
    const list = await Promise.all(
      listings.map(async (listing) => {
        const images = await ListingImage.find({
          listingId: listing._id.toString(),
        });
        return { listing, images };
      })
    );
    console.log(list);

    res.status(200).json({ list });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//get user listingis amtvirtavi
//passwords abrunebs washale
app.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    let us={
      _id:user.id,
      firstname:user.firstname,
      lastname:user.lastname,
      contactnumber:user.contactnumber,
      email:user.email

    }
    
    res.status(200).json(us);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
// useris gancxadebebi

//suratebic gamoushvas
app.get("/listingsByUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const listings = await Listing.find({userId:id});
    const list = await Promise.all(
      listings.map(async (listing) => {
        const images = await ListingImage.find({
          listingId: listing._id.toString(),
        });
        let imageIds=[]
        images.forEach((e)=>{
          imageIds.push(e.id)
        })
        return { listing, imageIds};
      })
    );
    console.log(list);
    res.status(200).json(list);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/views/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const l= await Listing.findById(id);
    const v=l.views+1

    const listing = await Listing.findOneAndUpdate({_id : id}, {views:v},  {
      new: true
    });
    
    res.status(200).json(listing.views);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


app.post("/savedItem", async (req, res) => {
  try {
    const{userId,listingId}=req.body;
    const savedItem=new SavedItem({
      userId,
      listingId
    })
    const item=await savedItem.save();
    res.status(200).json({ item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
app.get("/savedItems/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const savedItems=await SavedItem.find({userId:id})
    const list = await Promise.all(
      savedItems.map(async (savedItem) => {
        const listing=await  Listing.findById(savedItem.listingId)
        const images = await ListingImage.find({
          listingId: savedItem.listingId,
        });
        return { listing, images };
      }));
    res.status(200).json({list});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
app.delete("/savedItem", async (req, res) => {
  try {
    const{userId,listingId}=req.body;
    const item=await SavedItem.delete({userId:userId,listingId:listingId})
    res.status(200);
  } catch (err) {  
    res.status(500);
  }
})
app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  async (req, res) => {
    const files = req.files;
    console.log(files);

    const { userId, sity,region,address, coordinates, area, type, price, kode,description ,electrisity,water,naturalGas,floor,bathroom,internet,curentCondition} = req.body;
    const listing = new Listing({
      userId: userId,
      address: address,
      area: area,
      type: type,
      price: price,
      kode: kode,
      sity: sity,
      region: region,
      coordinates:coordinates,
      description:description,
      electrisity:electrisity,
      water:water,
      naturalGas:naturalGas,
      floor:floor,
      bathroom:bathroom,
      internet:internet,
      curentCondition:curentCondition
      


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
      message: Object.keys(files).toString() + listingId,
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
//fartis tipi  kvebis obieqti, sawyobi, saofise, yvela bazashi da lidting idebi ....bolosken
//forgot password gaakete, modis email da gaagzavne kodi, tu kodi sworia shevcvalot paroli
//listingis edit da washla ----es gaakete//

//draftebis cxrili arasruli listingebis shenaxva, get drafts by user , update,delete
//saved items userma unda sheinaxos listingebi userid - listing cxrili------meore
//save as drafts listings moxseni requiredebi...........bolosken

//admin panel
//useris rest api...
//listing rest api
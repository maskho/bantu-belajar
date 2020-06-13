const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const User = require("../../models/User");

cloudinary.config({
  cloud_name: "dkazavkbg",
  api_key: "243347769785551",
  api_secret: "fM1ZmMMotBJyEgf3u3XpfxQhJik",
});
//MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

//@route POST api/profile/
//@desc ngirim data profile user
router.post("/", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (!user) {
      console.log("user tidak ditemukan");
      res.json({
        userNotFound: "user tidak ditemukan",
      });
    } else {
      res.status(200).send({
        user,
      });
    }
  });
});
// @route POST api/profile/upload
// @desc menyimpan gambar ke cloud
router.post("/upload", (req, res, next) => {
  const upload = multer({ storage }).single("photo");
  upload(req, res, function (err) {
    if (err) {
      return res.send(err);
    }
    console.log("file diupload ke server");
    console.log(req.file);

    //mengirim file ke CLoudinary
    const path = req.file.path;
    const uniqueFilename = new Date().toISOString();
    cloudinary.uploader.upload(
      path,
      { public_id: "bbusers/" + uniqueFilename, tags: "bbusers" },
      function (err, image) {
        if (err) return res.send(err);
        console.log("file diupload ke cloudinary");
        const fs = require("fs");
        fs.unlinkSync(path);
        res.send(image.url);
      }
    );
  });
});

//@route PUT api/profile/firstname
//@desc update nama depan
router.put("/updateprofile", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      let newemail = req.body.newemail;
      let firstname = req.body.firstname;
      let lastname = req.body.lastname;
      let gender = req.body.gender;
      let bio = req.body.bio;
      let dob = req.body.dob;
      let photo = req.body.photo;
      let address = req.body.address;
      if (newemail) {
        user.email = newemail;
      }
      if (firstname) {
        user.firstname = firstname;
      }
      if (lastname) {
        user.lastname = lastname;
      }
      if (bio) {
        user.bio = bio;
      }
      if (gender) {
        user.gender = gender;
      }
      if (dob) {
        user.dob = dob;
      }
      if (photo) {
        user.photo = photo;
      }
      if (address) {
        user.address = address;
      }
      user.save();
      res.status(200).json({ message: "data user selesai diupdate" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});

module.exports = router;

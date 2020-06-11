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
// let cloudinaryStorage = multerCloudinary({ cloudinary: cloudinary });
// let cloudinaryUpload = multer({ storage: cloudinaryStorage });
// router.put(
//   "/gambar",
//   cloudinaryUpload.fields([{ name: "photo", maxCount: 1 }])
// );

// app.use(fileUpload());

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
//@route PUT api/profile/updatephoto
//@desc update photo profile ke db
router.put("/updatephoto", (req, res) => {
  if (req.body.photo == null)
    res.status(200).json({ message: "masukkan url foto" });
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      user.photo = req.body.photo;
      user.save();
      res.status(200).json({ message: "foto profil diupdate di db" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});
//@route PUT api/profile/firstname
//@desc update nama depan
router.put("/firstname", (req, res) => {
  if (req.body.firstname == null)
    res.status(200).json({ message: "harap isikan nama depan" });
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      user.firstname = req.body.firstname;
      user.save();
      res.status(200).json({ message: "firstname diupdate" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});
//@route PUT api/profile/lastname
//@desc update nama belakang
router.put("/lastname", (req, res) => {
  if (req.body.lastname == null)
    res.status(200).json({ message: "harap isikan nama belakang" });
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      user.lastname = req.body.lastname;
      user.save();
      res.status(200).json({ message: "lastname diupdate" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});
//@route PUT api/profile/email
//@desc update email
router.put("/email", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      user.email = req.body.newemail;
      user.save();
      res.status(200).json({ message: "email diupdate" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});
//@route PUT api/profile/gender
//@desc update gender
router.put("/gender", (req, res) => {
  if (req.body.gender == null)
    res.status(200).json({ message: "harap isikan jenis kelamin" });
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      user.gender = req.body.gender;
      user.save();
      res.status(200).json({ message: "gender diupdate" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});
//@route PUT api/profile/dob
//@desc update tanggal lahir
router.put("/dob", (req, res) => {
  if (req.body.dob == null)
    res.status(200).json({ message: "harap isikan tanggal lahir" });
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      user.dob = req.body.dob;
      user.save();
      res.status(200).json({ message: "date of birth diupdate" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});
//@route PUT api/profile/bio
//@desc update biografi
router.put("/bio", (req, res) => {
  if (req.body.bio == null)
    res.status(200).json({ message: "harap isikan bio" });
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      user.bio = req.body.bio;
      user.save();
      res.status(200).json({ message: "biografi diupdate" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diupdate",
      });
    }
  });
});

module.exports = router;

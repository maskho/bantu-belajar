const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load validasi input
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
//load model user
const User = require("../../models/User");

//@route POST api/users/register
//@desc Register user
//@access Public
router.post("/register", (req, res) => {
  console.log(req.body);
  //validasi isian input
  const { errors, isValid } = validateRegisterInput(req.body);
  //cek Validasi
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //cek user didatabase kalo kaga ada, buat baru
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email sudah terdaftar" });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      });
      //hash password sebelum disimpan di db
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

//@route POST api/users/login
//@desc Login user -> return JWT token
//@access Public
router.post("/login", (req, res) => {
  //validasi input
  const { errors, isValid } = validateLoginInput(req.body);
  //cek validasi
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //cari database user via email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email tidak ditemukan" });
    }
    //cek password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user cocok
        //bikin JWT payload
        const payload = {
          id: user.id,
          email: user.email,
        };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 2592997, //1 bulan
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ passwordincorrect: "Password salah" });
      }
    });
  });
});
module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// const xoauth2 = require("xoauth2");
//const SMTPConnection = require("nodemailer/lib/smtp-connection");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bantubelajar97@gmail.com",
    pass: "belajarbantu97",
  },
});

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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
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

//@route POST api/users/forgotpassword
//@desc lupa password -> kirim email ama token
//@access Public
router.post("/forgotpassword", (req, res) => {
  const email = req.body.email;

  if (email === "") {
    res.status(400).send("email dibutuhkan");
  }
  console.error(email);
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email tidak ditemukan" });
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 86400, //1 hari
      });

      const mailOptions = {
        from: "BantuBelajar97@gmail.com",
        to: { email },
        subject: "Link untuk Reset Password",
        text:
          "Anda menerima email ini karena anda (atau mungkin orang lain) berupaya meminta untuk reset password.\n" +
          "Harap klik link dibawah ini, atau salin link ini ke browser anda untuk melanjutkan proses:\n " +
          "http:localhost:5000/reset/" +
          { token } +
          "\n\nJika anda merasa tidak melakukan permintaan ini, harap abaikan pesan ini dan password anda akan tetap sama seperti sebelumnya.",
      };
      // console.log("mengirim email...");

      transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
          console.error("terjadi kesalahan: ", err);
        } else {
          console.log("berikut responsnya: ", res);
          res.status(200).json("recovery email terkirim");
        }
      });
    }
  });
});
//@route GET api/users/reset
//@desc reset password -> cek kadaluarsa
//@access Public
router.get("/reset", (req, res, next) => {
  User.findOne({
    $where: {
      resetPasswordToken: req.query.resetPasswordToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    },
  }).then((user) => {
    if (user == null) {
      console.log("password reset link tidak valid atau sudah kadaluarsa");
      res.json("password reset link tidak valid atau sudah kadaluarsa");
    } else {
      res.status(200).send({
        username: user.username,
        message: "password reset link a-ok",
      });
    }
  });
});
//@route PUT api/users/updatepassword
//@desc update password baru
//@access Public
router.put("/updatepassword", (req, res, next) => {
  User.findOne({
    $where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user != null) {
      console.log("user exists in db");
      bcrypt
        .genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt).then((hashedPassword) => {
            user.update({
              password: hashedPassword,
              resetPasswordExpires: null,
              resetPasswordToken: null,
            });
          });
        })
        .then(() => {
          console.log("password diupdate");
          res.status(200).send({ message: "password diupdate" });
        });
    } else {
      console.log("tidak ada user pada database untuk diupdate");
      res.status(404).json("tidak ada user pada database untuk diupdate");
    }
  });
});
module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const User = require("../../models/User");

const API_URL = "https://authbb.herokuapp.com";
//membuat transporter untuk mengirim email via gmail
//setting gmail less secure app dulu. minusnya email yg dikirim masuk spam
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bantubelajar97@gmail.com",
    pass: "belajarbantu97",
  },
});
router.get("/", (req, res) => {
  res.status(200).json({ bantubelajar: "Hai lur, welcome to the jungle" });
});
//@route POST api/users/register
//@desc untuk register user baru
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

          //membuat token untuk verifikasi email
          let token = crypto.randomBytes(20).toString("hex");
          newUser.verificationToken = token;
          console.log(user);

          //membuat template email
          let recipient = JSON.stringify(newUser.email);
          const mailOptions = {
            from: "BantuBelajar97@gmail.com",
            to: recipient,
            subject: "Link untuk Verifikasi Email",
            text:
              "Anda menerima email ini karena anda (atau mungkin orang lain) telah mendaftar Platform Bantu Belajar.\n" +
              "Harap klik link dibawah ini, atau salin link ini ke browser anda untuk melanjutkan proses:\n " +
              API_URL +
              "/api/users/verif/?verificationToken=" +
              token +
              "\n\nJika anda merasa tidak melakukan pendaftaran ini, harap abaikan pesan ini.",
          };
          //mengirim email lewat transporter
          transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
              console.error("terjadi kesalahan: ", err);
            } else {
              console.log("berikut responsnya: ", res);
              res.status(200).json("verifikasi email terkirim");
            }
          });
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
      return res.status(404).json({ emailnotfound: "Email tidak ditemukan." });
    }
    //cek password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user cocok
        //bikin JWT payload
        const payload = {
          id: user.id,
          firstname: user.firstname,
        };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 2592997, //kadaluarsa dalam 1 bulan
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

//@route GET api/users/verif
//@desc reset password -> cek kadaluarsa token
router.get("/verif", (req, res) => {
  //let params = new URL(document.location).searchParams;
  let verificationToken = req.query.verificationToken;
  User.findOne({
    verificationToken,
  }).then((user) => {
    if (!user) {
      return res
        .status(404)
        .json({ verificationTokenNotFound: "Link verifikasi tidak valid" });
    } else {
      res.status(200).send({
        email: user.email,
        message: "verification link a-ok",
      });
    }
  });
});

//@route PUT api/users/updateverif
//@desc update password baru
router.put("/updateverif", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      //console.log("user exists in db");
      user.isVerified = true;
      user.verificationToken = "";
      user.save();
      res.status(200).json({ message: "telah terverifikasi" });
    } else {
      return res.status(404).json({
        userNotFound: "tidak ada user pada database untuk diverifikasi",
      });
    }
  });
});

//@route POST api/users/forgotpassword
//@desc lupa password -> kirim email n token
//error
router.post("/forgotpassword", (req, res) => {
  const email = req.body.email;
  if (email == "") {
    res.status(400).send("email dibutuhkan");
  }
  console.error(email);
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email tidak ditemukan" });
    } else {
      //membuat token untuk reset password
      let token = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = token;
      console.log(user);
      //membuat template email
      let recipient = JSON.stringify(email);
      const mailOptions = {
        from: "Bantu@belajar.com",
        to: recipient,
        subject: "Link untuk Reset Password",
        text:
          "Anda menerima email ini karena anda (atau mungkin orang lain) berupaya meminta untuk reset password.\n" +
          "Harap klik link dibawah ini, atau salin link ini ke browser anda untuk melanjutkan proses:\n " +
          API_URL +
          "/api/users/reset/?resetPasswordToken=" +
          token +
          "\n\nJika anda merasa tidak melakukan permintaan ini, harap abaikan pesan ini dan password anda akan tetap sama seperti sebelumnya.",
      };
      //mengirim email lewat transporter
      transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
          console.error("terjadi kesalahan: ", err);
        } else {
          console.log("berikut responsnya: ", res);
          res.status(200).json("recovery email terkirim");
        }
      });
      user
        .save()
        .then((user) => res.json(user))
        .catch((err) => console.log(err));
    }
  });
});

//@route GET api/users/reset
//@desc reset password -> cek kadaluarsa token
router.get("/reset", (req, res) => {
  User.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
  }).then((user) => {
    if (!user) {
      console.log("password reset link tidak valid atau sudah kadaluarsa");
      res.json({
        userNotFound: "password reset link tidak valid atau sudah kadaluarsa",
      });
    } else {
      res.status(200).send({
        email: user.email,
        message: "password reset link a-ok",
      });
    }
  });
});

//@route PUT api/users/updatepassword
//@desc update password baru
router.put("/updatepassword", (req, res) => {
  if (req.body.password == null)
    res.status(200).json({ message: "harap isikan password" });
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt).then((hashedPassword) => {
          user.password = hashedPassword;
          resetPasswordToken = "";
          user.save();
          res.status(200).json({ message: "password diupdate" });
        });
      });
    } else {
      res
        .status(404)
        .json({ message: "tidak ada user pada database untuk diupdate" });
    }
  });
});
module.exports = router;

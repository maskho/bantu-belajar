const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");
// const xoauth2 = require("xoauth2");
//const SMTPConnection = require("nodemailer/lib/smtp-connection");
//const { google } = require("googleapis");
//const { OAuth2 } = google.auth;
//const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const mailgun = require("mailgun-js");
const DOMAIN = "sandbox27008edc797e419dbc3a42750c8ac278.mailgun.org";
const mg = mailgun({
  apiKey: "b001c09a0024495ba8dd8efbfaf512cc-a2b91229-50c253b8",
  domain: DOMAIN,
});

//require("dotenv").config();
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
      const data = {
        from:
          "Mailgun Sandbox <postmaster@sandbox27008edc797e419dbc3a42750c8ac278.mailgun.org>",
        to: "syeh.ak@gmail.com",
        subject: "Hello",
        text: "Testing some Mailgun awesomness!",
      };
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });
      // const token = crypto.randomBytes(20).toString("hex");
      // user.update({
      //   resetPasswordToken: token,
      //   resetPasswordExpires: Date.now() + 86400, //1 hari
      // });
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     type: "OAuth2",
      //     user: "bantubelajar97@gmail.com",
      //     clientId:
      //       "200929486312-seb596vsj98nqsouj7kjpgc2bkp831lm.apps.googleusercontent.com",
      //     clientSecret: "EOpQyLd2uJKrMgDV9Kbw6isM",
      //     refreshToken:
      //       "1//047UDtMegVadoCgYIARAAGAQSNwF-L9IrmpJxTHvqSliWILXjk7f3GdDPtJtEfKvGbKzzo2BxSaESNcEb6fpj8oA94fR8-7oxKFs",
      //     accessToken:
      //       "ya29.a0AfH6SMAljdmHuuSMVybizvg8zyeqKpeib7AEurW-aas6nz-4ul46ChdDqSiN6OanVTma7_zOd0Mfcpbb_R7jeg_JEis3LpdARlGAWME5u3Rul9x8iD1G-iwW30xrZGkY_YZgwTlENZk7DTp3slCwkeEz9XnXj5BvKrA",
      //     expires: 1484314697598,
      //   },
      // });
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   service: "gmail",
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     type: "OAuth2",
      //     user: "bantubelajar97@gmail.com",
      //     clientId:
      //       "200929486312-seb596vsj98nqsouj7kjpgc2bkp831lm.apps.googleusercontent.com",
      //     clientSecret: "EOpQyLd2uJKrMgDV9Kbw6isM",
      //     refreshToken:
      //       "1//047UDtMegVadoCgYIARAAGAQSNwF-L9IrmpJxTHvqSliWILXjk7f3GdDPtJtEfKvGbKzzo2BxSaESNcEb6fpj8oA94fR8-7oxKFs",
      //     accessToken:
      //       "ya29.a0AfH6SMAljdmHuuSMVybizvg8zyeqKpeib7AEurW-aas6nz-4ul46ChdDqSiN6OanVTma7_zOd0Mfcpbb_R7jeg_JEis3LpdARlGAWME5u3Rul9x8iD1G-iwW30xrZGkY_YZgwTlENZk7DTp3slCwkeEz9XnXj5BvKrA",
      //   },
      // });

      // const mailOptions = {
      //   from: "BantuBelajar97@gmail.com",
      //   to: "maskhobar@gmail.com",
      //   subject: "Link untuk Reset Password",
      //   text:
      //     "Anda menerima email ini karena anda (atau mungkin orang lain) berupaya meminta untuk reset password.\n" +
      //     "Harap klik link dibawah ini, atau salin link ini ke browser anda untuk melanjutkan proses:\n " +
      //     "http:localhost:5000/reset/${token}\n\n" +
      //     "Jika anda merasa tidak melakukan permintaan ini, harap abaikan pesan ini dan password anda akan tetap sama seperti sebelumnya.",
      // };
      // console.log("mengirim email...");

      // transporter.sendMail(mailOptions, (err, res) => {
      //   if (err) {
      //     console.error("terjadi kesalahan: ", err);
      //   } else {
      //     console.log("berikut responsnya: ", res);
      //     res.status(200).json("recovery email terkirim");
      //   }
      // });
    }
  });
});
module.exports = router;

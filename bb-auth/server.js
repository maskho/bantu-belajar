const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const app = express();

app.use(cors());
//middleware buat parsing request body
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//config DB
const db = require("./config/keys").mongoURI;

//connect ke MongoDB Atlas
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB sukses konek"))
  .catch((err) => console.log(err));

//middleware passport
app.use(passport.initialize());
//config passport
require("./config/passport")(passport);
//routes
app.use("/api/users", users);
app.use("/api/profile", profile);
//config port menggunakan process.env.PORT untuk deploy ke Heroku
const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server gaspol on port:" + port));

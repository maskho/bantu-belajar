const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const projects = require("./routes/api/projects");
const campaigners = require("./routes/api/campaigners");
const articles = require("./routes/api/articles");
const cors = require("cors");
const app = express();
//setting cors biar bisa dipake di FE
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//setting database
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB terhubung"))
  .catch((err) => console.log(err));

module.exports = {
  Project: require("./models/Project"),
  Campaigner: require("./models/Campaigner"),
  Picture: require("./models/Picture"),
  Article: require("./models/Article"),
};

//endpoint masing-masing API
app.use("/api/campaigners", campaigners);
app.use("/api/projects", projects);
app.use("/api/articles", articles);

//setting port, kalo dah deploy biar diatur Heroku sana
var port = process.env.PORT || 4000;

//sapaan ramah
app.get("/", (req, res) => res.send("Halo lur"));

app.listen(port, function () {
  console.log("gas lur port:" + port);
});

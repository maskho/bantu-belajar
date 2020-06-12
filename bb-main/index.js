const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const projects = require("./routes/api/projects");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB terhubung"))
  .catch((err) => console.log(err));

app.use("/api/projects", projects);
var port = process.env.PORT || 4000;

app.get("/", (req, res) => res.send("Halo lur"));

app.listen(port, function () {
  console.log("gas lur port:" + port);
});

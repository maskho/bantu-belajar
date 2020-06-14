const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Article = require("../../models/Article");

router.get("/", (req, res) => {
  Article.find()
    .populate("gambar")
    .sort({ _id: -1 })
    .then((article) => {
      res.json(article);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.post("/detail", (req, res) => {
  Article.findById(req.body._id)
    .populate("gambar")
    .then((article) => {
      if (!article) res.send("tidak ada data proyek");
      res.send(article);
    })
    .catch(function (err) {
      res.json(err);
    });
});

module.exports = router;

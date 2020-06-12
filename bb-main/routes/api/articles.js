const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Article = require("../../models/Article");

router.get("/", (req, res) => {
  Article.find()
    .sort({ _id: -1 })
    .then((article) => {
      res.json(article);
    });
});
router.post("/detail", (req, res) => {
  Article.findById(req.body._id).then((article) => {
    if (!article) res.send("tidak ada data proyek");
    res.send(article);
  });
});

module.exports = router;

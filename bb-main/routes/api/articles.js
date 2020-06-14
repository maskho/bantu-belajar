const express = require("express");
const router = express.Router();
const Article = require("../../models/Article");

//route: GET api/articles/
//buat ambil semua data artikel diurutin dari terakhir diinput
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

//route: POST api/articles/detail
//buat ambil detail artikel dari _id
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

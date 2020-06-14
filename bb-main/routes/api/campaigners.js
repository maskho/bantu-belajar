const express = require("express");
const router = express.Router();
const Campaigner = require("../../models/Campaigner");

//route: POST api/campaigners/penggalang
//buat ambil detail penggalang donasi
router.post("/penggalang", (req, res) => {
  Campaigner.findById(req.body._id).then((penggalang) => {
    if (!penggalang) res.send("tidak ada data penggalang");
    res.send(penggalang);
  });
});

module.exports = router;

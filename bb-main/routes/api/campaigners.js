const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Campaigner = require("../../models/Campaigner");

router.post("/penggalang", (req, res) => {
  Campaigner.findById(req.body._id).then((penggalang) => {
    if (!penggalang) res.send("tidak ada data penggalang");
    res.send(penggalang);
  });
});

module.exports = router;

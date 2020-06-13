const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Campaigner = require("../../models/Campaigner");
const TaskData = require("../../models/TaskData");
const { text, query } = require("express");

//proyek donasi deadline paling mendekati akhir
router.get("/featured", (req, res) => {
  Project.find()
    .populate("penggalang")
    .populate("gambar")
    .sort({ tgl_target: 1 })
    .then((project) => {
      res.json(project);
    });
});

//proyek donasi search
router.post("/search", (req, res) => {
  Project.createIndexes({
    judul: "text",
    deskripsi: "text",
  });
  Project.find(
    { $text: { $search: req.body.search } },
    { score: { $meta: "textScore" } }
  )
    .populate("penggalang")
    .populate("gambar")
    .sort({ score: { $meta: "textScore" } })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.get("/bangunan", (req, res) => {
  Project.find({ kategori: "bangunan" })
    .populate("penggalang")
    .populate("gambar")
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.get("/fasilitas", (req, res) => {
  Project.find({ kategori: "fasilitas" })
    .populate("penggalang")
    .populate("gambar")
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.get("/koleksi", (req, res) => {
  Project.find({ kategori: "koleksi" })
    .populate("penggalang")
    .populate("gambar")
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.get("/program", (req, res) => {
  Project.find({ kategori: "program" })
    .populate("penggalang")
    .populate("gambar")
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.put("/dana", (req, res) => {
  Project.findById(req.body._id)
    .then((project) => {
      if (!project) res.send("tidak ada proyek");
      project.dana_terkumpul =
        parseInt(project.dana_terkumpul) + parseInt(req.body.dana_masuk);
      project.save();
      res.send(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.post("/detail", (req, res) => {
  Project.findById(req.body._id)
    .populate("penggalang")
    .populate("gambar")
    .then((proyek) => {
      if (!proyek) res.send("tidak ada data proyek");
      res.send(proyek);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.get("/all", (req, res) => {
  Project.find()
    .populate("penggalang")
    .populate("gambar")
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.get("/", (req, res) => {
  //let lokasi = new Array();
  let lokasi = req.query.lokasi;
  let kategori = req.query.kategori;

  if (!lokasi) {
    lokasi = null;
  } else {
    lokasi = lokasi.split(",");
  }
  if (!kategori) {
    kategori = null;
  } else {
    kategori = kategori.split(",");
  }
  Project.find({
    lokasi: { $in: lokasi },
    kategori: { $in: kategori },
  })
    .populate("penggalang")
    .populate("gambar")
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});

module.exports = router;

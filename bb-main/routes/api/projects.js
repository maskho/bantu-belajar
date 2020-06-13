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
    .then((proyek) => {
      if (!proyek) res.send("tidak ada data proyek");
      res.send(proyek);
    })
    .catch(function (err) {
      res.json(err);
    });
});
router.get("/", (req, res) => {
  //let lokasi = new Array();
  let lokasi = req.query.lokasi;
  let kategori = req.query.kategori;

  Project.find({
    lokasi: { $in: lokasi.split(",") },
    kategori: { $in: kategori.split(",") },
  })
    .populate("penggalang")
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    })
    .catch(function (err) {
      res.json(err);
    });
});

module.exports = router;

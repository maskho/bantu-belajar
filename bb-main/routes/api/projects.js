const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Project = require("../../models/Project");
const { text } = require("express");
const { isValidObjectId } = require("mongoose");

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
    judul: text,
    deskripsi: text,
  });
  Project.find(
    { $text: { $search: req.body.search } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .then((project) => {
      res.json(project);
    });
});
router.get("/bangunan", (req, res) => {
  Project.find({ kategori: "bangunan" })
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    });
});
router.get("/fasilitas", (req, res) => {
  Project.find({ kategori: "fasilitas" })
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    });
});
router.get("/koleksi", (req, res) => {
  Project.find({ kategori: "koleksi" })
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    });
});
router.get("/program", (req, res) => {
  Project.find({ kategori: "program" })
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    });
});
router.post("/penggalang", (req, res) => {
  Project.findById(req.body._id);
});
router.module.exports = router;

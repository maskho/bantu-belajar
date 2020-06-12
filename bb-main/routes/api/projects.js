const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Project = require("../../models/Project");
const { text } = require("express");

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

router.put("/dana", (req, res) => {
  Project.findById(req.body._id).then((project) => {
    if (!project) res.send("tidak ada proyek");
    project.dana_terkumpul =
      parseInt(project.dana_terkumpul) + parseInt(req.body.dana_masuk);
    project.save();
    res.send(project);
  });
});
router.post("/detail", (req, res) => {
  Project.findById(req.body._id).then((proyek) => {
    if (!proyek) res.send("tidak ada data proyek");
    res.send(penggalang);
  });
});
router.get("/", (req, res) => {
  Project.find()
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    });
});

module.exports = router;

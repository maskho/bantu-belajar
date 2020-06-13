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
  Project
    //.aggregate([
    //   {
    //     $lookup: {
    //       from: "campaigners",
    //       localField: "penggalang",
    //       foreignField: "_id",
    //       as: "gabungan",
    //     },
    //   },
    //   {
    //     $unwind: "$gabungan",
    //   },
    //   {
    //     $match: {
    //       "gabungan.kategori": "bangunan",
    //     },
    //   },
    // ])
    .find({ kategori: "bangunan" }, (err, data) => {
      if (err) res.send(err);
      data.forEach((element) => {
        Campaigner.find({
          _id: new mongoose.Types.ObjectId(element.penggalang),
        });
      });
    })
    .sort({ _id: -1 })
    // .exec((project) => {
    //   //if () reject(new NotFoundException("ga temu"));
    //   resolve(project);
    // })
    //.populate("penggalang")
    .then((project) => {
      // Campaigner.find({ _id: project.penggalang }).then((penggalang) => {
      //   console.log(penggalang);
      //   res.json(penggalang);
      // });
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
    res.send(proyek);
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
    .sort({ _id: -1 })
    .then((project) => {
      res.json(project);
    });
});

module.exports = router;

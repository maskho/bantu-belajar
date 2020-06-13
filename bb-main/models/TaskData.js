const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskDataSchema = new Schema({
  judul: {
    type: String,
    required: true,
    text: true,
  },
  gambar: {
    type: String,
  },
  proposal: {
    type: String,
  },
  deskripsi: {
    type: String,
    required: true,
    text: true,
  },
  lokasi: {
    type: String,
  },
  kategori: {
    type: String,
  },
  dana_terkumpul: {
    type: Number,
    required: true,
  },
  dana_target: {
    type: Number,
    required: true,
  },

  tgl_target: {
    type: Date,
    default: Date.now,
  },
  penggalang: {
    type: String,
  },
  nama_penggalang: {
    type: String,
  },
  nama: {
    type: String,
    text: true,
  },
  alamat: {
    type: String,
  },
  tgl_gabung: {
    type: Date,
  },
  deskripsi: {
    type: String,
  },
  foto_profil: {
    type: String,
  },
  proyek: {
    type: String,
  },
});

module.exports = TaskData = mongoose.model("taskdata", TaskDataSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
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
});
module.exports = Project = mongoose.model("project", ProjectSchema);

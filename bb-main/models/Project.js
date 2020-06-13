const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  judul: {
    type: String,
    required: true,
    text: true,
  },
  gambar: {
    type: Schema.Types.ObjectId,
    ref: "Picture",
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
    type: Schema.Types.ObjectId,
    ref: "Campaigner",
  },
});
module.exports = Project = mongoose.model("Project", ProjectSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignerSchema = new Schema({
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

module.exports = Campaigner = mongoose.model("campaigner", CampaignerSchema);

const { CloudinaryAdapter } = require("@keystonejs/file-adapters");
const { Text, DateTime, CloudinaryImage } = require("@keystonejs/fields");

//require("dotenv").config();

const adapter = new CloudinaryAdapter({
  cloudName: "dkazavkbg", //process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: "243347769785551", // process.env.CLOUDINARY_KEY,
  apiSecret: "fM1ZmMMotBJyEgf3u3XpfxQhJik", //process.env.CLOUDINARY_SECRET,
  folder: "bbpenggalang",
});

module.exports = {
  fields: {
    nama: { type: Text, isRequired: true },
    lokasi: { type: Text, isRequired: true },
    tgl_gabung: { type: DateTime, isRequired: true },
    deskripsi: { type: Text, isRequired: true },
    foto_profil: {
      type: CloudinaryImage,
      adapter,
    },
  },
};

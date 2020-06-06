const { CloudinaryAdapter } = require("@keystonejs/file-adapters");
const {
  Text,
  DateTime,
  CloudinaryImage,
  Relationship,
} = require("@keystonejs/fields");

//require("dotenv").config();

const adapter = new CloudinaryAdapter({
  cloudName: "dkazavkbg", //process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: "243347769785551", // process.env.CLOUDINARY_KEY,
  apiSecret: "fM1ZmMMotBJyEgf3u3XpfxQhJik", //process.env.CLOUDINARY_SECRET,
  folder: "bbproject",
});

module.exports = {
  fields: {
    judul: { type: Text, isRequired: true },
    deskripsi: { type: Text, isRequired: true },
    lokasi: { type: Text, isRequired: true },
    kategori: { type: Text, isRequired: true },
    //penggalang: { type: Relationship, ref: "Penggalang", many: true },
    dana_target: { type: Text, isRequired: true },
    dana_terkumpul: { type: Text, isRequired: true },
    tgl_target: { type: DateTime, isRequired: true },
    gambar: { type: CloudinaryImage, adapter },
    proposal: { type: CloudinaryImage, adapter },
  },
};

const { CloudinaryAdapter } = require("@keystonejs/file-adapters");
const { Text, DateTime, CloudinaryImage } = require("@keystonejs/fields");

//require("dotenv").config();

const adapter = new CloudinaryAdapter({
  cloudName: "dkazavkbg", //process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: "243347769785551", // process.env.CLOUDINARY_KEY,
  apiSecret: "fM1ZmMMotBJyEgf3u3XpfxQhJik", //process.env.CLOUDINARY_SECRET,
  folder: "bbnews",
});

module.exports = {
  fields: {
    sumber: { type: Text },
    terbit: { type: DateTime, isRequired: true },
    judul: { type: Text },
    konten: { type: Text, isRequired: true },
    foto: { type: CloudinaryImage, adapter },
  },
};

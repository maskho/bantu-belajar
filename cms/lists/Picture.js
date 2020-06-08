const { Text, CloudinaryImage } = require("@keystonejs/fields");
const { CloudinaryAdapter } = require("@keystonejs/file-adapters");

require("dotenv").config();

const adapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "bbimages",
});

module.exports = {
  fields: {
    nama: {
      type: Text,
    },
    gambar_1: {
      type: CloudinaryImage,
      adapter,
      isRequired: true,
    },
    gambar_2: {
      type: CloudinaryImage,
      adapter,
    },
    gambar_3: {
      type: CloudinaryImage,
      adapter,
    },
    gambar_4: {
      type: CloudinaryImage,
      adapter,
    },
    gambar_5: {
      type: CloudinaryImage,
      adapter,
    },
  },
  labelField: "nama",
};

const {
  Text,
  CalendarDay,
  Relationship,
  CloudinaryImage,
  File,
} = require("@keystonejs/fields");
const { CloudinaryAdapter } = require("@keystonejs/file-adapters");

require("dotenv").config();

const adapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "bbprojectimages",
});
const fileAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "bbprojectfiles",
});

module.exports = {
  fields: {
    judul: {
      type: Text,
      isRequired: true,
    },
    gambar: {
      type: CloudinaryImage,
      adapter,
    },
    proposal: {
      type: File,
      adapter: fileAdapter,
    },
    deskripsi: {
      type: Text,
      isRequired: true,
    },
    lokasi: {
      type: Relationship,
      ref: "Location.proyek",
      isRequired: true,
    },
    kategori: {
      type: Relationship,
      ref: "Category.proyek",
      isRequired: true,
    },
    dana_terkumpul: {
      type: Text,
    },
    dana_target: {
      type: Text,
    },
    tgl_target: {
      type: CalendarDay,
      format: "Do MMMM YYYY",
      yearRangeFrom: "2020",
      yearRangeTo: "2030",
      isRequired: false,
      defaultValue: new Date().toISOString("YYYY-MM-DD").substring(0, 10),
    },
    penggalang: {
      type: Relationship,
      ref: "Campaigner.proyek",
      isRequired: true,
    },
  },
  labelField: "judul",
};

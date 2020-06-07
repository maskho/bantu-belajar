const {
  Text,
  CalendarDay,
  Relationship,
  CloudinaryImage,
} = require("@keystonejs/fields");
const { CloudinaryAdapter } = require("@keystonejs/file-adapters");

require("dotenv").config();
const adapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "bbcampaigners",
});

module.exports = {
  fields: {
    nama: {
      type: Text,
      isRequired: true,
    },
    alamat: {
      type: Text,
      isRequired: true,
    },
    tgl_gabung: {
      type: CalendarDay,
      format: "Do MMMM YYYY",
      yearRangeFrom: "2000",
      yearRangeTo: "2025",
      isRequired: true,
      defaultValue: new Date().toISOString("YYYY-MM-DD").substring(0, 10),
    },
    deskripsi: {
      type: Text,
      isRequired: true,
    },
    foto_profil: {
      type: CloudinaryImage,
      adapter,
    },
    proyek: {
      type: Relationship,
      ref: "Project.penggalang",
      many: true,
    },
  },
  labelField: "nama",
};

const {
  Text,
  CalendarDay,
  Relationship,
  CloudinaryImage,
} = require("@keystonejs/fields");
const { CloudinaryAdapter } = require("@keystonejs/file-adapters");

//require("dotenv").config();
const adapter = new CloudinaryAdapter({
  cloudName: "dkazavkbg",
  apiKey: "243347769785551",
  apiSecret: "fM1ZmMMotBJyEgf3u3XpfxQhJik",
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
      format: "DD MMMM YYYY",
      yearRangeFrom: "2000",
      yearRangeTo: "2025",
      isRequired: true,
      defaultValue: new Date().toISOString("DD-MM-YYYY").substring(0, 10),
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

const {
  Text,
  CalendarDay,
  Relationship,
  File,
  Decimal,
} = require("@keystonejs/fields");
const { Wysiwyg } = require("@keystonejs/fields-wysiwyg-tinymce");
const { CloudinaryAdapter } = require("@keystonejs/file-adapters");

require("dotenv").config();

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
      type: Relationship,
      ref: "Picture",
    },
    proposal: {
      type: File,
      adapter: fileAdapter,
    },
    deskripsi: {
      type: Wysiwyg,
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
      type: Decimal,
      isRequired: true,
    },
    dana_target: {
      type: Decimal,
      isRequired: true,
    },
    tgl_target: {
      type: CalendarDay,
      format: "DD MMMM YYYY",
      yearRangeFrom: "2020",
      yearRangeTo: "2050",
      isRequired: true,
      defaultValue: new Date().toISOString("DD-MM-YYYY").substring(0, 10),
    },
    penggalang: {
      type: Relationship,
      ref: "Campaigner.proyek",
      isRequired: true,
    },
  },
  labelField: "judul",
};

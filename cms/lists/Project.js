const {
  Text,
  CalendarDay,
  Relationship,
  File,
  Decimal,
  Select,
} = require("@keystonejs/fields");
const { Wysiwyg } = require("@keystonejs/fields-wysiwyg-tinymce");
const { CloudinaryAdapter } = require("@keystonejs/file-adapters");

//require("dotenv").config();

const fileAdapter = new CloudinaryAdapter({
  cloudName: "dkazavkbg",
  apiKey: "243347769785551",
  apiSecret: "fM1ZmMMotBJyEgf3u3XpfxQhJik",
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
      type: Select,
      options:
        "Sleman, Bantul,Gunung_Kidul,Kulon_Progo,Yogyakarta,Magelang,Temanggung,Wonosobo,Kebumen,Purworejo",
      isRequired: true,
    },
    kategori: {
      type: Select,
      options: "bangunan,fasilitas,koleksi,program",
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

const { Text, CalendarDay, Relationship } = require("@keystonejs/fields");
const { Wysiwyg } = require("@keystonejs/fields-wysiwyg-tinymce");

module.exports = {
  fields: {
    judul: {
      type: Text,
      isRequired: true,
    },
    konten: { type: Wysiwyg, isRequired: true },
    gambar: { type: Relationship, ref: "Picture" },
    tgl_terbit: {
      type: CalendarDay,
      format: "DD MMMM YYYY",
      yearRangeFrom: "2010",
      yearRangeTo: "2025",
      isRequired: false,
      defaultValue: new Date().toISOString("DD-MM-YYYY").substring(0, 10),
    },
    sumber: { type: Text, isRequired: true },
  },
  labelField: "judul",
};

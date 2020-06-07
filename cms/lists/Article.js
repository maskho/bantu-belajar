const { Text, CalendarDay } = require("@keystonejs/fields");

module.exports = {
  fields: {
    judul: {
      type: Text,
      isRequired: true,
    },
    konten: { type: Text, isRequired: true },
    gambar: { type: Text },
    tgl_terbit: {
      type: CalendarDay,
      format: "Do MMMM YYYY",
      yearRangeFrom: "2015",
      yearRangeTo: "2021",
      isRequired: false,
      defaultValue: new Date().toISOString("YYYY-MM-DD").substring(0, 10),
    },
    sumber: { type: Text, isRequired: true },
  },
  labelField: "judul",
};

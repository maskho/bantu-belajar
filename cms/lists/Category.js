const { Text, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    kategori: {
      type: Text,
      isRequired: true,
    },
    proyek: {
      type: Relationship,
      ref: "Project.kategori",
    },
  },
  labelField: "kategori",
  plural: "Categories",
};

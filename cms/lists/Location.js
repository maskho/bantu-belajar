const { Text, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    lokasi: {
      type: Text,
      isRequired: true,
    },
    proyek: {
      type: Relationship,
      ref: "Project.lokasi",
    },
  },
  labelField: "lokasi",
};

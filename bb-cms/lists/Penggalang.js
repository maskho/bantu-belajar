const { Text, DateTime, File } = require("@keystonejs/fields/");
const { LocalFileAdapter } = require("@keystonejs/file-adapters");

const fileAdapter = new LocalFileAdapter({
  src: "./files",
  path: "/files",
});

module.exports = {
  fields: {
    nama: { type: Text, isRequired: true },
    lokasi: { type: Text, isRequired: true },
    tgl_gabung: { type: DateTime, isRequired: true },
    deskripsi: { type: Text, isRequired: true },
    ikon: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.file) {
            await fileAdapter.delete(existingItem.file);
          }
        },
      },
    },
  },
  hooks: {
    afterDelete: async ({ existingItem }) => {
      if (existingItem.file) {
        await fileAdapter.delete(existingItem.file);
      }
    },
  },
};

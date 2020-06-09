const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  deskripsi: {
    type: String,
    required: true
  },
  lokasi: {
    type: String,
    required: true
  },
  kategori: {
    type: String,
    required: true
  },
  penggalang: {
    type: String,
    required: true
  },
  dana_terkumpul: {
    type: Decimal,
    isRequired: true,
  },
  dana_target: {
    type: Decimal,
    isRequired: true,
  },
});

module.exports = mongoose.model('product', ProductSchema);
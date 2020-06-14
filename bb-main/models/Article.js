const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  judul: {
    type: String,
    required: true,
    text: true,
  },
  konten: {
    type: String,
  },
  gambar: {
    type: Schema.Types.ObjectId,
    ref: "Picture",
  },
  tgl_terbit: {
    type: Date,
    default: Date.now,
  },
  sumber: {
    type: String,
  },
});
module.exports = Article = mongoose.model("Article", ArticleSchema);

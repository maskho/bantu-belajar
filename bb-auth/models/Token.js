const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//bikin skema
const TokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }, //expires setelah 12 jam
});
module.exports = User = mongoose.model("token", TokenSchema);

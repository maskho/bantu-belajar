const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PictureSchema = new Schema({});

module.exports = Picture = mongoose.model("Picture", PictureSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//bikin skema
const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  date: { type: Date, default: Date.now },
});
module.exports = User = mongoose.model("users", UserSchema);

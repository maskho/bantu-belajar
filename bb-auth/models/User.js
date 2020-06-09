const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//bikin skema
const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  dob: { type: Date, default: null },
  gender: { type: String, default: null },
  photo: { type: String },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null },
  verificationToken: { type: String, default: null },
});
module.exports = User = mongoose.model("users", UserSchema);

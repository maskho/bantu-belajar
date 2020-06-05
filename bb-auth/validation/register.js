const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  //ubah field kosong menjadi string kosong agar bisa pake
  //function validator
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  //validasi nama depan
  if (Validator.isEmpty(data.firstname)) {
    errors.firstname =
      "Nama harap diisi, jika hanya terdiri 1 kata tulis di kolom nama depan";
  }
  //validasi email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email harap diisi";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email tidak valid";
  }
  //validasi password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password harap diisi";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Konfirmasi password harap diisi";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password minimal 6 karakter";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Konfirmasi password harus sesuai";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

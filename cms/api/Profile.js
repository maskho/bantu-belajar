const { Keystone } = require("@keystonejs/keystone");

module.exports={

const GET_ALL_CATEGORIES = query GetCategories {
    allCategories {
      kategori
    }
  }
  fetch('/admin/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      query: GET_ALL_CATEGORIES,
    },
  }).then(result => result.json());}
import axios from "axios";

const allCategories = `
query{
  allCategories{
   kategori 
 }
}
`;
axios
  .post("https://cmsbb.herokuapp.com/admin/api/", { allCategories })
  .then((res) => res.json())
  .then((res) => console.log(res.data));

/* Logs out 
{
  data: {
    hello: "world"
  }
}
*/

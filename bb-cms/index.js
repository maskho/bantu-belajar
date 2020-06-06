const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const { Text, Password } = require("@keystonejs/fields");

const PenggalangSchema = require("./lists/Penggalang");
const ProyekSchema = require("./lists/Proyek");
const NewsSchema = require("./lists/Berita");
const PROJECT_NAME = "bantu-belajar";
const adapterConfig = {
  mongoUri:
    "mongodb+srv://waKwaw97:waKwaw97@cluster0-dnxx2.gcp.mongodb.net/bbcms?retryWrites=true&w=majority",
};

/**
 * You've got a new KeystoneJS Project! Things you might want to do next:
 * - Add adapter config options (See: https://keystonejs.com/keystonejs/adapter-mongoose/)
 * - Select configure access control and authentication (See: https://keystonejs.com/api/access-control)
 */

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  cookie: {
    secure: true,
  },
  cookieSecret: "very-secret",
});

// keystone.createList("Admin", {
//   access: {
//     // 1. Only admins can read deactivated user accounts
//     read: ({ authentication: { item } }) => {
//       if (item.isAdmin) {
//         return {}; // Don't filter any items for admins
//       }
//       // Approximately; users.filter(user => user.state !== 'deactivated');
//       return {
//         state_not: "deactivated",
//       };
//     },
//   },
//   fields: {
//     username: { type: Text },
//     password: { type: Password },
//   },
// });

// const authStrategy = keystone.createAuthStrategy({
//   type: PasswordAuthStrategy,
//   list: "Admin",
//   config: {
//     identityField: "username", // default: 'email'
//     secretField: "password", // default: 'password'
//   },
// });

// Enable Admin UI login by adding the authentication strategy
//const admin = new AdminUIApp({ authStrategy });

keystone.createList("Penggalang", PenggalangSchema);
keystone.createList("Proyek", ProyekSchema);
keystone.createList("Berita", NewsSchema);

module.exports = {
  keystone,
  apps: [new GraphQLApp(), new AdminUIApp({ enableDefaultRoute: true })],
  configureExpress: (app) => {
    app.set("trust proxy", 1);
  },
};

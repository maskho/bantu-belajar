const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const PenggalangSchema = require("./lists/Penggalang");
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
});

keystone.createList("Penggalang", PenggalangSchema);

module.exports = {
  keystone,
  apps: [new GraphQLApp(), new AdminUIApp({ enableDefaultRoute: true })],
};

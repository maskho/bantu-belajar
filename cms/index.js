const { Keystone } = require("@keystonejs/keystone");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { Text, Checkbox, Password } = require("@keystonejs/fields");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");

const initialiseData = require("./initial-data");
const ArticleSchema = require("./lists/Article");
const ProjectSchema = require("./lists/Project");
const CampaignerSchema = require("./lists/Campaigner");
const CategorySchema = require("./lists/Category");
const LocationSchema = require("./lists/Location");
const PictureSchema = require("./lists/Picture");

const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");

const PROJECT_NAME = "CMS Bantu Belajar";
const adapterConfig = {
  mongoUri:
    "mongodb+srv://waKwaw97:waKwaw97@cluster0-dnxx2.gcp.mongodb.net/cmsbb?retryWrites=true&w=majority",
};

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== "true" && initialiseData,
  cookie: {
    secure: true,
  },
  cookieSecret: "very-secret",
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = (auth) => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

keystone.createList("User", {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
});

keystone.createList("Article", ArticleSchema);
keystone.createList("Project", ProjectSchema);
keystone.createList("Campaigner", CampaignerSchema);
keystone.createList("Category", CategorySchema);
keystone.createList("Location", LocationSchema);
keystone.createList("Picture", PictureSchema);

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      hooks: require.resolve("./components/logo"),
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
  configureExpress: (app) => {
    app.set("trust proxy", 1);
  },
};

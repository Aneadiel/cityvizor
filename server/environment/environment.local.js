// @ts-check
const path = require("path");

const cityvizorPath = path.resolve(__dirname,"../../");

module.exports = {

  port: 3000,
  host: "0.0.0.0",

  apiRoot: "/api",

  tmpDir: path.resolve(cityvizorPath, "data/tmp"),
  storageDir: path.resolve(cityvizorPath, "data"),

  staticFiles: path.resolve(cityvizorPath, "client/dist"),

  database: {
    client: 'pg',
    host: '0.0.0.0',
    user: 'cityvizor',
    password: 'cityvizor',
    database: 'cityvizor'
  },

  cors: true,
  corsOrigin: "http://localhost:4200",

  keys: {
    edesky: { api_key: null },
    jwt: { secret: "secret" }
  }
};

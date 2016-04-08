'use strict'


function Settings() {
}


Settings.prototype.load = function() {
  if (!process.env.PORT) {
    console.error("PORT not defined");
    process.exit();
  }

  if (!process.env.DBAAS_MONGODB_ENDPOINT && !MONGOLAB_URI) {
    console.error("DBAAS_MONGODB_ENDPOINT and MONGOLAB_URI not defined");
    process.exit();
  }

  if (!process.env.SESSION_SECRET) {
    console.error("SESSION_SECRET not defined");
    process.exit();
  }

  if (!process.env.GITHUB_ID) {
    console.error("GITHUB_ID not defined");
    process.exit();
  }

  if (!process.env.GITHUB_SECRET) {
    console.error("GITHUB_SECRET not defined");
    process.exit();
  }
}

module.exports = Settings;

module.exports = {
    apps: [
      {
        name: "main-server",
        script: "index.js",
        watch: false,
        env: {
          NODE_ENV: "production",
        },
      },
      {
        name: "sync-script",
        script: "sqldb.js",
        watch: false,
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  
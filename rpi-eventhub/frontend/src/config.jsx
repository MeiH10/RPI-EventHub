const config = {
    development: {
      apiUrl: 'http://localhost:5000'
    },
    production: {
      apiUrl: 'https://rpieventhub.com'
    }
  };
  // postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
  
  export default config[process.env.NODE_ENV];
  
const config = {
    development: {
      apiUrl: 'http://localhost:5000'
    },
    production: {
      apiUrl: 'https://rpieventhub.com'
    }
  };
  


  
  export default config[process.env.NODE_ENV];
  
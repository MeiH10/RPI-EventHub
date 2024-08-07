const config = {
    development: {
      apiUrl: 'http://localhost:5000'
    },
    production: {
      apiUrl: 'https://rpi-eventhub-production.up.railway.app'
    }
  };
  
  export default config[process.env.NODE_ENV];
  
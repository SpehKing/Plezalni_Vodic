// config.js

const jwtConfig = {
    accessExpiration: '15m',
    refreshExpiration: '7d',
    secret: process.env.JWT_SECRET,
  };
  
  module.exports = jwtConfig;
  
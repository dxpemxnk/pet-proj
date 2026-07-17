require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
function generateTokens(payload) {
return {
    accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN, jwtConfig.access),
    refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN, jwtConfig.refresh),
  };
}
module.exports = generateTokens;
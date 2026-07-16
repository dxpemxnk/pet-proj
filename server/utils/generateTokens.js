require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
function generateTokens(payload) {
  return {
    accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: Number(jwtConfig.access.expiresIn) }),
    refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: Number(jwtConfig.refresh.expiresIn) }),
  };
}
module.exports = generateTokens;
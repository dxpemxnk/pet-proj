const jwtConfig = {
  access: {
    type: 'accessToken',
    expiresIn: `${1000 * 60 * 5}`, // 5 минут
  },
  refresh: {
    type: 'refreshToken',
    expiresIn: `${1000 * 60 * 60 * 12}`, // 12 часов
  },
};
module.exports = jwtConfig;
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const generateTokens = require('../../utils/generateTokens');
const jwtConfig = require('../../config/jwtConfig');
const verifyRefreshToken = require('../../middleware/verifyRefreshToken');

// Регистрация
router.post('/registration', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }

    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateTokens({ user: plainUser });

    res
      .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: jwtConfig.refresh.cookieMaxAge })
      .json({ message: 'success', user: plainUser, accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Логин
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateTokens({ user: plainUser });

    res
      .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: jwtConfig.refresh.cookieMaxAge })
      .json({ message: 'success', user: plainUser, accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Логаут
router.get('/logout', (req, res) => {
  res.clearCookie('refreshToken').json({ message: 'success' });
});

// Обновление токена
router.get('/refresh', verifyRefreshToken, (req, res) => {
  const { accessToken, refreshToken } = generateTokens({ user: res.locals.user });
  res
    .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: jwtConfig.refresh.cookieMaxAge })
    .json({ message: 'success', user: res.locals.user, accessToken });
});

module.exports = router;

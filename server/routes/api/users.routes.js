const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const verifyAccessToken = require('../../middleware/varifyAccessToken');

// Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'createdAt'],
      order: [['id', 'ASC']]
    });
    res.json({ message: 'success', users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить одного пользователя
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email', 'createdAt']
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ message: 'success', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить пользователя (только себя)
router.put('/:id', verifyAccessToken, async (req, res) => {
  try {
    if (Number(req.params.id) !== res.locals.user.id) {
      return res.status(403).json({ message: 'Можно редактировать только свой профиль' });
    }
    const { email, password } = req.body;
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const [updated] = await User.update(updateData, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить пользователя (только себя)
router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    if (Number(req.params.id) !== res.locals.user.id) {
      return res.status(403).json({ message: 'Можно удалить только свой профиль' });
    }
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

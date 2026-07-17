const router = require('express').Router();
const { Category } = require('../../db/models');
const verifyAccessToken = require('../../middleware/varifyAccessToken');

// Получить все категории
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['id', 'ASC']] });
    res.json({ message: 'success', categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить одну категорию
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    res.json({ message: 'success', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать категорию (только для авторизованных)
router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Укажите название категории' });
    }
    const category = await Category.create({ name });
    res.status(201).json({ message: 'success', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить категорию (только для авторизованных)
router.put('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { name } = req.body;
    const [updated] = await Category.update({ name }, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    res.json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить категорию (только для авторизованных)
router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    res.json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

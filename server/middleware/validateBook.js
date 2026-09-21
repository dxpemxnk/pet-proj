const { Category } = require('../db/models');

async function validateBook(req, res, next) {
  const { title, author, pages, category_id } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim() ||
      typeof author !== 'string' || !author.trim() ||
      !Number.isInteger(pages) || pages < 1 || pages > 2147483647 ||
      !Number.isInteger(category_id) || category_id < 1 || category_id > 2147483647) {
    return res.status(400).json({ message: 'Укажите название, автора, категорию и целое положительное количество страниц.' });
  }
  try {
    if (!await Category.findByPk(category_id)) {
      return res.status(400).json({ message: 'Выбранная категория не существует.' });
    }
    req.body = { title: title.trim(), author: author.trim(), pages, category_id };
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Не удалось проверить категорию.' });
  }
}

module.exports = validateBook;

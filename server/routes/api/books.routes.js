const router = require('express').Router();
const BookService = require('../../services/book.service');
const verifyAccessToken = require('../../middleware/varifyAccessToken');

// Получить все книги
router.get('/', async (req, res) => {
  try {
    const books = await BookService.getAllBooks();
    res.json({ message: 'success', books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать книгу (только для авторизованных)
router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { title, author, pages, category_id } = req.body;
    const newBook = await BookService.createBook({
      title, author, pages, category_id,
      user_id: res.locals.user.id
    });
    res.status(201).json({ message: 'success', book: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Поиск книг по названию
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Укажите параметр name' });
    }
    const books = await BookService.findAllBooksByName(name);
    res.json({ message: 'success', books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить одну книгу
router.get('/:id', async (req, res) => {
  try {
    const book = await BookService.getOneBook(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }
    res.json({ message: 'success', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить книгу (только свою)
router.put('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, pages, category_id } = req.body;
    const book = await BookService.getOneBook(id);
    if (!book || book.user_id !== res.locals.user.id) {
      return res.status(403).json({ message: 'Нет прав или книга не найдена' });
    }
    const updated = await BookService.updateBook({ title, author, pages, category_id }, id);
    res.json({ message: 'success', updated: !!updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить книгу (только свою)
router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookService.deleteBook(id, res.locals.user.id);
    if (deleted) {
      res.json({ message: 'success' });
    } else {
      res.status(403).json({ message: 'Нет прав или книга не найдена' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

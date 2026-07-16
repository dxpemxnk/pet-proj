const { Book } = require("../db/models");
const { Op } = require("sequelize");

class BookService {
  static async getAllBooks() {
    try {
      const books = await Book.findAll({
       order: [["id", "ASC"]]
      });
      
      return books;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getOneBook(id) {
    try {
      const book = await Book.findByPk(id);
      return book;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createBook(data) {
    try {
      const book = await Book.create(data);
      return book;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async deleteBook(id, authUserId) {
    try {
      const countDeletedBooks = await Book.destroy({ where: { id, user_id: authUserId } });  
      return countDeletedBooks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateBook(data, id) {
    try {
      const [countUpdated] = await Book.update(data, { where: { id } });
      return countUpdated;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findAllBooksByName(name) {
    try {
      const book = await Book.findAll({
        where: {
          title: {
            [Op.substring]: name,
          },
        },
      });
      return book;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = BookService;

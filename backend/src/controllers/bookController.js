const bookService = require('../services/bookService');

class BookController {
  async index(req, res) {
    try {
      const books = await bookService.getAllBooks();
      return res.status(200).json(books);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Erro interno ao listar livros.',
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: 'ID do livro inválido.' });
      }
      const book = await bookService.getBookById(parsedId);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Erro interno ao buscar livro.',
      });
    }
  }

  async store(req, res) {
    try {
      const newBook = await bookService.createBook(req.body);
      return res.status(201).json(newBook);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Erro interno ao criar livro.',
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: 'ID do livro inválido.' });
      }
      const updatedBook = await bookService.updateBook(parsedId, req.body);
      return res.status(200).json(updatedBook);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Erro interno ao atualizar livro.',
      });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: 'ID do livro inválido.' });
      }
      await bookService.deleteBook(parsedId);
      return res.status(204).send();
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Erro interno ao remover livro.',
      });
    }
  }
}

module.exports = new BookController();



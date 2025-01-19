import { Book } from '../models/book.model.js';
import { Issue } from '../models/issue.model.js';

// Create a New Book
export const createBook = async (req, res) => {
  try {
    const { name, genre, quantities, title, author, ISBN  , picture} = req.body;

    // Check if a book with the same ISBN already exists
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists.' });
    }

    // Create a new book
    const book = new Book({ name, genre, quantities, title, author, ISBN  , picture : picture ? picture : `https://placehold.co/150x200?text=${title}`});

    await book.save();

    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

// Get All Books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Get a Single Book by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

// Update Book Details
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const book = await Book.findByIdAndUpdate(id, updates, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Delete a Book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};


export const addBookQuantity = async (req, res) => {
    try {
      const { quantityToAdd , id } = req.body; // Quantity to be added
  
      if (!quantityToAdd || quantityToAdd <= 0) {
        return res.status(400).json({ message: 'Invalid quantity to add.' });
      }
  
      // Find the book by ID
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      // Update the quantity
      book.quantities += quantityToAdd;
      await book.save();
  
      res.status(200).json({ message: 'Book quantity updated successfully', book });
    } catch (error) {
      res.status(500).json({ message: 'Error updating book quantity', error: error.message });
    }
  };
  
  // Controller function to search books based on a given field
export const searchBooks = async (req, res) => {
  const { author, isbn, title, genre ,name } = req.query;

  // Initialize query object
  let query = {};

  try {
    // Dynamically build the query based on the fields provided
    if (author) {
      query.author = { $regex: author, $options: 'i' };  // Case-insensitive search for author
    }
    if (isbn) {
      query.isbn = { $regex: isbn, $options: 'i' };  // Case-insensitive search for ISBN
    }
    if (title) {
      query.title = { $regex: title, $options: 'i' };  // Case-insensitive search for title
    }
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };  // Case-insensitive search for genre
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };  // Case-insensitive search for name
    }
    

    // Query the database with the dynamically built query object
    const books = await Book.find(query);

    

    // Send the books as a response
    res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while searching for books.' });
  }
};


export const addPicture = async (req, res) => {
    try {
      const { bookId  } = req.body;
      const image = req.file;

      console.log({bookId , image})
  
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      book.picture = image;
      await book.save();
  
      res.status(200).json({ message: 'Book picture updated successfully', book });
    } catch (error) {
      res.status(500).json({ message: 'Error updating book picture', error: error.message });
    }
  };
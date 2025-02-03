import { Book } from "../models/book.model.js";
import { BookSuggestion } from "../models/bookSuggestion.model.js";
import { transporter } from "../utils/Notification.js";

export const createBookSuggestion = async (req, res) => {

    try {
        
        const {title , genre , author} = req.body;
        if(!title || !genre || !author){
            return res.status(400).json({message: "All fields are required"});
        }
        const userId = req.user._id;

        const bookSuggestion = new BookSuggestion({
            title,
            genre,
            author,
            user: userId,
            picture : `https://placehold.co/150x200?text=${title}`
        })

        await bookSuggestion.save();

        res.status(201).json({message: "Book suggestion created successfully", bookSuggestion});
    } catch (error) {
        res.status(500).json({message: "Error creating book suggestion", error: error.message});
    }
}


export const getAllBookSuggestions = async (req, res) => {

    try {
        const bookSuggestions = await BookSuggestion.find().populate("user");
        res.status(200).json({message: "Book suggestions fetched successfully", bookSuggestions});
    } catch (error) {
        res.status(500).json({message: "Error fetching book suggestions", error: error.message});
    }
}

export const bookAddedToLibrary = async (req, res) => {

    try {
        const {bookId , quantities , isbn , title , author , genre , name} = req.body;
        const book = await BookSuggestion.findById(bookId).populate("user");
        if(!book){
            return res.status(400).json({message: "Book not found"});
        }

        

        if(!quantities || !isbn || !title || !author || !genre || !name){
            return res.status(400).json({message: "All fields are required"});
        }

        

        const addedBook = new Book({
            name,
            genre,
            author,
            quantities,
            title,
            picture: `https://placehold.co/150x200?text=${title}`,
            ISBN:isbn
        })

        if(!addedBook){
            return res.status(400).json({message: "Error adding book to library"});
        }

        await addedBook.save();

        

        const mailOptions = {
            from: process.env.EMAIL, // Sender email
            to: book.user.email,               // Receiver's email (from user data)
            subject: `Book added to library : ${addedBook.title}`, // Email subject
            text: `Hello ${book.user.name},\n\nA user has added a book to your library: ${addedBook.title}.\n\nPlease Collect it from the library.\n\nThank you!.`, // Email body 
          };

        await transporter.sendMail(mailOptions);
          

        await BookSuggestion.findByIdAndDelete(bookId);

        res.status(200).json({message: "Book added to library successfully"});
    } catch (error) {
        res.status(500).json({message: "Error adding book to library", error: error.message});
    }
}
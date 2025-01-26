import { Issue } from "../models/issue.model.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.models.js";
import { transporter } from "../utils/Notification.js";

// Create an Issue (Borrow a Book)
export const createIssue = async (req, res) => {
  try {
    const { bookId, userId, expectedReturnDate } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new issue record
    const newIssue = new Issue({
      book: bookId,
      user: userId,
      expectedReturnDate,
      type: "Borrow",
    });

    // Save the issue record
    await newIssue.save();
    
    book.quantities -= 1;
    
    await book.save();

    res
      .status(201)
      .json({ message: "Book borrowed successfully", issue: newIssue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating issue", error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;

    // Find the issue record
    const issue = await Issue.findById(issueId).populate("book");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    // Check if the issue is already returned
    if (issue.type === "Return") {
      return res.status(400).json({ message: "Book already returned" });
    }

    const currentDate = new Date();
    const expectedReturnDate = new Date(issue.expectedReturnDate);

    // Calculate overdue days and fine
    let fine = 0;
    if (currentDate > expectedReturnDate) {
      const overdueDays = Math.ceil(
        (currentDate - expectedReturnDate) / (1000 * 60 * 60 * 24)
      );
      fine = overdueDays * 10; // 10 rupees per day
    }

    // Update the issue record
    issue.returnDate = currentDate;
    issue.type = "Return";
    issue.fine = fine; // Add fine to the issue record (if fine is a field in your schema)
    await issue.save();

    // Increase the book's quantity
    const book = await Book.findById(issue.book._id);
    book.quantities += 1;
    await book.save();

    res.status(200).json({
      message: "Book returned successfully",
      issue,
      fine:
        fine > 0
          ? `A fine of ₹${fine} was imposed for late return.`
          : "No fine imposed.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error returning book", error: error.message });
  }
};

export const requestBook = async (req, res) => {
  try {
    
    const { expectedReturnDate  ,bookId} = req.body;
    const user = req.user;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.save();

    const newIssue = new Issue({
      book: bookId,
      user: req.user._id,
      expectedReturnDate: expectedReturnDate,
      type: "Request",
    });

    await newIssue.save();

    const mailOptions = {
      from: process.env.EMAIL, // Sender email
      to: user.email,               // Receiver's email (from user data)
      subject: `Request for a Book : ${book.title}`, // Email subject
      text: `Hello ${user.name},\n\nA user has requested a book: ${book.title}.\n\nPlease Collect it from the library.\n\nThank you!.`, // Email body 
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Book requested successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error requesting book", error: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const {bookId , issueId} = req.body;
    

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(400).json({ message: "Issue not found" });
    }

    
    if (issue.type !== "Request") {
      return res.status(400).json({ message: "Invalid issue type" });
    }

    book.quantities += 1;
    await book.save();

    await Issue.findByIdAndDelete(issue._id);

    res.status(200).json({ message: "Request canceled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error canceling request", error: error.message });
  }
};

// Get All Issues
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("book")
      .populate("user");

    res.status(200).json({ issues });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issues", error: error.message });
  }
};

// Get Issues by User
export const getIssuesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const issues = await Issue.find({ user: userId })
      .populate("book")
      .populate("user");

    res.status(200).json({ issues });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user issues", error: error.message });
  }
};

// Get Issues by Book
export const getIssuesByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const issues = await Issue.find({ book: bookId })
      .populate("book", "name author")
      .populate("user", "name email");

    if (issues.length === 0) {
      return res.status(404).json({ message: "No issues found for this book" });
    }

    res.status(200).json({ issues });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book issues", error: error.message });
  }
};


export const getRequestedBooks = async (req, res) => {
  try {
    const requestedBooks = await Issue.find({ type: "Request" })
      .populate("book")
      .populate("user");

    res.status(200).json({ books:requestedBooks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requested books", error: error.message });
  }
};

export const getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Issue.find({ type: "Borrow" })
      .populate("book")
      .populate("user");

    res.status(200).json({ books : borrowedBooks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching borrowed books", error: error.message });
  }
};


export const getReturnedBooks = async (req, res) => {
  try {
    const returnedBooks = await Issue.find({ type: "Return" })
      .populate("book")
      .populate("user");

    res.status(200).json({ books : returnedBooks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching returned books", error: error.message });
  }
};


export const acceptRequestedBook = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId).populate('user');
    const user = req.user

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.type !== "Request") {
      return res.status(400).json({ message: "Invalid issue type" });
    }

    const book = await Book.findById(issue.book);

    issue.type = "Borrow";
    await issue.save();

    
    book.quantities -= 1;
    
    await book.save();

    if(book.quantities<2){
      const mailOptions = {
        from: process.env.EMAIL, // Sender email
        to: user.email,               // Receiver's email (from user data)
        subject: `Alert : Low Stock of ${book.title}`, // Email subject
        text: `Hello ${user.name},\n\nThis is an alert that the stock of the book "${book.title}" is low. Please make sure to add more books to the library.\n\nThank you!`, // Email body
      };

      await transporter.sendMail(mailOptions);
    }

    const mail = {
      from: process.env.EMAIL, // Sender email
      to: issue.user.email,               // Receiver's email (from user data)
      subject: `Book Issued`, // Email subject
      text: `Hello ${issue.user.name},\n\nThis is a confirmation that the book "${book.title}" has been accepted by the library. Please make sure to return it on time.\n\nThank you!`, // Email body
    }

    await transporter.sendMail(mail);

    res.status(200).json({ message: "Book accepted successfully" });
    }
    catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting book", error: error.message });
  }
};
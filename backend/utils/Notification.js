import nodemailer from 'nodemailer';
import { Issue } from "../models/issue.model.js";

// Setup Nodemailer transporter using Gmail
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.PASSWORD   // Your Gmail password or App password (if 2FA is enabled)
  },
  tls: {
    rejectUnauthorized: false
  }
});

const notifyOnReturnDateNextDay = async () => {
  console.log("working")
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow (midnight)
  console.log({tomorrow})
  const endOfTomorrow = new Date(tomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999); // End of tomorrow (11:59:59.999)

  try {
    // Find all issues where the returnDate is tomorrow
    const issues = await Issue.find({
      expectedReturnDate: {
        $gte: tomorrow,
        $lte: endOfTomorrow,
      },
      type: "Borrow",
    }).populate('book user', 'title name email'); // Assuming the user model has an email field
    console.log({issues})
    // Loop through each issue and send an email to the user
    for (const issue of issues) {
      const { user, book, expectedReturnDate } = issue;

      // Construct the email content
      const mailOptions = {
        from: process.env.EMAIL, // Sender email
        to: user.email,               // Receiver's email (from user data)
        subject: `Reminder: Book Return Date Tomorrow`, // Email subject
        text: `Hello ${user.name},\n\nThis is a reminder that the book "${book.title}" is due for return tomorrow, ${expectedReturnDate.toLocaleDateString()}.\n\nPlease make sure to return it on time.\n\nThank you!`, // Email body
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Notification sent to ${user.email}`);
    }

    console.log("work done")
  } catch (error) {
    console.error('Error notifying users:', error);
  }
};

export { notifyOnReturnDateNextDay };

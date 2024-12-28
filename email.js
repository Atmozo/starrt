const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'ghosty@gmail.com', 
    pass: 'qewefvvbr2344ti0o ', 
  },
});

// Email details
const mailOptions = {
  from: 'ghosty@gmail.com', 
  to: 'ashelymozorandi@outlook.com',
  subject: 'Hello from Nodemailer!',
  text: 'This is a test email sent from a Node.js app.',
};

// Send the email
transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});
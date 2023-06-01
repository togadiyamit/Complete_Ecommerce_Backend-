🛒 eCommerce Backend 

This is the backend component of our eCommerce project, which provides the necessary APIs and functionalities to support an online shopping platform. It is built using Node.js, Express.js, and PostgreSQL.
 
 
✨ Features

User management: Registration, login, and authentication. Sends a confirmation email using Nodemailer to verify user registration. 📧

Item management: Adding items, retrieving items, searching items by keyword, and adding items to the cart. 📦

Cart management: Updating the cart, checking out, and placing orders. Generates an invoice in PDF format using PDFKit. 🛒💰

Review system: Allowing users to submit reviews for items. Provides functionality to manage total reviews and calculate average ratings. ⭐️

Order management: Retrieving orders for a specific user. 📋
 
 

🚀 Technologies Used

Node.js: A JavaScript runtime for executing server-side code.

Express.js: A web application framework for building APIs and handling HTTP requests.

PostgreSQL: A powerful relational database management system for storing and retrieving data.

Multer: A middleware for handling file uploads.

Nodemailer: A module for sending emails, used for user registration confirmation. 📧✉️

PDFKit: A PDF generation library, used for creating invoices in PDF format. 📄

Joi: A validation library for validating request data.

JSON Web Token (JWT): A library for creating and validating JSON web tokens for user authentication and authorization. 🔒



📝 Installation

Clone the repository.

Install the dependencies using npm install.

Set up the PostgreSQL database and update the database configuration file.

Set up the SMTP details in the Nodemailer configuration file for email sending. 📧✉️

Set the JSON Web Token (JWT) secret key in the configuration file for user authentication. 🔒

Start the server using npm start.



🌐 API Endpoints

/user: User-related endpoints for registration, login, and authentication.

/item: Item-related endpoints for managing items, reviews, and cart operations.



👥 Contributors

[Mit Togadiya]: @mittogadiya

Feel free to contribute to this project by submitting bug reports, feature requests, or pull requests.

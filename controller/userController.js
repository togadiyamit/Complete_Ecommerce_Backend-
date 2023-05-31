const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require('../database/db');
const joi = require("joi")
const nodemailer = require("nodemailer");



const { validateRegistration } = require('../middlewear/validation_schema');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your mail',
    pass: 'your pass'
  }
});

const registerUser = asyncHandler(async(req,res) => {
  try {
    const { username, email, password } = req.body;

    const { error } = validateRegistration(req.body);

    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    // if (!username || !email || !password) {
    //   res.status(400)
    //   throw new Error("All fields are mandatory");
    // }
    
    const available = 'SELECT email FROM registrations WHERE email = $1';
    const registeruser = 'INSERT INTO registrations (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(available, [email]);
    
    if (rows.length > 0 && rows) {
      res.status(400);
      throw new Error("User already registered");
    } 

    const hashPassword = await bcrypt.hash(password,10);
    console.log("hash password : ",hashPassword);
        
    const user = await pool.query(registeruser, [username, email, hashPassword]);
  
    if (user && user.rowCount > 0) {
        res.status(201).json({ _id: user.rows[0].id, email: user.rows[0].email });
    } else {
        res.status(400);
        throw new Error("Data is not valid");
    }


    const mailOptions = {
      from: 'sender mail',
      to: 'receiver mail',
      subject: 'Registration Confirmation',
      text: 'Thank you for registering!',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send registration email');
      }
      console.log('Registration email sent:', info.response);
    });

    res.status(201).json({ _id: user.rows[0].id, email: user.rows[0].email });
    res.json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

)


const loginUser = asyncHandler(async(req,res) => {
    const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  
  const userQuery = await pool.query('SELECT * FROM registrations WHERE email = $1', [email]);
  const user = userQuery.rows[0]; // Access the first row of the query result

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      "Secret key",
      { expiresIn: "50m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});



const currentUser = asyncHandler(async(req,res) => {
    const { username, email, id } = req.user;

    // Return the user details in the response
    res.json({ username, email, id });
})

module.exports = {registerUser,loginUser,currentUser};
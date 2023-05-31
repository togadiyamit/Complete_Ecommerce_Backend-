const express = require("express");
const router1 = require("./routes/userRoutes");
const router = require("./routes/itemRoutes");
const multer = require("multer");
const path = require("path");
const db = require("./database/db");

const errorHandler = require("./middlewear/errorHandler");


const app = express();

app.use(express.json());
app.use("/user",router1);
app.use("/item",router);


app.use(errorHandler);

const port = 3000;

  // Database connection
  db.connect()
  .then(() => {
    console.log("Connected to the database");
    // Start the server after successful database connection
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
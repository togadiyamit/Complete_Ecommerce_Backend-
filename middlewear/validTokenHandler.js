const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (accessToken) {
      try {
        // Verify and decode the access token
        const decodedToken = jwt.verify(accessToken, "Secret Key");
  
        // Set req.user with the decoded user information
        req.user = decodedToken.user;
  
        // Proceed to the next middleware
        next();
      } catch (error) {
        // Handle token verification errors
        res.status(401);
        throw new Error("Invalid or expired access token");
      }
    } else {
      res.status(401);
      throw new Error("Access token not found");
    }
  });

module.exports = validateToken;
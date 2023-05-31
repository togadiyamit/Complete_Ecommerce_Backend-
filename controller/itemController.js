const asyncHandler = require("express-async-handler");
const pool = require('../database/db');
const multer = require('multer');
const { validatePayment, validateReview } = require("../middlewear/validation_schema");
const PDFDocument = require('pdfkit');
const fs = require('fs');



const generateInvoicePDF = (registrations, order) => {
    const doc = new PDFDocument();
    const invoicePath = `./invoice/invoice_${order.id}.pdf`;
  
    doc.pipe(fs.createWriteStream(invoicePath));
  
    // Set the font and size for the document
    doc.font('Helvetica-Bold').fontSize(20);
  
    // Add the title and invoice details
    doc.text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Order ID: ${order.id}`);
    doc.fontSize(14).text(`Order Date: ${order.created_at}`);
    doc.moveDown();
  
    // Add user details
    doc.fontSize(14).text('User Details:');
    doc.fontSize(12).text(`Name: ${registrations.username}`);
    doc.fontSize(12).text(`Email: ${registrations.email}`);
    doc.fontSize(12).text(`Address: ${order.address}`);
    doc.moveDown();
  
    // Add order details
    doc.fontSize(14).text('Order Details:');
    doc.fontSize(12).text(`Total Price: $${Number(order.total_price).toFixed(2)}`);
    doc.fontSize(12).text('Order Items:');
    order.order_details.forEach((orderDetail, index) => {
      doc.fontSize(12).text(`Item ${index + 1}:`);
      doc.fontSize(12).text(`   Item ID: ${orderDetail.item_id}`);
      doc.fontSize(12).text(`   Quantity: ${orderDetail.quantity}`);
      doc.fontSize(12).text(`   Total Price: $${Number(orderDetail.total_price).toFixed(2)}`);
    });
  
    doc.fontSize(12).text('Payment Method:');
    doc.fontSize(12).text(JSON.stringify(order.payment_method, null, 2));
    doc.moveDown();
  
    // Add additional details
    doc.end();
  
return invoicePath;
};
  


//multer Configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


//add Items
const addItems = asyncHandler(async (req, res, next) => {
    try {
      const { item_name, description, price } = req.body;
      const item_image = req.file ? req.file.path : null;
  
      // Insert item into the database
      const result = await pool.query("INSERT INTO item (user_id, item_name, description, price, item_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [req.user.id, item_name, description, price, item_image]);
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(404);
      next(error);
    }
  });

 
// Get all items
const getItems = asyncHandler(async (req, res) => {
    try {
      const query = 'SELECT * FROM item';
      const result = await pool.query(query);
      const items = result.rows;
  
      for (const item of items) {
        const reviewQuery = await pool.query('SELECT COUNT(*) FROM product_reviews WHERE item_id = $1', [item.id]);
        const reviewCount = parseInt(reviewQuery.rows[0].count);
  
        const avgRatingQuery = await pool.query('SELECT AVG(rating) FROM product_reviews WHERE item_id = $1', [item.id]);
        const avgRating = parseFloat(avgRatingQuery.rows[0].avg) || 0;
  
        item.total_reviews = reviewCount;
        item.average_rating = avgRating.toFixed(2);
      }
  
      res.status(200).json(items);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
  //submit review
  const submitReview = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { item_id, rating, review_text } = req.body;
    const { error } = validateReview(req.body);
  
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
  
    try {
      // Check if the user has already submitted a review for this product
      const existingReview = await pool.query(
        'SELECT * FROM product_reviews WHERE user_id = $1 AND item_id = $2',
        [user_id, item_id]
      );
  
      if (existingReview.rows.length > 0) {
        res.status(400).json({ message: 'You have already submitted a review for this product' });
        return;
      }
  
      // Insert the new review into the database
      const newReview = await pool.query(
        'INSERT INTO product_reviews (user_id, item_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, item_id, rating, review_text]
      );
  
      if (newReview.rows.length === 0) {
        throw new Error('Failed to insert the new review');
      }
  
      res.status(200).json({ message: 'Review submitted successfully', review: newReview.rows[0] });
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ message: 'An error occurred while submitting the review' });
    }
  });
  

  
  //get item based on id
  const searchItemsbyId = asyncHandler(async (req, res) => {

    try {

      // Retrieve all items
      const itemQuery = 'SELECT * FROM item WHERE id = $1';
      const itemResult = await pool.query(itemQuery, [req.params.id]);
      const items = itemResult.rows;
  
      // Retrieve reviews for each item
      const itemsWithReviews = [];
  
      for (const item of items) {
      // Retrieve reviews for the item
      const reviewQuery = `
        SELECT product_reviews.rating, product_reviews.review_text, registrations.username
        FROM product_reviews
        INNER JOIN registrations ON product_reviews.user_id = registrations.id
        WHERE product_reviews.item_id = $1
      `;
      const reviewResult = await pool.query(reviewQuery, [item.id]);
      const reviews = reviewResult.rows;

      const itemWithReviews = {
        ...item,
        reviews: reviews,
      };

      itemsWithReviews.push(itemWithReviews);
    }

    res.status(200).json(itemsWithReviews);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ message: 'An error occurred while searching items' });
  }
});
  
  



  //Search items based on keyword
  const searchItems = asyncHandler(async (req, res) => {
    const { query } = req.params; // Access the query parameter from req.params instead of req.query
    const searchQuery = `
      SELECT * FROM item
      WHERE item_name ILIKE '%${query}%'
      OR description ILIKE '%${query}%'
    `;
    try {
        const result = await pool.query(searchQuery);
        const items = result.rows;
        res.status(200).json(items);
      } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).json({ message: 'An error occurred while searching items' });
      }
    });
    


  // add to cart items 
  const addToCart = asyncHandler(async (req, res, next) => {
    try {
        const { item_id, quantity } = req.body;
        const user_id = req.user.id;
      
        // Check if the item exists and fetch its details
        const itemQuery = await pool.query("SELECT * FROM item WHERE id = $1", [item_id]);
        const item = itemQuery.rows[0];
      
        if (!item) {
          res.status(404);
          throw new Error("Item not found");
        }
      
        // Calculate the price based on the quantity
        const price = item.price * quantity;
      
        // Check if the item is already in the user's cart
        const cartQuery = await pool.query(
          "SELECT * FROM cart WHERE user_id = $1 AND item_id = $2",
          [user_id, item_id]
        );
        const cartItem = cartQuery.rows[0];
      
        if (cartItem) {
          // If the item is already in the cart, update the quantity and price
          const updateCart = await pool.query(
            "UPDATE cart SET quantity = $1, price = $2 WHERE user_id = $3 AND item_id = $4 RETURNING *",
            [quantity, price, user_id, item_id]
          );
          res.status(200).json({ message: "Item updated in the cart", Item: updateCart.rows[0] });
        } else {
          // If the item is not in the cart, add it with the quantity and price
          const insertCart = await pool.query(
            "INSERT INTO cart (user_id, item_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, item_id, quantity, price]
          );
          res.status(201).json({ message: "Item added to the cart", Item: insertCart.rows[0] });
        }
      } catch (error) {
        next(error);
      }
    });
    
      
      
      
      
    //checkout cart
    const checkout = asyncHandler(async (req, res, next) => {
        const user_id = req.user.id;
        const { address, payment_method, card_no, card_expiry_date, cvv_no, } = req.body;
      
        const { error } = validatePayment(req.body);

        if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
        }
        try {
          // Get the items in the user's cart
          const cartQuery = await pool.query('SELECT * FROM cart WHERE user_id = $1', [user_id]);
          const cartItems = cartQuery.rows;
      
          if (cartItems.length === 0) {
            res.status(400).json({ message: 'No items in the cart' });
            return;
          }
      
          // Calculate the total price of the items
          let totalPrice = 0;
          const orderDetails = [];
      
          for (const item of cartItems) {
            const itemPrice = item.price * item.quantity; // Calculate the total price for each item
            totalPrice += itemPrice;
            
            orderDetails.push({
              item_id: item.item_id,
              quantity: item.quantity,
              price: item.price,
              total_price: itemPrice, // Add the total price for the item
            });
          }

                
            let paymentDetails;

            if (payment_method !== 'Cash on Delivery') {
            // Process card payment
            // Implement the necessary logic here to process the card payment
            // You can use the provided card_no, card_expiry_date, and cvv_no variables

            // For now, let's assume the payment is successful
            paymentDetails = {
                card_no,
                card_expiry_date,
                cvv_no,
            };
            } else {
            // Cash on Delivery
            paymentDetails = {
                payment_method: 'Cash on Delivery',
            };
            }

            // Create an order record in the database
            const createOrderQuery = await pool.query(
            'INSERT INTO orders (user_id, total_price, address, payment_method, order_details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                user_id,
                totalPrice,
                address,
                JSON.stringify(paymentDetails),
                JSON.stringify(orderDetails),
            ]
            );
            order = createOrderQuery.rows[0];

            const invoiceFilePath = generateInvoicePDF(req.user, order);

          // Clear the cart
          await pool.query('DELETE FROM cart WHERE user_id = $1', [user_id]);
      
          res.status(200).json({
            message: 'Order placed successfully',
            order,
            invoiceFilePath,
          });
        } catch (error) {
          console.error('Order processing error:', error);
          res.status(500);
          throw new Error('Order processing error');
        }
      });


      //view all orders

      const getOrders = asyncHandler(async (req, res) => {
        try {
          // Retrieve the orders for the user from the database
          const viewOrdersQuery = await pool.query('SELECT * FROM orders WHERE user_id = $1', [req.user.id]);
          const orders = viewOrdersQuery.rows;
      
          res.status(200).json({
            message: 'Orders retrieved successfully',
            orders,
          });
        } catch (error) {
          console.error('Error retrieving orders:', error);
          res.status(500).json({ message: 'Failed to retrieve orders' });
        }
      });
      
      
      

  
  module.exports = {
    addItems,
    submitReview,
    upload,
    getItems,
    searchItems,
    searchItemsbyId,
    addToCart,
    checkout,
    getOrders
  };
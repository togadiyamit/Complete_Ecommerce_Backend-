const Joi = require('joi');

const registrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const payment = Joi.object({
  address: Joi.required(),
  payment_method: Joi.required(),
  card_no: Joi.string().creditCard(),
  card_expiry_date: Joi.string().regex(/^\d{2}\/\d{2}$/),
  cvv_no: Joi.string().length(3).regex(/^\d+$/)
});

const review = Joi.object({
  item_id: Joi.number().integer().required(),
  rating: Joi.number().min(1).max(5).required(),
  review_text: Joi.string().required()

})

module.exports = {
  validateRegistration: (data) => registrationSchema.validate(data),
  validatePayment: (data) => payment.validate(data),
  validateReview: (data) => review.validate(data),

};
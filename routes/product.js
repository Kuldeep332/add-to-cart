const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    productName: String,
    productImage: String,
    price: Number,
    quantity: Number
  }],
  totalItems: Number // Total number of items in the cart
});

module.exports = mongoose.model('product', cartSchema);

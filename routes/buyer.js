const mongoose = require('mongoose');


const buyerSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	  }
})


module.exports = mongoose.model('buyer', )
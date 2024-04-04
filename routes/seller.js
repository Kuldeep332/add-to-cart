const mongoose = require('mongoose');


const SellerSchema = mongoose.Schema({
	
 name:String,
 media:String,
//  dec:String,
 price:String,
 category:String

  
})


module.exports = mongoose.model('seller', SellerSchema)
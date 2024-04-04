const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb://0.0.0.0/n17finalchallenge').then(() => {
  console.log('connected to db')
})

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  cata:String,
})

userSchema.plugin(plm)

module.exports = mongoose.model('user', userSchema)
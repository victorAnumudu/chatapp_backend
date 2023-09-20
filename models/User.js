const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    about: String,
    image: String,
    phone_number: {
        type: String, 
        unique:true
        // trim: true,
      // required: true,
      // maxlength: 32
    },
    password: String
},{timestamps: true})

const userModel = mongoose.model('User', UserSchema)


// Defining ref while creating about Schema
// const aboutSchema = new mongoose.Schema(
//   {
//       about: String,
//       image: {
//         type: String,
//       },
//       // image: {
//       //   data: String,
//       //   contentType: String,
//       // },
//       user: { type: mongoose.SchemaTypes.ObjectId, ref: userModel }
//   })


  module.exports = {userModel}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let user = new Schema({
    name:{
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    contact: {
      type: Number
    },
    
  });

  const user_model = mongoose.model("users_resell", user);

  module.exports = user_model;
  
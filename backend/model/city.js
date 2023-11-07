const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let resell_city = new Schema({
    city:{
      type: String
    },
    items:[{
      id:{
        type: String,
      },
      email:{
        type: String,
      },
      name:{
        type:String,
      },
      cost:{
        type:Number,
      },
      city:{
        type:String,
      },
      status:{
        type:Number,
      },
      description:{
        type:String,
      },

      image:{
        type:String
      },



    }]
    
  });

  const city_model = mongoose.model("resell_city", resell_city);

  module.exports = city_model;
  
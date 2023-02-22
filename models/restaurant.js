const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  id: {
    // 資料型別
    type: Number, 
    // 這是個必填欄位
    required: true 
  },
  name: {
    type: String,
    required: true 
  },
  name_en:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  google_map:{
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: true
  },
})
module.exports = mongoose.model('Restaurant', todoSchema)
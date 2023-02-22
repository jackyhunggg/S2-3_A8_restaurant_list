// 把 app.js 裡和「資料庫連線」有關的程式碼都複製過來一份
// 因為這裡要操作的資料和 Restaurant 有關
// 所以也要一併載入 Restaurant model
const mongoose = require('mongoose')
const db = mongoose.connection
const restaurantList = require('../../restaurant.json').results
// 載入 restaurant model
const Restaurant = require('../restaurant') 
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  Restaurant.create(restaurantList)
    .then( console.log('restaurantSeeder success!'))
    .catch((error) => console.log(error))
})  
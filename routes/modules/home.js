const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 使用者可以在首頁看到所有餐廳與它們的簡單資料
router.get('/', (req, res) => {
    Restaurant.find()
      .lean()
      .sort({ _id: 'asc' })
      .then(restaurantData => res.render('index', { restaurantData }))
      .catch(err => console.log(err))
  })

// export the router
module.exports = router
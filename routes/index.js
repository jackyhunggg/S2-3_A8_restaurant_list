// Load express and express router
const express = require('express')
const router = express.Router()
// import home module
const home = require('./modules/home')
// import restaurants module
const restaurants = require('./modules/restaurants')

// 將網址結構符合 / 字串的 request 導向 home 模組 
router.use('/', home)
router.use('/restaurants', restaurants)

// export the router
module.exports = router
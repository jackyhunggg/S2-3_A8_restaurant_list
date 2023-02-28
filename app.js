const express = require('express');
const exphbs = require('express-handlebars');
const Restaurant = require('./models/restaurant')
const app = express();
const port = 3000;
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
// 載入 mongoose
const mongoose = require('mongoose')
// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
    console.log('mongodb error!')
  })
// 連線成功
db.once('open', () => {
    console.log('mongodb connected!')
})

app.use(express.static('public'));
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// 使用者可以在首頁看到所有餐廳與它們的簡單資料
app.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .then(restaurantData => res.render('index', { restaurantData }))
        .catch(err => console.log(err))
})

// 使用者可以點進去看餐廳的詳細資訊
app.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    Restaurant.findById(id)
        .lean()
        .then(restaurantData => res.render('show', { restaurantData }))
        .catch(err => console.log(err))
})

// 使用者可以透過搜尋餐廳名稱and類別來找到特定的餐廳
app.get('/search', (req,res) => {
    // raw input value of the keyword
    const keyword = req.query.keyword
    // make the keyword and the restaurant name lower case
    const keywords = req.query.keyword.trim().toLowerCase()
    // if the search result is empty, redirect to main page
    if(!keyword) {
        res.redirect('/')
    }
    Restaurant.find({})
        .lean()
        .then(restaurantData => {
            // filter out the results
            const filteredrestaurantData = restaurantData.filter(
            // the data should be searched by restaurant name and its category
                data => data.name.toLowerCase.include(keywords) ||
                data.category.toLowerCase.include(keywords)
            )
            res.render('index',{restaurantData: filteredrestaurantData, keyword})
        })
        .catch(err => console.log(err))
})



app.listen(port, () => {
    console.log(`express is running on http:// localhost: ${port}`)
})
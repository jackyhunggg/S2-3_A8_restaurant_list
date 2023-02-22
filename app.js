const express = require('express');
// const exhbs = require('express-handlebars');

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const app = express();
const port = 3000;

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
// app.engine('handlebars', exhbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// 使用者可以在首頁看到所有餐廳與它們的簡單資料
app.get('/', (req, res) => {
    res.render('index', {restaurant: list.results});
})

// 使用者可以透過搜尋餐廳名稱and類別來找到特定的餐廳
app.get('/search', (req,res) => {
    const keyword = req.query.keyword;
    const restaurants = list.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) 
        || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase())
        || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    })
    console.log(restaurants)
    res.render('index', {restaurant: restaurants, keyword: keyword})
})

// 使用者可以點進去看餐廳的詳細資訊
app.get('/:restaurant_id', (req, res) => {
    // console.log('restaurant id: ', typeof(req.params.restaurant_id))
    const restaurant = list.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
    console.log(req.params.restaurant_id.toString())
    res.render('show', {restaurant: restaurant})
})

app.listen(port, () => {
    console.log(`express is running on http:// localhost: ${port}`)
})
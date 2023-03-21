const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require("method-override")
const Restaurant = require('./models/restaurant')
const app = express();
const port = 3000;
// 引用 body-parser
const bodyParser = require('body-parser');
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
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// 使用者可以在首頁看到所有餐廳與它們的簡單資料
app.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .then(restaurantData => res.render('index', { restaurantData }))
        .catch(err => console.log(err))
})

// 使用者可以點進去看餐廳的詳細資訊
app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    Restaurant.findById(id)
        .lean()
        .then(restaurantData => res.render('show', { restaurantData }))
        .catch(err => console.log(err))
})

// 新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

app.post('/restaurants', (req, res) => {
    Restaurant.create(req.body)
        .then(console.log(req.body))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

// 編輯餐廳
app.get('/restaurants/:restaurantId/edit', (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurantData => res.render('edit', { restaurantData }))
        .catch(err => console.log(err))
})

// 更新餐廳
app.put("/restaurants/:restaurantId", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findByIdAndUpdate(restaurantId, req.body)
      //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => console.log(err))
  })

// 刪除餐廳
app.delete("/restaurants/:restaurantId", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findByIdAndDelete(restaurantId)
      .then(() => res.redirect("/"))
      .catch(err => console.log(err))
  })

// 設定路由：搜尋餐廳關鍵字 or 餐廳類別
app.get('/search', (req, res) => {
    let keyword = req.query.keyword
  
    //若沒輸入內容時，將頁面導回根目錄，顯示出所有餐廳
    if (!keyword) {
      return res.redirect("/")
    }
  
    Restaurant.find({})
      .lean()
      .then(restaurantData => {
        const filterData =
          restaurantData.filter(restaurant =>
            restaurant.name.toLowerCase().includes(keyword.toLowerCase()) 
            || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase())
            || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
          )
        res.render('index', { restaurantData: filterData, keyword })
      })
  })

app.listen(port, () => {
    console.log(`express is running on http:// localhost: ${port}`)
})
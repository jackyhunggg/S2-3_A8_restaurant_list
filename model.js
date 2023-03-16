const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI) // 設定連線到 mongoDB

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

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// setting static files
app.use(express.static('public'))

// 設定路由：首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 設定路由：增加新餐廳
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//設定路由：接住表單新增餐廳資料，並且把資料送往資料庫
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 設定路由：瀏覽特定餐廳Detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
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
    .then(restaurants => {
      const filterData =
        restaurants.filter(restaurant =>
          restaurant.name.toLowerCase().includes(keyword.toLowerCase().trim()) || restaurant.category.includes(keyword.trim()))

      res.render('index', { restaurants: filterData, keyword })

    })

})

// 設定路由：表單可編輯修改餐廳資料
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//設定路由：接住表單修改餐廳資料，並且把資料送往資料庫
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id //id 從網址上用 req.params.id 取出
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//設定路由：刪除餐廳資料
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

//啟動伺服器
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
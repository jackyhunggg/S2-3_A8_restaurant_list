const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant')
const app = express()
// 引用路由器
const routes = require('./routes')
const port = 3000
// 引用 body-parser
const bodyParser = require('body-parser')
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

app.use(express.static('public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// 將 request 導入路由器
app.use(routes)

app.listen(port, () => {
  console.log(`express is running on http:// localhost: ${port}`)
})

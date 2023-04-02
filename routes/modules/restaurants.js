// Load express and express router
const express = require('express')
const router = express.Router()

// 新增餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 使用者可以點進去看餐廳的詳細資訊
router.get('/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  Restaurant.findById(id)
    .lean()
    .then(restaurantData => res.render('show', { restaurantData }))
    .catch(err => console.log(err))
})

router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(console.log(req.body))
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯餐廳
router.get('/:restaurantId/edit', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render('edit', { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳
router.put('/:restaurantId', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
  // 可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(err))
})

// 刪除餐廳
router.post('/:restaurantId/delete', (req, res) => {
  const restaurantId = req.params.restaurantId
  console.log(req.params)
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 設定路由：搜尋餐廳關鍵字 or 餐廳類別
router.get('/search', (req, res) => {
  const keyword = req.query.keyword

  // 若沒輸入內容時，將頁面導回根目錄，顯示出所有餐廳
  if (!keyword) {
    return res.redirect('/')
  }

  Restaurant.find({})
    .lean()
    .then(restaurantData => {
      const filterData =
          restaurantData.filter(restaurant =>
            restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
            restaurant.name_en.toLowerCase().includes(keyword.toLowerCase()) ||
            restaurant.category.toLowerCase().includes(keyword.toLowerCase())
          )
      res.render('index', { restaurantData: filterData, keyword })
    })
})

// export the router
module.exports = router
const express = require('express')
const videoController = require('../controller/videoController')
const vodController = require('../controller/vodController')

const router = express.Router()

router
  .get('/', (req, res) => {
    res.send('/video')
  })
  .get('/lists', videoController.videoList)
  .get('/getVodKey', vodController.getVodKey)
  .delete('/', videoController.deleteVideo)

module.exports = router
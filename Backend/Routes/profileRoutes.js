const express = require('express')
const router = express.Router()
const { getProfile, editProfile } = require('../Controller/profileController')

router.get('/profile', getProfile)
router.post('/profile/edit', editProfile)

module.exports = router

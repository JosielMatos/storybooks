const express = require('express')
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

module.exports = router
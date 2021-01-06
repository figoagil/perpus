const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest} = require('../middleware/auth')
const Book = require('../models/Book')
// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('Login', {
        layout: 'Login'
    })
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const books = await Book.find({user: req.user.id}).lean()
        res.render('Dashboard', {
            name: req.user.firstName,
            books
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
 
module.exports = router
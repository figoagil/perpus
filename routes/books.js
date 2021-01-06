const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Book = require('../models/Book')
// @desc halaman add
// @route GET /books/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('books/add')
})

// @desc halaman tentang
// @route GET /books/about
router.get('/about', ensureAuth, (req, res) => {
    res.render('books/about')
})
// @desc memproses form add
// @route POST /books
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Book.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
// @desc tampilan semua buku
// @route GET /books
router.get('/', ensureAuth, async (req, res) => {
    try {
        const books = await Book.find()
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()
        res.render('books/index', {
            books,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc halaman buku per id
// @route GET /books/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let book = await Book.findById(req.params.id)
        .populate('user')
        .lean()
        if (!book) {
            return res.render('error/404')
        }
        res.render('books/show', {
            book
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})


// @desc halaman edit
// @route GET /books/edit:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id
        }).lean()
        if(!book) {
            return res.render('error/404')
        }
    
        if(book.user != req.user.id) {
            res.redirect('/books')
        } else {
            res.render('books/edit', {
                book,
            })
        }    
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
// @desc Update data buku
// @route PUT /books/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let book = await Book.findById(req.params.id).lean()
        if(!book){
            return res.render('error/404')
        }
        if(book.user != req.user.id) {
            res.redirect('/books')
        }else {
            book = await Book.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
    }    
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
    
})

// @desc hapus data bku
// @route DELETE /books/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Book.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')      
    }
})

// @desc buku berdasar user
// @route GET /books/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const books = await Book.find({
            user: req.params.userId
        })
        .populate('user')
        .lean()

        res.render('books/index', {
            books
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router
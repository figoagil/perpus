const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BookSchema = new mongoose.Schema({
    nama_buku: {
        type: String,
        required: true,
        trim: true,
    },
    author_buku: {
        type: String,
        required: true
    },
    section_buku: {
        type: String,
        default: 'Umum',
        enum: ['Umum', 'Filsafat dan Psikologi', 'Agama', 'Sosial', 'Bahasa', 'Sains dan Matematika', 'Teknologi', 'Seni dan Rekreasi', 'Literatur dan Sastra', 'Sejarah dan Geografi']

    },
    status_buku: {
        type: String,
        default: 'Tersedia',
        enum: ['Tersedia', 'Dipinjam']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Book', BookSchema)
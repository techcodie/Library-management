const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// CREATE a new book
router.post('/', async (req, res) => {
try {
    const { title, summary, isbn, url, authorId, genreIds } = req.body;

    const book = await prisma.book.create({
    data: {
        title,
        summary,
        isbn,
        url,
        authorId,
        genres: {
        create: genreIds?.map(genreId => ({
            genre: { connect: { id: genreId } }
        })) || []
        }
    },
    include: {
        author: true,
        genres: {
        include: {
            genre: true
        }
        }
    }
    });

    res.status(201).json(book);
} catch (error) {
    res.status(400).json({ error: error.message });
}
});

module.exports = router;
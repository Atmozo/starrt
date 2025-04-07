const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all articles
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM articles');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single article by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Article not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new article
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    try {
        const [result] = await db.query('INSERT INTO articles (title, content) VALUES (?, ?)', [title, content]);
        res.status(201).json({ id: result.insertId, title, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an article
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    try {
        const [result] = await db.query('UPDATE articles SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Article not found' });
        res.json({ id: req.params.id, title, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an article
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

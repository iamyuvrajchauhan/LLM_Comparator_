const express = require('express');
const { createQuery, getHistory, deleteQuery, renameQuery, getModelsList } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/query -> Accept user question, call LLMs, summarize, and save
router.post('/query', protect, createQuery);

// GET /api/query/models -> Fetch list of available models dynamically
router.get('/models', protect, getModelsList);

// GET /api/query/history -> Return previous queries
router.get('/history', protect, getHistory);

// DELETE /api/query/history/:id -> Delete a specific query
router.delete('/history/:id', protect, deleteQuery);

// PATCH /api/query/history/:id/rename -> Rename a specific chat
router.patch('/history/:id/rename', protect, renameQuery);

module.exports = router;

const express = require('express');
const{
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExel
} = require('../controllers/expenseController');

const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect,addExpense);
router.get('/get', protect, getAllExpense);
router.delete('/:id', protect, deleteExpense);
router.get('/downloadexcel', protect, downloadExpenseExel);

module.exports = router;
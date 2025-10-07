const XLSX = require('xlsx');
const Expense = require('../models/Expense');

//add Expense source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validate input
        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new income entry
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        console.log('New income entry:', newExpense);

        await newExpense.save();

        console.log('Income saved successfully:', newExpense);

        res.status(200).json({ newExpense });
    }catch (error) {
        console.error('Error saving income:', error);
        res.status(500).json({ message: 'Server error'});
    }
}

//Get All Expense source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
};
//delete expense source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
};  

//Download excel
exports.downloadExpenseExel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Expense');
        XLSX.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message});
    }
};
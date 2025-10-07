const XLSX = require('xlsx');
const Income = require('../models/Income');

//add income source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        // Validate input
        if (!source || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new income entry
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        console.log('New income entry:', newIncome);

        await newIncome.save();

        console.log('Income saved successfully:', newIncome);

        res.status(200).json({ newIncome });
    }catch (error) {
        console.error('Error saving income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//Get All income source
exports.getAllIncomes = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
};
//delete income source
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: 'Income deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
};  

//Download excel
exports.downloadIncomeExel = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = incomes.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Incomes');
        XLSX.writeFile(wb, 'incomes_details.xlsx');
        res.download('incomes_details.xlsx');
    } catch (error) {
            res.status(500).json({ message: 'Server error'});
    }
};
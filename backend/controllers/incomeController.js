const User = require("../models/User");
const Income = require("../models/Income");
const xlsx = require("xlsx");

exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, source, amount, date } = req.body;

        if(!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const income = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        await income.save();
        res.status(201).json({ message: "Income added successfully", income });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json({ income });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


exports.deleteIncome = async (req, res) => {
    // const userId = req.user.id;
    // const { id } = req.params;
    
    try{
        const income = await Income.findByIdAndDelete(req.params.id);
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map(item => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

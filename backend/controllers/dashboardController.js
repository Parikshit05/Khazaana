const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

// Dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Total Income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Total Expense
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Income last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        // Expense last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const expenseLast30Days = last30DaysExpenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        // Last 5 income transactions
        const last5IncomeTransactions = (await Income.find({ userId }).sort({ date: -1 }).limit(5))
            .map(txn => ({ ...txn.toObject(), type: "income" }));

        // Last 5 expense transactions
        const last5ExpenseTransactions = (await Expense.find({ userId }).sort({ date: -1 }).limit(5))
            .map(txn => ({ ...txn.toObject(), type: "expense" }));

        // Merge and sort latest first
        const lastTransactions = [...last5IncomeTransactions, ...last5ExpenseTransactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Final response
        res.status(200).json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

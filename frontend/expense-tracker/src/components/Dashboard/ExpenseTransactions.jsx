import moment from "moment";
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <button onClick={onSeeMore} className="card-btn">
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        {transactions?.slice(0, 4)?.map((txn) => (
          <TransactionInfoCard
            key={txn._id}
            title={txn.type == "expense" ? txn.category : txn.source}
            icon={txn.icon}
            date={moment(txn.date).format("Do MMM YYYY")}
            amount={txn.amount}
            type={txn.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;

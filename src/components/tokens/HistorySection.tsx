import React from 'react';
import { History, TrendingUp, TrendingDown, Filter } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'deposit' | 'spent';
  amount: number;
  date: string;
  description: string;
  category?: string;
  location?: string;
}

interface HistorySectionProps {
  transactions: Transaction[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ transactions }) => {
  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">Total Deposits</span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-green-700">{totalDeposits} EUR</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-700">Total Spent</span>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-red-700">{totalSpent} EUR</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Transaction History</h3>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                  {transaction.location && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {transaction.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`font-bold ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}{Math.abs(transaction.amount)} EUR
                </span>
                {transaction.category && (
                  <p className="text-xs text-gray-500 mt-1">{transaction.category}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
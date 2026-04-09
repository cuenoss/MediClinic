import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building,
  Users,
  Zap,
  Package,
  Wrench,
  FileText,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function Finance() {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  });

  // Mock data - in real app this would come from API
  const todayRevenue = 2500;
  const totalRevenue = 45600;
  const todayExpenses = 800;
  const totalExpenses = 12300;

  const recentTransactions = [
    { id: 1, type: 'revenue', amount: 150, description: 'Patient Consultation - Sarah Johnson', date: '2026-04-08', category: 'Consultation' },
    { id: 2, type: 'expense', amount: 200, description: 'Medical Supplies', date: '2026-04-08', category: 'Medical Material' },
    { id: 3, type: 'revenue', amount: 300, description: 'Patient Consultation - Mike Smith', date: '2026-04-08', category: 'Consultation' },
    { id: 4, type: 'expense', amount: 150, description: 'Nurse Salary', date: '2026-04-07', category: 'Salary' },
    { id: 5, type: 'revenue', amount: 200, description: 'Lab Tests - Emma Davis', date: '2026-04-07', category: 'Lab Tests' },
  ];

  const expenseCategories = [
    { key: 'rent', label: 'Clinic Rent', icon: Building, color: 'text-blue-600' },
    { key: 'salary', label: 'Nurse Salary', icon: Users, color: 'text-green-600' },
    { key: 'utilities', label: 'Electricity / Water / Internet', icon: Zap, color: 'text-yellow-600' },
    { key: 'medical', label: 'Medical Material', icon: Package, color: 'text-red-600' },
    { key: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-purple-600' },
    { key: 'supplies', label: 'Paper, Receipts, Office Supplies', icon: FileText, color: 'text-orange-600' },
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 3200, expenses: 2100 },
    { month: 'Feb', revenue: 3800, expenses: 2300 },
    { month: 'Mar', revenue: 4100, expenses: 2500 },
    { month: 'Apr', revenue: 3500, expenses: 2200 },
  ];

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.date) {
      console.log('Adding expense:', newExpense);
      setShowAddExpenseModal(false);
      setNewExpense({
        category: '',
        amount: '',
        date: '',
        description: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Finance</h1>
        <Button
          onClick={() => setShowAddExpenseModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-600">${todayRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Today's Expenses</p>
              <p className="text-2xl font-bold text-red-600">${todayExpenses}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${totalExpenses}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Overview</h3>
        <div className="space-y-4">
          {monthlyData.map((month) => (
            <div key={month.month} className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-slate-600">{month.month}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-slate-200 rounded-full h-4 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                      style={{ width: `${(month.revenue / 5000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-green-600 w-20 text-right">${month.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-4 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                      style={{ width: `${(month.expenses / 5000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-red-600 w-20 text-right">${month.expenses}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-slate-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-slate-600">Expenses</span>
          </div>
        </div>
      </Card>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Expense Categories</h3>
          <div className="space-y-3">
            {expenseCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{category.label}</p>
                      <p className="text-sm text-slate-600">Monthly average</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">$450</p>
                    <p className="text-sm text-slate-600">This month</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3 max-h-96 overflow-auto">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'revenue' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{transaction.description}</p>
                    <p className="text-xs text-slate-600">{transaction.date} · {transaction.category}</p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'revenue' ? '+' : '-'}${transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">Add Expense</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddExpenseModal(false)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Enter expense description..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 h-20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddExpense}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newExpense.category || !newExpense.amount || !newExpense.date}
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
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
import { financeService, Expense, ExpenseStats, MonthlyOverview } from '../../services/finance';

export function Finance() {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseStats, setExpenseStats] = useState<ExpenseStats | null>(null);
  const [monthlyOverview, setMonthlyOverview] = useState<MonthlyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: ''
  });

  // Fetch expense stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [stats, overview] = await Promise.all([
          financeService.getExpenseStats(),
          financeService.getMonthlyOverview(),
        ]);
        setExpenseStats(stats);
        setMonthlyOverview(overview);
      } catch (error) {
        console.error('Failed to fetch finance stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const recentTransactions = [
    // TODO: Implement API call to get recent transactions
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
    // TODO: Implement API call to get monthly data
  ];

  const handleAddExpense = async () => {
    if (newExpense.amount && newExpense.date) {
      try {
        await financeService.createExpense({
          amount: parseInt(newExpense.amount),
          date: newExpense.date,
          description: newExpense.description,
          category: newExpense.category
        });
        
        // Refresh stats
        const stats = await financeService.getExpenseStats();
        setExpenseStats(stats);
        
        setShowAddExpenseModal(false);
        setNewExpense({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          category: ''
        });
      } catch (error) {
        console.error('Failed to add expense:', error);
      }
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

      {/* Expense Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${loading ? '...' : (expenseStats?.todays_revenue || 0)}
              </p>
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
              <p className="text-2xl font-bold text-slate-800">
                ${loading ? '...' : (expenseStats?.total_revenue || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Today's Profit</p>
              <p className="text-2xl font-bold text-blue-600">
                ${loading ? '...' : (expenseStats?.todays_profit || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-2">Revenue (last 30 days)</p>
            <p className="text-2xl font-semibold text-slate-800">
              ${loading ? '...' : (monthlyOverview?.revenue || 0)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-2">Expenses (last 30 days)</p>
            <p className="text-2xl font-semibold text-slate-800">
              ${loading ? '...' : (monthlyOverview?.expenses || 0)}
            </p>
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
                      <p className="text-sm text-slate-600">Category</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">Available</p>
                    <p className="text-sm text-slate-600">For expenses</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
          <p className="text-slate-600">Recent transactions will be displayed here once the API provides transaction history.</p>
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

import { api } from './api';

export interface Expense {
  id?: number;
  amount: number;
  date: string;
  description?: string;
  category?: string;
}

export interface ExpenseStats {
  todays_revenue: number;
  total_revenue: number;
  todays_expenses: number;
  total_expenses: number;
  todays_profit: number;
  total_profit: number;
}

export interface MonthlyOverview {
  revenue: number;
  expenses: number;
}

export class FinanceService {
  private apiClient: any;

  constructor() {
    this.apiClient = api;
  }

  // Get expense statistics and revenue totals
  async getExpenseStats(): Promise<ExpenseStats> {
    return this.apiClient.request('/api/finance/expenses/');
  }

  // Get monthly overview data
  async getMonthlyOverview(): Promise<MonthlyOverview> {
    return this.apiClient.request('/api/finance/overview/');
  }

  // Create new expense
  async createExpense(expenseData: Expense): Promise<Expense> {
    return this.apiClient.request('/api/finance/expenses/', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }
}

export const financeService = new FinanceService();
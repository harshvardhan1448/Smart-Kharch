import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../Utils/axiosinstance';
import { API_PATHS } from '../../Utils/apiPaths';
import InfoCard from '../../components/Cards/InfoCard';
import TransactionInfoCard from '../../components/Cards/TransactionInfoCard';
import { LuHandCoins, LuDownload, LuPlus } from 'react-icons/lu';
import { addThousandSeparator } from '../../Utils/helper';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';

const Expense = () => {
  useUserAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Form states
  const [icon, setIcon] = useState('🛒');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch all expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenses(response.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!category || !amount || !date) {
      toast.error('Please fill all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        icon,
        category,
        amount: parseFloat(amount),
        date,
      });

      if (response.data) {
        toast.success('Expense added successfully');
        setCategory('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setIcon('🛒');
        fetchExpenses();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  // Download Excel
  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_Expense, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel file downloaded');
    } catch (error) {
      console.error('Error downloading excel:', error);
      toast.error('Failed to download excel');
    }
  };

  // Calculate statistics
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const last30DaysExpense = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return expenseDate >= thirtyDaysAgo;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <DashboardLayout activeMenu="expense">
      <div className="my-5 mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InfoCard
            icon={<LuHandCoins />}
            lable="Total Expense"
            value={addThousandSeparator(totalExpense)}
            color="bg-red-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            lable="Last 30 Days Expense"
            value={addThousandSeparator(last30DaysExpense)}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Expense</h3>
              <form onSubmit={handleAddExpense}>
                {/* Emoji Picker */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700 font-medium mb-2 block">
                    Icon
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full text-left px-4 py-3 bg-slate-100 rounded border border-slate-200 text-2xl hover:bg-slate-200 transition-colors"
                    >
                      {icon}
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute z-10 mt-2">
                        <EmojiPicker
                          onEmojiClick={(emojiObject) => {
                            setIcon(emojiObject.emoji);
                            setShowEmojiPicker(false);
                          }}
                          width={300}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Input */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700 font-medium mb-2 block">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Food, Transport, Shopping"
                    className="input-box"
                  />
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700 font-medium mb-2 block">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="input-box"
                  />
                </div>

                {/* Date Input */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700 font-medium mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-box"
                  />
                </div>

                <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                  <LuPlus /> Add Expense
                </button>
              </form>
            </div>
          </div>

          {/* Expense List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Expense History ({expenses.length})
                </h3>
                <button
                  onClick={handleDownloadExcel}
                  className="card-btn"
                  disabled={expenses.length === 0}
                >
                  <LuDownload /> Download Excel
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No expense records yet. Add your first expense!
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  {expenses.map((expense) => (
                    <TransactionInfoCard
                      key={expense._id}
                      title={expense.category}
                      icon={expense.icon}
                      date={moment(expense.date).format('MMM DD, YYYY')}
                      amount={addThousandSeparator(expense.amount)}
                      type="expense"
                      onDelete={() => handleDeleteExpense(expense._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;

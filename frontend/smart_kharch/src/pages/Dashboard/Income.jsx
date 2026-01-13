import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../Utils/axiosinstance';
import { API_PATHS } from '../../Utils/apiPaths';
import InfoCard from '../../components/Cards/InfoCard';
import TransactionInfoCard from '../../components/Cards/TransactionInfoCard';
import { LuWalletMinimal, LuDownload, LuPlus } from 'react-icons/lu';
import { addThousandSeparator } from '../../Utils/helper';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';

const Income = () => {
  useUserAuth();

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Form states
  const [icon, setIcon] = useState('💰');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch all incomes
  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomes(response.data);
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
      toast.error('Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Add income
  const handleAddIncome = async (e) => {
    e.preventDefault();

    if (!source || !amount || !date) {
      toast.error('Please fill all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        icon,
        source,
        amount: parseFloat(amount),
        date,
      });

      if (response.data) {
        toast.success('Income added successfully');
        setSource('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setIcon('💰');
        fetchIncomes();
      }
    } catch (error) {
      console.error('Error adding income:', error);
      toast.error(error.response?.data?.message || 'Failed to add income');
    }
  };

  // Delete income
  const handleDeleteIncome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      toast.success('Income deleted successfully');
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error('Failed to delete income');
    }
  };

  // Download Excel
  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'incomes_details.xlsx');
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
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const last60DaysIncome = incomes
    .filter((income) => {
      const incomeDate = new Date(income.date);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      return incomeDate >= sixtyDaysAgo;
    })
    .reduce((sum, income) => sum + income.amount, 0);

  return (
    <DashboardLayout activeMenu="income">
      <div className="my-5 mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InfoCard
            icon={<LuWalletMinimal />}
            lable="Total Income"
            value={addThousandSeparator(totalIncome)}
            color="bg-green-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            lable="Last 60 Days Income"
            value={addThousandSeparator(last60DaysIncome)}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Income Form */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Income</h3>
              <form onSubmit={handleAddIncome}>
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

                {/* Source Input */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700 font-medium mb-2 block">
                    Source
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g., Salary, Freelance"
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
                  <LuPlus /> Add Income
                </button>
              </form>
            </div>
          </div>

          {/* Income List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Income History ({incomes.length})
                </h3>
                <button
                  onClick={handleDownloadExcel}
                  className="card-btn"
                  disabled={incomes.length === 0}
                >
                  <LuDownload /> Download Excel
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : incomes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No income records yet. Add your first income!
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  {incomes.map((income) => (
                    <TransactionInfoCard
                      key={income._id}
                      title={income.source}
                      icon={income.icon}
                      date={moment(income.date).format('MMM DD, YYYY')}
                      amount={addThousandSeparator(income.amount)}
                      type="income"
                      onDelete={() => handleDeleteIncome(income._id)}
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

export default Income;

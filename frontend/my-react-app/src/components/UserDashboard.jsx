import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../services/api';
import {
  Dashboard,
  AccountBalanceWallet,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Refresh,
  Settings,
  Person,
  Security,
  Warning,
  Business,
  Dns,
  TrendingUp,
  Print,
  CalendarToday,
  Assessment,
  BarChart,
  PieChart,
  AttachMoney,
  Receipt,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';

// Sidebar Component for User Dashboard
const UserSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { id: 'accounting', label: 'Accounting', icon: <AccountBalanceWallet /> },
  ];

  return (
    <div className="w-64 bg-gray-900 flex flex-col h-screen shadow-xl fixed">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">U</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">User Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-xs text-gray-300">Employee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <div className="mb-6 px-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Main Menu</p>
        </div>
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Person className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white">{localStorage.getItem('userName') || 'User'}</h4>
            <p className="text-xs text-gray-400">{localStorage.getItem('userRole') || 'user'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-300 text-sm font-medium transition-colors group"
        >
          <Security className="text-xl group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// User Accounting Module Component
const UserAccountingModule = () => {
  const [activeSubTab, setActiveSubTab] = useState('accounts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for Accounts
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ code: '', name: '', type: 'Asset' });
  
  // State for Journal Entries
  const [journalEntries, setJournalEntries] = useState([]);
  const [newJournal, setNewJournal] = useState({
    date: '',
    description: '',
    reference_number: '',
    lines: [
      { account_id: '', debit: 0, credit: 0 },
      { account_id: '', debit: 0, credit: 0 }
    ]
  });
  
  // State for Invoices  
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ client_name: '', total: '', status: 'draft' });
  
  // State for Payments
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    invoice_id: '',
    amount: '',
    payment_date: '',
    payment_method: 'bank_transfer',
    reference_number: '',
    notes: ''
  });
  
  // State for Reports
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('');
  const [reportDates, setReportDates] = useState({
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    as_of_date: '2026-12-31'
  });
  const [groupedTrialBalance, setGroupedTrialBalance] = useState(false);

  // Fetch Accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounting/accounts`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      console.log('Fetched accounts:', response.data);
      // API returns {accounts: [...]} not just [...]
      const accountsData = response.data.accounts || response.data;
      setAccounts(Array.isArray(accountsData) ? accountsData : []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  // Create Account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/accounting/accounts`, newAccount, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      setSuccess('Account created successfully!');
      setTimeout(() => setSuccess(''), 5000);
      setNewAccount({ code: '', name: '', type: 'Asset' });
      fetchAccounts();
    } catch (err) {
      console.error('Account creation error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create account');
    }
  };

  // Fetch Journal Entries
  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounting/journal-entries`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      console.log('Fetched journal entries:', response.data);
      // API may return {journal_entries: [...]} or direct array
      const entriesData = response.data.journal_entries || response.data.entries || response.data;
      setJournalEntries(Array.isArray(entriesData) ? entriesData : []);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  };

  // Create Journal Entry
  const handleCreateJournal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Convert account_id to number and debit/credit to floats
      const journalData = {
        ...newJournal,
        lines: newJournal.lines.map(line => ({
          account_id: parseInt(line.account_id),
          debit: parseFloat(line.debit) || 0,
          credit: parseFloat(line.credit) || 0
        }))
      };
      
      await axios.post(`${API_BASE_URL}/api/accounting/journal-entries`, journalData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      setSuccess('Journal entry created successfully!');
      setTimeout(() => setSuccess(''), 5000);
      setNewJournal({
        date: '',
        description: '',
        reference_number: '',
        lines: [
          { account_id: '', debit: 0, credit: 0 },
          { account_id: '', debit: 0, credit: 0 }
        ]
      });
      fetchJournalEntries();
    } catch (err) {
      console.error('Journal entry creation error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create journal entry');
    }
  };

  // Fetch Invoices
  const fetchInvoices = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounting/invoices`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      console.log('Fetched invoices:', response.data);
      // API may return {invoices: [...]} or direct array
      const invoicesData = response.data.invoices || response.data;
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      if (!silent) setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch invoices');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Create Invoice
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Convert total to number
      const invoiceData = {
        ...newInvoice,
        total: parseFloat(newInvoice.total)
      };
      
      await axios.post(`${API_BASE_URL}/api/accounting/invoices`, invoiceData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      setSuccess('Invoice created successfully!');
      setTimeout(() => setSuccess(''), 5000);
      setNewInvoice({ client_name: '', total: '', status: 'draft' });
      fetchInvoices();
    } catch (err) {
      console.error('Invoice creation error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create invoice');
    }
  };

  // Update Invoice Status
  const handleUpdateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/accounting/invoices/${invoiceId}/status`, 
        { status: newStatus },
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
        }
      );
      setSuccess('Invoice status updated successfully!');
      setTimeout(() => setSuccess(''), 5000);
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update invoice status');
    }
  };

  // Fetch Payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounting/payments`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      console.log('Fetched payments:', response.data);
      // API may return {payments: [...]} or direct array
      const paymentsData = response.data.payments || response.data;
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  // Create Payment
  const handleCreatePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Convert invoice_id and amount to numbers
      const paymentData = {
        ...newPayment,
        invoice_id: parseInt(newPayment.invoice_id),
        amount: parseFloat(newPayment.amount)
      };
      
      await axios.post(`${API_BASE_URL}/api/accounting/payments`, paymentData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      setSuccess('Payment created successfully!');
      setTimeout(() => setSuccess(''), 5000);
      setNewPayment({
        invoice_id: '',
        amount: '',
        payment_date: '',
        payment_method: 'bank_transfer',
        reference_number: '',
        notes: ''
      });
      fetchPayments();
    } catch (err) {
      console.error('Payment creation error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create payment');
    }
  };

  // Generate Report
  const generateReport = async (type) => {
    try {
      setLoading(true);
      setReportType(type);
      const token = localStorage.getItem('token');
      
      let url = '';
      if (type === 'trial-balance') {
        url = `${API_BASE_URL}/api/accounting/trial-balance?start_date=${reportDates.start_date}&end_date=${reportDates.end_date}${groupedTrialBalance ? '&grouped=true' : ''}`;
      } else if (type === 'income-statement') {
        url = `${API_BASE_URL}/api/accounting/income-statement?start_date=${reportDates.start_date}&end_date=${reportDates.end_date}`;
      } else if (type === 'balance-sheet') {
        url = `${API_BASE_URL}/api/accounting/balance-sheet?as_of_date=${reportDates.as_of_date}`;
      }
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      console.log(`Report ${type} data:`, response.data);
      setReportData(response.data);
      setSuccess('Report generated successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Print report
  const handlePrintReport = () => {
    window.print();
  };

  // ===== PROFESSIONAL REPORT RENDERERS =====

  // Trial Balance Report Renderer
  const renderTrialBalanceReport = (data) => {
    const entries = data.trial_balance || data.entries || data.accounts || (Array.isArray(data) ? data : []);
    const totals = data.totals || {};
    const companyName = JSON.parse(localStorage.getItem('companyInfo') || '{}')?.name || 'Company';

    // Check if grouped
    if (data.grouped_accounts || data.groups) {
      const groups = data.grouped_accounts || data.groups || {};
      return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white print:bg-blue-800">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{companyName}</h2>
                <h3 className="text-xl mt-1 opacity-90">Trial Balance (Grouped)</h3>
                <p className="mt-2 opacity-75 flex items-center gap-2">
                  <CalendarToday fontSize="small" />
                  {formatDate(reportDates.start_date)} — {formatDate(reportDates.end_date)}
                </p>
              </div>
              <button onClick={handlePrintReport} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors print:hidden">
                <Print />
              </button>
            </div>
          </div>

          <div className="p-6">
            {Object.entries(groups).map(([groupName, groupAccounts]) => {
              const accs = Array.isArray(groupAccounts) ? groupAccounts : (groupAccounts?.accounts || []);
              return (
                <div key={groupName} className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3 uppercase tracking-wide">
                    {groupName}
                  </h4>
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase">
                        <th className="text-left py-2 px-4">Code</th>
                        <th className="text-left py-2 px-4">Account Name</th>
                        <th className="text-right py-2 px-4">Debit</th>
                        <th className="text-right py-2 px-4">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accs.map((acc, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-500 font-mono">{acc.code || acc.account_code}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">{acc.name || acc.account_name}</td>
                          <td className="py-3 px-4 text-sm text-right font-mono">
                            {parseFloat(acc.debit || acc.total_debit || 0) > 0 ? formatCurrency(acc.debit || acc.total_debit) : '—'}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-mono">
                            {parseFloat(acc.credit || acc.total_credit || 0) > 0 ? formatCurrency(acc.credit || acc.total_credit) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* Totals */}
            <div className="mt-6 border-t-2 border-gray-800 pt-4">
              <div className="flex justify-between items-center bg-gray-900 text-white rounded-xl p-4">
                <span className="text-lg font-bold">TOTALS</span>
                <div className="flex gap-16">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase">Total Debits</p>
                    <p className="text-xl font-bold">{formatCurrency(totals.total_debits || totals.debits || 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase">Total Credits</p>
                    <p className="text-xl font-bold">{formatCurrency(totals.total_credits || totals.credits || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Non-grouped trial balance
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white print:bg-blue-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{companyName}</h2>
              <h3 className="text-xl mt-1 opacity-90">Trial Balance</h3>
              <p className="mt-2 opacity-75 flex items-center gap-2">
                <CalendarToday fontSize="small" />
                {formatDate(reportDates.start_date)} — {formatDate(reportDates.end_date)}
              </p>
            </div>
            <button onClick={handlePrintReport} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors print:hidden">
              <Print />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Code</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Account Name</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Debit</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-mono text-gray-500">{entry.code || entry.account_code}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{entry.name || entry.account_name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      (entry.type || entry.account_type) === 'Asset' ? 'bg-blue-100 text-blue-700' :
                      (entry.type || entry.account_type) === 'Liability' ? 'bg-red-100 text-red-700' :
                      (entry.type || entry.account_type) === 'Equity' ? 'bg-purple-100 text-purple-700' :
                      (entry.type || entry.account_type) === 'Revenue' ? 'bg-green-100 text-green-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {entry.type || entry.account_type || '—'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right font-mono">
                    {parseFloat(entry.debit || entry.total_debit || 0) > 0 
                      ? <span className="text-gray-900">{formatCurrency(entry.debit || entry.total_debit)}</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-4 px-6 text-sm text-right font-mono">
                    {parseFloat(entry.credit || entry.total_credit || 0) > 0 
                      ? <span className="text-gray-900">{formatCurrency(entry.credit || entry.total_credit)}</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-900 text-white">
                <td colSpan="3" className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Total</td>
                <td className="py-4 px-6 text-right font-mono font-bold text-lg">
                  {formatCurrency(totals.total_debits || totals.debits || entries.reduce((s, e) => s + (parseFloat(e.debit || e.total_debit) || 0), 0))}
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-lg">
                  {formatCurrency(totals.total_credits || totals.credits || entries.reduce((s, e) => s + (parseFloat(e.credit || e.total_credit) || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Balance Status */}
        <div className="p-4 border-t border-gray-200">
          {(() => {
            const totalD = parseFloat(totals.total_debits || totals.debits || 0) || entries.reduce((s, e) => s + (parseFloat(e.debit || e.total_debit) || 0), 0);
            const totalC = parseFloat(totals.total_credits || totals.credits || 0) || entries.reduce((s, e) => s + (parseFloat(e.credit || e.total_credit) || 0), 0);
            const balanced = Math.abs(totalD - totalC) < 0.01;
            return (
              <div className={`flex items-center justify-center gap-2 py-3 rounded-xl ${
                balanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {balanced ? (
                  <><span className="text-xl">✓</span><span className="font-semibold">Trial Balance is in Balance</span></>
                ) : (
                  <><Warning fontSize="small" /><span className="font-semibold">Trial Balance is OUT of Balance — Difference: {formatCurrency(Math.abs(totalD - totalC))}</span></>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  // Income Statement Report Renderer
  const renderIncomeStatementReport = (data) => {
    const companyName = JSON.parse(localStorage.getItem('companyInfo') || '{}')?.name || 'Company';
    const revenue = data.revenue || data.revenues || { accounts: [], total: 0 };
    const expenses = data.expenses || { accounts: [], total: 0 };
    const netIncome = data.net_income ?? (parseFloat(revenue.total || 0) - parseFloat(expenses.total || 0));
    const revenueAccounts = revenue.accounts || revenue.items || (Array.isArray(revenue) ? revenue : []);
    const expenseAccounts = expenses.accounts || expenses.items || (Array.isArray(expenses) ? expenses : []);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white print:bg-green-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{companyName}</h2>
              <h3 className="text-xl mt-1 opacity-90">Income Statement</h3>
              <p className="mt-2 opacity-75 flex items-center gap-2">
                <CalendarToday fontSize="small" />
                For the period {formatDate(reportDates.start_date)} — {formatDate(reportDates.end_date)}
              </p>
            </div>
            <button onClick={handlePrintReport} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors print:hidden">
              <Print />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Revenue Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ArrowUpward className="text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Revenue</h4>
            </div>
            <div className="bg-green-50/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-green-200">
                    <th className="text-left py-3 px-6 text-xs font-bold text-green-700 uppercase">Account</th>
                    <th className="text-right py-3 px-6 text-xs font-bold text-green-700 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueAccounts.length > 0 ? revenueAccounts.map((acc, i) => (
                    <tr key={i} className="border-b border-green-100 hover:bg-green-100/50">
                      <td className="py-3 px-6 text-sm text-gray-800">
                        <span className="text-gray-400 font-mono mr-2">{acc.code || acc.account_code || ''}</span>
                        {acc.name || acc.account_name}
                      </td>
                      <td className="py-3 px-6 text-sm text-right font-mono text-green-700 font-semibold">
                        {formatCurrency(acc.balance || acc.total || acc.amount || 0)}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="2" className="py-4 px-6 text-sm text-gray-400 text-center italic">No revenue entries</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-green-100">
                    <td className="py-3 px-6 text-sm font-bold text-green-800">Total Revenue</td>
                    <td className="py-3 px-6 text-right font-mono font-bold text-green-800 text-lg">
                      {formatCurrency(revenue.total || revenueAccounts.reduce((s, a) => s + (parseFloat(a.balance || a.total || a.amount) || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Expenses Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <ArrowDownward className="text-red-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Expenses</h4>
            </div>
            <div className="bg-red-50/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="text-left py-3 px-6 text-xs font-bold text-red-700 uppercase">Account</th>
                    <th className="text-right py-3 px-6 text-xs font-bold text-red-700 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseAccounts.length > 0 ? expenseAccounts.map((acc, i) => (
                    <tr key={i} className="border-b border-red-100 hover:bg-red-100/50">
                      <td className="py-3 px-6 text-sm text-gray-800">
                        <span className="text-gray-400 font-mono mr-2">{acc.code || acc.account_code || ''}</span>
                        {acc.name || acc.account_name}
                      </td>
                      <td className="py-3 px-6 text-sm text-right font-mono text-red-700 font-semibold">
                        {formatCurrency(acc.balance || acc.total || acc.amount || 0)}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="2" className="py-4 px-6 text-sm text-gray-400 text-center italic">No expense entries</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-red-100">
                    <td className="py-3 px-6 text-sm font-bold text-red-800">Total Expenses</td>
                    <td className="py-3 px-6 text-right font-mono font-bold text-red-800 text-lg">
                      {formatCurrency(expenses.total || expenseAccounts.reduce((s, a) => s + (parseFloat(a.balance || a.total || a.amount) || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Net Income */}
          <div className={`rounded-xl p-6 ${
            parseFloat(netIncome) >= 0 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
              : 'bg-gradient-to-r from-red-600 to-rose-600'
          }`}>
            <div className="flex justify-between items-center text-white">
              <div>
                <p className="text-sm uppercase tracking-wider opacity-80">Net {parseFloat(netIncome) >= 0 ? 'Income' : 'Loss'}</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(netIncome)}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                {parseFloat(netIncome) >= 0 
                  ? <TrendingUp className="text-white" style={{ fontSize: 32 }} />
                  : <ArrowDownward className="text-white" style={{ fontSize: 32 }} />}
              </div>
            </div>
          </div>

          {/* Summary Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-xs text-green-600 uppercase font-semibold">Revenue</p>
              <p className="text-xl font-bold text-green-700 mt-1">
                {formatCurrency(revenue.total || revenueAccounts.reduce((s, a) => s + (parseFloat(a.balance || a.total || a.amount) || 0), 0))}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-xs text-red-600 uppercase font-semibold">Expenses</p>
              <p className="text-xl font-bold text-red-700 mt-1">
                {formatCurrency(expenses.total || expenseAccounts.reduce((s, a) => s + (parseFloat(a.balance || a.total || a.amount) || 0), 0))}
              </p>
            </div>
            <div className={`border rounded-xl p-4 text-center ${
              parseFloat(netIncome) >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <p className={`text-xs uppercase font-semibold ${
                parseFloat(netIncome) >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>Net {parseFloat(netIncome) >= 0 ? 'Income' : 'Loss'}</p>
              <p className={`text-xl font-bold mt-1 ${
                parseFloat(netIncome) >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>{formatCurrency(netIncome)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Balance Sheet Report Renderer
  const renderBalanceSheetReport = (data) => {
    const companyName = JSON.parse(localStorage.getItem('companyInfo') || '{}')?.name || 'Company';
    const assets = data.assets || { accounts: [], total: 0 };
    const liabilities = data.liabilities || { accounts: [], total: 0 };
    const equity = data.equity || { accounts: [], total: 0 };
    const assetAccounts = assets.accounts || assets.items || (Array.isArray(assets) ? assets : []);
    const liabilityAccounts = liabilities.accounts || liabilities.items || (Array.isArray(liabilities) ? liabilities : []);
    const equityAccounts = equity.accounts || equity.items || (Array.isArray(equity) ? equity : []);
    const totalAssets = parseFloat(assets.total || 0) || assetAccounts.reduce((s, a) => s + (parseFloat(a.balance || a.total || a.amount) || 0), 0);
    const totalLiabilities = parseFloat(liabilities.total || 0) || liabilityAccounts.reduce((s, a) => s + (parseFloat(a.balance || a.total || a.amount) || 0), 0);
    const totalEquity = parseFloat(equity.total || 0) || equityAccounts.reduce((s, a) => s + (parseFloat(a.balance || a.total || a.amount) || 0), 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
    const isBalancedSheet = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

    const renderSection = (title, accountsList, total, colorScheme) => {
      const colors = {
        blue: { bg: 'bg-blue-50/50', border: 'border-blue-200', head: 'text-blue-700', foot: 'bg-blue-100 text-blue-800', icon: 'bg-blue-100 text-blue-600' },
        red: { bg: 'bg-red-50/50', border: 'border-red-200', head: 'text-red-700', foot: 'bg-red-100 text-red-800', icon: 'bg-red-100 text-red-600' },
        purple: { bg: 'bg-purple-50/50', border: 'border-purple-200', head: 'text-purple-700', foot: 'bg-purple-100 text-purple-800', icon: 'bg-purple-100 text-purple-600' }
      };
      const c = colors[colorScheme];
      return (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center`}>
              <AccountBalanceWallet />
            </div>
            <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          </div>
          <div className={`${c.bg} rounded-xl overflow-hidden`}>
            <table className="w-full">
              <thead>
                <tr className={`border-b ${c.border}`}>
                  <th className={`text-left py-3 px-6 text-xs font-bold ${c.head} uppercase`}>Account</th>
                  <th className={`text-right py-3 px-6 text-xs font-bold ${c.head} uppercase`}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accountsList.length > 0 ? accountsList.map((acc, i) => (
                  <tr key={i} className={`border-b ${c.border.replace('border-', 'border-')}/50 hover:bg-white/50`}>
                    <td className="py-3 px-6 text-sm text-gray-800">
                      <span className="text-gray-400 font-mono mr-2">{acc.code || acc.account_code || ''}</span>
                      {acc.name || acc.account_name}
                    </td>
                    <td className="py-3 px-6 text-sm text-right font-mono font-semibold text-gray-800">
                      {formatCurrency(acc.balance || acc.total || acc.amount || 0)}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="2" className="py-4 px-6 text-sm text-gray-400 text-center italic">No entries</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className={c.foot}>
                  <td className="py-3 px-6 text-sm font-bold">Total {title}</td>
                  <td className="py-3 px-6 text-right font-mono font-bold text-lg">{formatCurrency(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white print:bg-purple-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{companyName}</h2>
              <h3 className="text-xl mt-1 opacity-90">Balance Sheet</h3>
              <p className="mt-2 opacity-75 flex items-center gap-2">
                <CalendarToday fontSize="small" />
                As of {formatDate(reportDates.as_of_date)}
              </p>
            </div>
            <button onClick={handlePrintReport} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors print:hidden">
              <Print />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Assets */}
          {renderSection('Assets', assetAccounts, totalAssets, 'blue')}

          {/* Divider */}
          <div className="border-t-2 border-dashed border-gray-300"></div>

          {/* Liabilities */}
          {renderSection('Liabilities', liabilityAccounts, totalLiabilities, 'red')}

          {/* Equity */}
          {renderSection('Equity', equityAccounts, totalEquity, 'purple')}

          {/* Accounting Equation */}
          <div className="bg-gray-900 rounded-xl p-6 text-white">
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Accounting Equation</h4>
            <div className="grid grid-cols-5 items-center gap-2">
              <div className="text-center">
                <p className="text-xs text-blue-400 uppercase font-semibold">Assets</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalAssets)}</p>
              </div>
              <div className="text-center text-3xl font-light text-gray-500">=</div>
              <div className="text-center">
                <p className="text-xs text-red-400 uppercase font-semibold">Liabilities</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalLiabilities)}</p>
              </div>
              <div className="text-center text-3xl font-light text-gray-500">+</div>
              <div className="text-center">
                <p className="text-xs text-purple-400 uppercase font-semibold">Equity</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalEquity)}</p>
              </div>
            </div>
          </div>

          {/* Balance Status */}
          <div className={`flex items-center justify-center gap-2 py-4 rounded-xl ${
            isBalancedSheet ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {isBalancedSheet ? (
              <><span className="text-xl">✓</span><span className="font-semibold">Balance Sheet is in Balance — Assets equal Liabilities + Equity</span></>
            ) : (
              <><Warning fontSize="small" /><span className="font-semibold">Balance Sheet is OUT of Balance — Difference: {formatCurrency(Math.abs(totalAssets - totalLiabilitiesAndEquity))}</span></>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Generic fallback renderer for unknown data shapes
  const renderGenericReport = (data) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Report Data</h3>
          <button onClick={handlePrintReport} className="text-gray-500 hover:text-gray-700 print:hidden">
            <Print />
          </button>
        </div>
        <div className="overflow-x-auto bg-gray-50 rounded-xl p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  // Add line to journal entry
  const addJournalLine = () => {
    setNewJournal({
      ...newJournal,
      lines: [...newJournal.lines, { account_id: '', debit: 0, credit: 0 }]
    });
  };

  // Remove line from journal entry
  const removeJournalLine = (index) => {
    if (newJournal.lines.length > 2) {
      const updatedLines = newJournal.lines.filter((_, i) => i !== index);
      setNewJournal({ ...newJournal, lines: updatedLines });
    }
  };

  // Update journal line
  const updateJournalLine = (index, field, value) => {
    const updatedLines = [...newJournal.lines];
    // Convert empty strings to 0 for numeric fields
    if (field === 'debit' || field === 'credit') {
      updatedLines[index][field] = value === '' ? 0 : value;
    } else {
      updatedLines[index][field] = value;
    }
    setNewJournal({ ...newJournal, lines: updatedLines });
  };

  // Calculate totals for journal entry
  const calculateJournalTotals = () => {
    const totalDebits = newJournal.lines.reduce((sum, line) => {
      const debit = parseFloat(line.debit);
      return sum + (isNaN(debit) ? 0 : debit);
    }, 0);
    const totalCredits = newJournal.lines.reduce((sum, line) => {
      const credit = parseFloat(line.credit);
      return sum + (isNaN(credit) ? 0 : credit);
    }, 0);
    // Check if balanced: totals must match AND be greater than 0
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && totalDebits > 0;
    return { totalDebits, totalCredits, isBalanced };
  };

  useEffect(() => {
    switch(activeSubTab) {
      case 'accounts':
        fetchAccounts();
        break;
      case 'journals':
        fetchJournalEntries();
        if (accounts.length === 0) fetchAccounts();
        break;
      case 'invoices':
        fetchInvoices();
        break;
      case 'payments':
        fetchPayments();
        // Fetch invoices silently (no loading state interference) for the dropdown
        fetchInvoices(true);
        break;
      default:
        break;
    }
  }, [activeSubTab]);

  const { totalDebits, totalCredits, isBalanced } = calculateJournalTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Accounting</h2>
          <p className="text-gray-500 mt-2">Manage invoices, payments, and financial records</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Security className="text-green-500 mr-3" />
            <p className="text-green-700 font-medium">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">×</button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Warning className="text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">×</button>
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'accounts', label: 'Accounts', icon: <AccountBalanceWallet /> },
            { id: 'journals', label: 'Journals', icon: <Dns /> },
            { id: 'invoices', label: 'Invoices', icon: <Business /> },
            { id: 'payments', label: 'Payments', icon: <AccountBalanceWallet /> },
            { id: 'reports', label: 'Reports', icon: <Dashboard /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Tab */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-6">
          {/* Create Account Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Add className="text-blue-600" />
              Create New Account
            </h3>
            <form onSubmit={handleCreateAccount} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={newAccount.code}
                  onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cash"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chart of Accounts</h3>
              <p className="text-sm text-gray-500 mt-1">Showing {accounts.length} accounts</p>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{account.code}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{account.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            account.type === 'Asset' ? 'bg-blue-100 text-blue-800' :
                            account.type === 'Liability' ? 'bg-red-100 text-red-800' :
                            account.type === 'Equity' ? 'bg-purple-100 text-purple-800' :
                            account.type === 'Revenue' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {account.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">${account.balance || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Journals Tab - Similar structure to CompanyDashboard */}
      {activeSubTab === 'journals' && (
        <div className="space-y-6">
          {/* Create Journal Entry Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Add className="text-blue-600" />
              Create Journal Entry
            </h3>
            <form onSubmit={handleCreateJournal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newJournal.date}
                    onChange={(e) => setNewJournal({...newJournal, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                  <input
                    type="text"
                    value={newJournal.reference_number}
                    onChange={(e) => setNewJournal({...newJournal, reference_number: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="JE-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newJournal.description}
                    onChange={(e) => setNewJournal({...newJournal, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Transaction description"
                    required
                  />
                </div>
              </div>

              {/* Journal Lines */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Journal Lines</label>
                  <button
                    type="button"
                    onClick={addJournalLine}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Add fontSize="small" />
                    Add Line
                  </button>
                </div>
                
                {newJournal.lines.map((line, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <select
                        value={line.account_id}
                        onChange={(e) => updateJournalLine(index, 'account_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="">Select Account</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        value={line.debit}
                        onChange={(e) => updateJournalLine(index, 'debit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Debit"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        value={line.credit}
                        onChange={(e) => updateJournalLine(index, 'credit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Credit"
                      />
                    </div>
                    <div className="col-span-1">
                      {newJournal.lines.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeJournalLine(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Delete fontSize="small" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Balance Check */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Debits</p>
                    <p className="text-lg font-semibold text-gray-900">${totalDebits.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Credits</p>
                    <p className="text-lg font-semibold text-gray-900">${totalCredits.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className={`text-lg font-semibold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                      {isBalanced ? '✓ Balanced' : '✗ Unbalanced'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isBalanced}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isBalanced
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Journal Entry
              </button>
            </form>
          </div>

          {/* Journal Entries List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Journal Entries</h3>
              <p className="text-sm text-gray-500 mt-1">Showing {journalEntries.length} entries</p>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {journalEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{entry.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.reference_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{entry.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">${entry.total || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoices Tab - Continued from CompanyDashboard structure*/}
      {activeSubTab === 'invoices' && (
        <div className="space-y-6">
          {/* Create Invoice Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Add className="text-blue-600" />
              Create New Invoice
            </h3>
            <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={newInvoice.client_name}
                  onChange={(e) => setNewInvoice({...newInvoice, client_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC Company"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newInvoice.total}
                  onChange={(e) => setNewInvoice({...newInvoice, total: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="5000.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice({...newInvoice, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Invoice
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: When status is "sent", a journal entry is automatically created
            </p>
          </div>

          {/* Invoices List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
              <p className="text-sm text-gray-500 mt-1">Showing {invoices.length} invoices</p>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{invoice.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.client_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">${invoice.total}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            onChange={(e) => handleUpdateInvoiceStatus(invoice.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            defaultValue=""
                          >
                            <option value="" disabled>Change Status</option>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeSubTab === 'payments' && (
        <div className="space-y-6">
          {/* Create Payment Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Add className="text-blue-600" />
              Record New Payment
            </h3>
            <form onSubmit={handleCreatePayment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice</label>
                <select
                  value={newPayment.invoice_id}
                  onChange={(e) => setNewPayment({...newPayment, invoice_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Invoice ({invoices.length} available)</option>
                  {invoices.map(inv => {
                    console.log('Invoice for dropdown:', inv);
                    return (
                      <option key={inv.id} value={inv.id}>
                        Invoice #{inv.id} - {inv.client_name} (${inv.total || '0.00'}) - {inv.status || 'no status'}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-gray-500 mt-1">Showing all invoices (filtered options will be added later)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="500.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={newPayment.payment_date}
                  onChange={(e) => setNewPayment({...newPayment, payment_date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={newPayment.payment_method}
                  onChange={(e) => setNewPayment({...newPayment, payment_method: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input
                  type="text"
                  value={newPayment.reference_number}
                  onChange={(e) => setNewPayment({...newPayment, reference_number: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="PYMT-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional notes"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Record Payment
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Journal entry is automatically created
                </p>
              </div>
            </form>
          </div>

          {/* Payments List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-500 mt-1">Showing {payments.length} payments</p>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{payment.payment_date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Invoice #{payment.invoice_id}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-semibold">${payment.amount}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {payment.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.reference_number || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          {/* Report Parameters Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Assessment className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Financial Reports</h3>
                  <p className="text-sm text-gray-400">Generate professional accounting reports</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <CalendarToday fontSize="small" className="text-gray-400" /> Start Date
                  </label>
                  <input
                    type="date"
                    value={reportDates.start_date}
                    onChange={(e) => setReportDates({...reportDates, start_date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <CalendarToday fontSize="small" className="text-gray-400" /> End Date
                  </label>
                  <input
                    type="date"
                    value={reportDates.end_date}
                    onChange={(e) => setReportDates({...reportDates, end_date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <CalendarToday fontSize="small" className="text-gray-400" /> As Of Date
                  </label>
                  <input
                    type="date"
                    value={reportDates.as_of_date}
                    onChange={(e) => setReportDates({...reportDates, as_of_date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                  <p className="text-xs text-gray-400 mt-1">Used for Balance Sheet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trial Balance Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart style={{ fontSize: 28 }} />
                </div>
                <h4 className="font-bold text-lg">Trial Balance</h4>
                <p className="text-sm opacity-80 mt-1">All accounts with debit & credit totals</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="grouped-tb"
                    checked={groupedTrialBalance}
                    onChange={(e) => setGroupedTrialBalance(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="grouped-tb" className="text-sm text-gray-600">Group by account type</label>
                </div>
                <button
                  onClick={() => generateReport('trial-balance')}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                  {loading && reportType === 'trial-balance' ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Generating...</>
                  ) : (
                    <><Assessment fontSize="small" /> Generate Report</>
                  )}
                </button>
              </div>
            </div>

            {/* Income Statement Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-6 text-white">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp style={{ fontSize: 28 }} />
                </div>
                <h4 className="font-bold text-lg">Income Statement</h4>
                <p className="text-sm opacity-80 mt-1">Revenue − Expenses = Net Income</p>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-500 mb-4 bg-green-50 p-2 rounded-lg">Profit & Loss for the selected period</p>
                <button
                  onClick={() => generateReport('income-statement')}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                  {loading && reportType === 'income-statement' ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Generating...</>
                  ) : (
                    <><Assessment fontSize="small" /> Generate Report</>
                  )}
                </button>
              </div>
            </div>

            {/* Balance Sheet Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-700 p-6 text-white">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PieChart style={{ fontSize: 28 }} />
                </div>
                <h4 className="font-bold text-lg">Balance Sheet</h4>
                <p className="text-sm opacity-80 mt-1">Assets = Liabilities + Equity</p>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-500 mb-4 bg-purple-50 p-2 rounded-lg">Snapshot as of the selected date</p>
                <button
                  onClick={() => generateReport('balance-sheet')}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                  {loading && reportType === 'balance-sheet' ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Generating...</>
                  ) : (
                    <><Assessment fontSize="small" /> Generate Report</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Professional Report Display */}
          {reportData && (
            <div className="space-y-4">
              {/* Close / Back button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Receipt className="text-gray-400" />
                  Generated Report
                </h3>
                <button
                  onClick={() => setReportData(null)}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium print:hidden"
                >
                  <Cancel fontSize="small" />
                  Close Report
                </button>
              </div>

              {/* Render the appropriate report */}
              {reportType === 'trial-balance' && renderTrialBalanceReport(reportData)}
              {reportType === 'income-statement' && renderIncomeStatementReport(reportData)}
              {reportType === 'balance-sheet' && renderBalanceSheetReport(reportData)}
              {!['trial-balance', 'income-statement', 'balance-sheet'].includes(reportType) && renderGenericReport(reportData)}

              {/* Report Footer */}
              <div className="bg-gray-50 rounded-xl p-4 text-center text-xs text-gray-400 print:mt-8">
                <p>Report generated on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date().toLocaleTimeString('en-US')}</p>
                <p className="mt-1">This is a computer-generated report and does not require a signature.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main User Dashboard Component
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('accounting');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'accounting' && <UserAccountingModule />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;

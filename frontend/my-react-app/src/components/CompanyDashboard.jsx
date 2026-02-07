import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../services/api';
import {
  Dashboard,
  Group,
  Dns,
  AccountBalanceWallet,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Visibility,
  MoreVert,
  Search,
  FilterList,
  Refresh,
  Download,
  Settings,
  Person,
  Email,
  Business,
  DateRange,
  Security,
  TrendingUp,
  Warning,
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

// Enhanced Sidebar Component for Company Dashboard
const CompanySidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'users', label: 'Users', icon: <Group /> },
    { id: 'modules', label: 'Modules', icon: <Dns /> },
    { id: 'accounting', label: 'Accounting', icon: <AccountBalanceWallet /> },
  ];

  return (
    <div className="w-64 bg-gray-900 flex flex-col h-screen shadow-xl fixed">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">C</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Company Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-xs text-gray-300">Admin User</p>
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
            <h4 className="text-sm font-semibold text-white">{localStorage.getItem('userName') || 'Admin'}</h4>
            <p className="text-xs text-gray-400">{localStorage.getItem('userRole') || 'admin'}</p>
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

// Enhanced Dashboard Component for Company Admins
const CompanyDashboard = ({ company, modules, users }) => {
  // Calculate metrics
  const totalUsers = users.length;
  const totalModules = modules.length;
  const activeModules = modules.filter(m => m.pivot?.status === 'active').length;
  console.log('Dashboard metrics - modules:', modules, 'activeModules:', activeModules, 'totalModules:', totalModules);
  const totalInvoices = 125; // Real data would come from API
  const totalRevenue = '$24,500'; // Real data would come from API

  // Chart Data
  const growthData = [
    { month: 'Jan', users: 5 },
    { month: 'Feb', users: 8 },
    { month: 'Mar', users: 12 },
    { month: 'Apr', users: 18 },
    { month: 'May', users: 22 },
    { month: 'Jun', users: 28 },
  ];

  const moduleDistribution = modules.map(module => ({
    name: module.name,
    value: module.pivot?.status === 'active' ? 1 : 0,
    color: module.pivot?.status === 'active' ? '#10B981' : '#EF4444'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Company Overview</h2>
          <p className="text-gray-500 mt-2">Welcome back, {localStorage.getItem('userName') || 'Admin'}!</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <DateRange className="text-gray-500" />
            Last 30 days
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-md">
            <Download />
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp fontSize="small" />
                +24% growth
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shadow-inner">
              <Group className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Modules</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{activeModules}/{totalModules}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(activeModules/totalModules)*100 || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shadow-inner">
              <Security className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Invoices</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalInvoices}</h3>
              <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                <TrendingUp fontSize="small" />
                +15% from last month
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shadow-inner">
              <Business className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalRevenue}</h3>
              <p className="text-xs text-gray-600 mt-1">Current month</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center shadow-inner">
              <AccountBalanceWallet className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Company Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company?.name || 'Company Name'}</h3>
            <p className="text-sm text-gray-500">{company?.email || 'company@example.com'}</p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <Business className="text-blue-600 text-2xl" />
          </div>
        </div>
        <div className="flex gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Created:</span> {company?.created_at ? new Date(company.created_at).toLocaleDateString() : 'N/A'}
          </div>
          <div>
            <span className="font-medium">Subdomain:</span> {company?.subdomain || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Status:</span> 
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 ml-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Recent Users - Enhanced */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
            <Visibility fontSize="small" />
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Email fontSize="small" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-gray-900 text-white'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Today
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Visibility fontSize="small" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Edit fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Enhanced Users Management Component for Company Admins
const CompanyUsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Fetch users for the current company
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/core/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('Forbidden: Insufficient permissions to access users data.');
        } else {
          setError(`Failed to fetch users: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred while fetching users.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for creating a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      // Get current company ID from localStorage
      let companyInfoStr = localStorage.getItem('companyInfo');
      if (!companyInfoStr) {
        // If company info is not in localStorage, fetch it from the API
        const response = await axios.get(`${API_BASE_URL}/api/my-company`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const companyData = response.data;
        localStorage.setItem('companyInfo', JSON.stringify(companyData));
        companyInfoStr = JSON.stringify(companyData);
      }
      
      const companyInfo = JSON.parse(companyInfoStr);
      // Try to get company ID from various possible locations in the response
      const company_id = companyInfo.id || companyInfo.company_id || companyInfo.company?.id;
      
      if (!company_id) {
        console.error('Company info structure:', companyInfo);
        setError('Company ID not found. Please ensure you are logged in with a company account.');
        return;
      }

      await axios.post(`${API_BASE_URL}/core/users`, {
        ...newUser,
        company_id,
        password_confirmation: newUser.password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      setSuccess('User created successfully!');
      setTimeout(() => setSuccess(''), 5000);

      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user'
      });

      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('Forbidden: Insufficient permissions to create user.');
        } else {
          setError(`Failed to create user: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred while creating user.');
      }
    }
  };

  // Handle form submission for updating a user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      };
      
      if (editingUser.password) {
        updateData.password = editingUser.password;
        updateData.password_confirmation = editingUser.password;
      }

      await axios.put(`${API_BASE_URL}/core/users/${editingUser.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(''), 5000);

      // Close edit form
      setEditingUser(null);

      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('Forbidden: Insufficient permissions to update user.');
        } else {
          setError(`Failed to update user: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred while updating user.');
      }
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      await axios.delete(`${API_BASE_URL}/core/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 5000);

      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('Forbidden: Insufficient permissions to delete user.');
        } else {
          setError(`Failed to delete user: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred while deleting user.');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-500 mt-2">Manage company users and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <Refresh />
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Security className="text-green-500 mr-3" />
            <p className="text-green-700 font-medium">{success}</p>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Warning className="text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Create User Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Add className="text-blue-600" />
            Add New User
          </h3>
          <span className="text-xs text-gray-500">All fields are required</span>
        </div>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Name', value: newUser.name, key: 'name', type: 'text', cols: 2 },
            { label: 'Email', value: newUser.email, key: 'email', type: 'email', cols: 2 },
            { label: 'Role', value: newUser.role, key: 'role', type: 'select', options: ['user', 'admin'], cols: 1 },
            { label: 'Password', value: newUser.password, key: 'password', type: 'password', cols: 2 },
          ].map((field) => (
            <div key={field.key} className={`lg:col-span-${field.cols}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={field.value}
                  onChange={(e) => setNewUser({...newUser, [field.key]: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => setNewUser({...newUser, [field.key]: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required
                />
              )}
            </div>
          ))}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Add className="mr-2" />
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Edit className="text-blue-600" />
                Edit User
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Cancel />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave empty to keep current)</label>
                <input
                  type="password"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password or leave empty"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Cancel />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-gray-900 text-white'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Today
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Complete Accounting Module Component with all features
const CompanyAccountingModule = () => {
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

  // Check if accounting module is active
  const isAccountingModuleActive = () => {
    const companyInfoStr = localStorage.getItem('companyInfo');
    if (!companyInfoStr) {
      console.log('No companyInfo in localStorage');
      return false;
    }
    
    const companyInfo = JSON.parse(companyInfoStr);
    console.log('Checking accounting module. CompanyInfo:', companyInfo);
    
    // Check multiple possible structures and both 'key' and 'name' fields
    if (companyInfo.modules) {
      const hasModule = companyInfo.modules.some(m => 
        (m.key === 'accounting' || m.name === 'accounting') && m.pivot?.status === 'active'
      );
      console.log('Checked companyInfo.modules:', hasModule);
      return hasModule;
    }
    
    if (companyInfo.company?.modules) {
      const hasModule = companyInfo.company.modules.some(m => 
        (m.key === 'accounting' || m.name === 'accounting') && m.pivot?.status === 'active'
      );
      console.log('Checked companyInfo.company.modules:', hasModule);
      return hasModule;
    }
    
    console.log('No modules found in companyInfo');
    return false;
  };

  // Fetch Accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/accounting/accounts`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
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
      setError(err.response?.data?.message || 'Failed to create account');
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
      setError(err.response?.data?.message || 'Failed to create journal entry');
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
      setError(err.response?.data?.message || 'Failed to create invoice');
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
      setError(err.response?.data?.message || 'Failed to create payment');
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

  const renderTrialBalanceReport = (data) => {
    const entries = data.trial_balance || data.entries || data.accounts || (Array.isArray(data) ? data : []);
    const totals = data.totals || {};
    const companyName = JSON.parse(localStorage.getItem('companyInfo') || '{}')?.name || 'Company';

    if (data.grouped_accounts || data.groups) {
      const groups = data.grouped_accounts || data.groups || {};
      return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none">
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
                  <h4 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3 uppercase tracking-wide">{groupName}</h4>
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
                        <tr key={acc.id || i} className="border-b border-gray-100 hover:bg-gray-50">
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

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none">
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
                <tr key={entry.id || i} className="hover:bg-blue-50/50 transition-colors">
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

  const renderIncomeStatementReport = (data) => {
    const companyName = JSON.parse(localStorage.getItem('companyInfo') || '{}')?.name || 'Company';
    const revenue = data.revenue || data.revenues || { accounts: [], total: 0 };
    const expenses = data.expenses || { accounts: [], total: 0 };
    const netIncome = data.net_income ?? (parseFloat(revenue.total || 0) - parseFloat(expenses.total || 0));
    const revenueAccounts = revenue.accounts || revenue.items || (Array.isArray(revenue) ? revenue : []);
    const expenseAccounts = expenses.accounts || expenses.items || (Array.isArray(expenses) ? expenses : []);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none">
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
          {/* Revenue */}
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
                    <tr key={acc.id || i} className="border-b border-green-100 hover:bg-green-100/50">
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
          {/* Expenses */}
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
                    <tr key={acc.id || i} className="border-b border-red-100 hover:bg-red-100/50">
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
          {/* Summary */}
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
                  <tr key={acc.id || i} className={`border-b ${c.border}/50 hover:bg-white/50`}>
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
          {renderSection('Assets', assetAccounts, totalAssets, 'blue')}
          <div className="border-t-2 border-dashed border-gray-300"></div>
          {renderSection('Liabilities', liabilityAccounts, totalLiabilities, 'red')}
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
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && totalDebits > 0;
    return { totalDebits, totalCredits, isBalanced };
  };

  useEffect(() => {
    if (!isAccountingModuleActive()) {
      setError('Accounting module is not active for your company.');
      return;
    }

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
        fetchInvoices(true);
        break;
      default:
        break;
    }
  }, [activeSubTab]);

  if (!isAccountingModuleActive()) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accounting Module</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <Warning className="text-yellow-600 mb-2" />
          <p className="text-yellow-800 font-medium">The accounting module is not active for your company.</p>
          <p className="text-yellow-700 mt-2">Please go to the Modules section to activate it.</p>
        </div>
      </div>
    );
  }

  const { totalDebits, totalCredits, isBalanced } = calculateJournalTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Accounting Module</h2>
          <p className="text-gray-500 mt-2">Manage your company's financial records</p>
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

      {/* Journals Tab */}
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

      {/* Invoices Tab */}
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
              💡 Tip: When status is "sent", a journal entry is automatically created (Debit: Accounts Receivable, Credit: Revenue)
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
                      <tr key={invoice.id} className="hover:bg- gray-50">
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
                  💡 Tip: Journal entry is automatically created (Debit: Cash/Bank, Credit: Accounts Receivable)
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
          {/* Report Parameters Header */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
              <div className="flex items-center gap-3">
                <Assessment fontSize="large" />
                <div>
                  <h3 className="text-xl font-bold">Financial Reports</h3>
                  <p className="text-sm text-gray-300 mt-1">Generate professional financial statements</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <CalendarToday fontSize="small" className="text-gray-400" /> Start Date
                  </label>
                  <input
                    type="date"
                    value={reportDates.start_date}
                    onChange={(e) => setReportDates({...reportDates, start_date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <CalendarToday fontSize="small" className="text-gray-400" /> As Of Date (Balance Sheet)
                  </label>
                  <input
                    type="date"
                    value={reportDates.as_of_date}
                    onChange={(e) => setReportDates({...reportDates, as_of_date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Report Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trial Balance Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Trial Balance</h4>
              <p className="text-sm text-gray-600 mb-4">Summary of all account balances with debit and credit totals</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="groupedTB-company"
                  checked={groupedTrialBalance}
                  onChange={(e) => setGroupedTrialBalance(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="groupedTB-company" className="text-sm text-gray-600">Group by account type</label>
              </div>
              <button
                onClick={() => generateReport('trial-balance')}
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md disabled:from-gray-300 disabled:to-gray-400"
              >
                {loading && reportType === 'trial-balance' ? (
                  <span className="flex items-center justify-center gap-2"><span className="animate-spin">⏳</span> Generating...</span>
                ) : 'Generate Report'}
              </button>
            </div>

            {/* Income Statement Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PieChart className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Income Statement</h4>
              <p className="text-sm text-gray-600 mb-4">Revenue minus expenses to determine net income or loss</p>
              <button
                onClick={() => generateReport('income-statement')}
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all font-semibold shadow-md disabled:from-gray-300 disabled:to-gray-400 mt-[52px]"
              >
                {loading && reportType === 'income-statement' ? (
                  <span className="flex items-center justify-center gap-2"><span className="animate-spin">⏳</span> Generating...</span>
                ) : 'Generate Report'}
              </button>
            </div>

            {/* Balance Sheet Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 border-2 border-purple-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AttachMoney className="text-white" style={{ fontSize: 32 }} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Balance Sheet</h4>
              <p className="text-sm text-gray-600 mb-4">Assets equal Liabilities plus Equity at a point in time</p>
              <button
                onClick={() => generateReport('balance-sheet')}
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all font-semibold shadow-md disabled:from-gray-300 disabled:to-gray-400 mt-[52px]"
              >
                {loading && reportType === 'balance-sheet' ? (
                  <span className="flex items-center justify-center gap-2"><span className="animate-spin">⏳</span> Generating...</span>
                ) : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Professional Report Display */}
          {reportData && (
            <div className="space-y-4">
              <div className="flex justify-end print:hidden">
                <button
                  onClick={() => setReportData(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Cancel fontSize="small" /> Close Report
                </button>
              </div>
              {reportType === 'trial-balance' && renderTrialBalanceReport(reportData)}
              {reportType === 'income-statement' && renderIncomeStatementReport(reportData)}
              {reportType === 'balance-sheet' && renderBalanceSheetReport(reportData)}
              {!['trial-balance', 'income-statement', 'balance-sheet'].includes(reportType) && renderGenericReport(reportData)}
              <div className="text-center text-xs text-gray-400 mt-4 print:mt-8">
                <p>Generated on {new Date().toLocaleString()} | Confidential — For internal use only</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Modules Management Component for Company Admins
const CompanyModulesManagement = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch available modules for the company
  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/my-modules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Fetched modules response:', response.data);
      
      // API returns { active_modules: [], inactive_modules: [] }
      let modulesData = [];
      if (response.data.active_modules || response.data.inactive_modules) {
        modulesData = [
          ...(response.data.active_modules || []),
          ...(response.data.inactive_modules || [])
        ];
      } else if (Array.isArray(response.data)) {
        modulesData = response.data;
      }
      
      console.log('Setting modules:', modulesData);
      setModules(modulesData);
      
      // Update companyInfo in localStorage with modules
      const companyInfoStr = localStorage.getItem('companyInfo');
      if (companyInfoStr) {
        const companyInfo = JSON.parse(companyInfoStr);
        companyInfo.modules = modulesData;
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
        console.log('Updated companyInfo with modules:', companyInfo);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('Forbidden: Insufficient permissions to access modules data.');
        } else {
          setError(`Failed to fetch modules: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred while fetching modules.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle module status
  const toggleModule = async (moduleId, moduleName, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      // Get current company ID from localStorage
      let companyInfoStr = localStorage.getItem('companyInfo');
      if (!companyInfoStr) {
        // If company info is not in localStorage, fetch it from the API
        const response = await axios.get(`${API_BASE_URL}/api/my-company`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const companyData = response.data;
        localStorage.setItem('companyInfo', JSON.stringify(companyData));
        companyInfoStr = JSON.stringify(companyData);
      }
      
      const companyInfo = JSON.parse(companyInfoStr);
      // Try to get company ID from various possible locations in the response
      const company_id = companyInfo.id || companyInfo.company_id || companyInfo.company?.id;
      
      if (!company_id) {
        console.error('Company info structure:', companyInfo);
        setError('Company ID not found. Please ensure you are logged in with a company account.');
        return;
      }

      await axios.post(`${API_BASE_URL}/api/modules/toggle`, {
        company_id,
        module_key: moduleId,
        status: currentStatus === 'active' ? 'inactive' : 'active'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      setSuccess(`Module ${currentStatus === 'active' ? 'deactivated' : 'activated'} successfully!`);
      setTimeout(() => setSuccess(''), 5000);

      // Refresh modules list
      fetchModules();
    } catch (err) {
      console.error('Error toggling module:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('Forbidden: Insufficient permissions to toggle module.');
        } else {
          setError(`Failed to toggle module: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred while toggling module.');
      }
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Module Management</h2>
          <p className="text-gray-500 mt-2">Manage which modules are enabled for your company</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchModules}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Refresh />
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Security className="text-green-500 mr-3" />
            <p className="text-green-700 font-medium">{success}</p>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Warning className="text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Modules</h3>
        <p className="text-gray-600 mb-6">Enable or disable modules for your company</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(module => {
            const isActive = module.pivot?.status === 'active';
            return (
              <div key={module.id} className="border border-gray-200 rounded-xl p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{module.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{module.description || 'Module description'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => toggleModule(module.key, module.name, isActive ? 'active' : 'inactive')}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {isActive ? 'Deactivate Module' : 'Activate Module'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CompanyDashboardMain = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [company, setCompany] = useState({});
  const [modules, setModules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch company information
  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/my-company`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const companyData = response.data;
      setCompany(companyData);
      
      // Store in localStorage with consistent structure
      const companyInfo = {
        id: companyData.id,
        name: companyData.name,
        email: companyData.email,
        subdomain: companyData.subdomain,
        created_at: companyData.created_at,
        modules: [] // Will be populated when modules are fetched
      };
      
      localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
      console.log('Stored initial companyInfo (modules will be added later):', companyInfo);
    } catch (err) {
      console.error('Error fetching company:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('Forbidden: Insufficient permissions to access company data.');
        } else {
          setError(`Failed to fetch company: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred while fetching company.');
      }
    }
  };

  // Fetch company modules
  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/my-modules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // API returns { active_modules: [], inactive_modules: [] }
      let modulesData = [];
      if (response.data.active_modules || response.data.inactive_modules) {
        modulesData = [
          ...(response.data.active_modules || []),
          ...(response.data.inactive_modules || [])
        ];
      } else if (Array.isArray(response.data)) {
        modulesData = response.data;
      }
      
      setModules(modulesData);
      
      // Update company info in localStorage with the modules data
      const companyInfoStr = localStorage.getItem('companyInfo');
      if (companyInfoStr) {
        const companyInfo = JSON.parse(companyInfoStr);
        companyInfo.modules = modulesData;
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  };

  // Fetch company users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/core/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // First fetch company information to ensure it's available
      await fetchCompany();
      // Then fetch other data
      await Promise.all([
        fetchModules(),
        fetchUsers()
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Warning className="text-red-500 mr-3" />
                  <div>
                    <p className="text-red-700 font-medium">{error}</p>
                    <p className="text-red-600 text-sm mt-1">Please try again or contact support</p>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <CompanyDashboard company={company} modules={modules} users={users} />
            )}
            {activeTab === 'users' && <CompanyUsersManagement />}
            {activeTab === 'modules' && <CompanyModulesManagement />}
            {activeTab === 'accounting' && <CompanyAccountingModule />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboardMain;
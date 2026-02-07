import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Dashboard, 
  Apartment, 
  Group, 
  Logout, 
  CheckCircle, 
  Dns,
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
  Warning
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Enhanced Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'companies', label: 'Companies', icon: <Apartment /> },
    { id: 'users', label: 'Users', icon: <Group /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <div className="w-64 bg-gray-900 flex flex-col h-screen shadow-xl fixed">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">ERP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">ERP System</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-xs text-gray-300">Super Admin</p>
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
            <h4 className="text-sm font-semibold text-white">Super Admin</h4>
            <p className="text-xs text-gray-400">admin@erp.com</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-300 text-sm font-medium transition-colors group"
        >
          <Logout className="text-xl group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Enhanced Dashboard Component with Charts
const DashboardView = ({ companies, users, modules }) => {
  const totalCompanies = companies.length;
  const totalUsers = users.length;
  const totalModules = modules.length;
  const activeCompanies = companies.filter(c => c.modules?.some(m => m.key && m.pivot?.status === 'active')).length;
  const inactiveCompanies = totalCompanies - activeCompanies;

  // Chart Data
  const growthData = [
    { month: 'Jan', companies: 5, users: 20 },
    { month: 'Feb', companies: 8, users: 35 },
    { month: 'Mar', companies: 12, users: 50 },
    { month: 'Apr', companies: 18, users: 75 },
    { month: 'May', companies: 22, users: 95 },
    { month: 'Jun', companies: 28, users: 120 },
  ];

  const moduleDistribution = modules.map(module => ({
    name: module.name,
    value: companies.filter(c => 
      c.modules?.some(m => m.key === module.key && m.pivot?.status === 'active')
    ).length,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  }));

  const statusData = [
    { name: 'Active', value: activeCompanies, color: '#10B981' },
    { name: 'Inactive', value: inactiveCompanies, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Overview</h2>
          <p className="text-gray-500 mt-2">Real-time insights and analytics</p>
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
              <p className="text-sm font-medium text-gray-500">Total Companies</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalCompanies}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp fontSize="small" />
                +12% from last month
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shadow-inner">
              <Apartment className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Companies</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{activeCompanies}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(activeCompanies/totalCompanies)*100 || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shadow-inner">
              <CheckCircle className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</h3>
              <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
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
              <p className="text-sm font-medium text-gray-500">Total Modules</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalModules}</h3>
              <p className="text-xs text-gray-600 mt-1">Available for deployment</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shadow-inner">
              <Dns className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>



      {/* Recent Companies - Enhanced */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Companies</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
            <Visibility fontSize="small" />
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modules</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.slice(0, 5).map((company) => (
                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                        {company.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{company.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Email fontSize="small" />
                          {company.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Person className="text-gray-600 text-sm" />
                      </div>
                      <span className="text-sm text-gray-900">{company.admin_name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {company.modules?.slice(0, 3).map((module, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
                        >
                          {module.name}
                        </span>
                      ))}
                      {company.modules?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          +{company.modules.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {company.created_at ? new Date(company.created_at).toLocaleDateString() : 'N/A'}
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

// Enhanced Companies Management Component
const CompaniesManagement = ({ fetchCompanies, fetchModules, companies, modules, setNewCompany, newCompany, handleCreateCompany, toggleModule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [success, setSuccess] = useState('');

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && 
                          company.modules?.some(m => m.pivot?.status === 'active')) ||
                         (statusFilter === 'inactive' && 
                          (!company.modules || !company.modules.some(m => m.pivot?.status === 'active')));
    return matchesSearch && matchesStatus;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'name':
        return a.name?.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Companies Management</h2>
          <p className="text-gray-500 mt-2">Manage all registered companies and their modules</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchCompanies}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <Refresh />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-md">
            <Download />
            Export
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-3" />
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

      {/* Create New Company Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Add className="text-blue-600" />
            Create New Company
          </h3>
          <span className="text-xs text-gray-500">All fields are required</span>
        </div>
        <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Company Name', value: newCompany.company_name, key: 'company_name', type: 'text' },
            { label: 'Admin Name', value: newCompany.admin_name, key: 'admin_name', type: 'text' },
            { label: 'Admin Email', value: newCompany.admin_email, key: 'admin_email', type: 'email' },
            { label: 'Password', value: newCompany.admin_password, key: 'admin_password', type: 'password' },
          ].map((field) => (
            <div key={field.key} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => setNewCompany({...newCompany, [field.key]: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Add className="mr-2" />
              Create Company
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">A to Z</option>
            </select>
            <button className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2">
              <FilterList />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Companies</h3>
            <p className="text-sm text-gray-500 mt-1">
              Showing {sortedCompanies.length} of {companies.length} companies
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modules</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedCompanies.length > 0 ? (
                sortedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Business className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{company.name || company.company_name}</p>
                          <p className="text-sm text-gray-500">{company.email || company.admin_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {modules.map(module => {
                          const isActive = company.modules?.some(m => m.key === module.key && m.pivot?.status === 'active');
                          return (
                            <button
                              key={`${company.id}-${module.key}`}
                              onClick={() => toggleModule(company.id, module.key, isActive ? 'active' : 'inactive')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isActive 
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={isActive ? 'Click to deactivate' : 'Click to activate'}
                            >
                              {module.name}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Group className="text-gray-400" />
                        <span className="text-sm text-gray-900 font-medium">
                          {company.users_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          company.modules?.some(m => m.pivot?.status === 'active')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            company.modules?.some(m => m.pivot?.status === 'active')
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}></div>
                          {company.modules?.some(m => m.pivot?.status === 'active') ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">
                          {company.created_at ? new Date(company.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {company.created_at ? new Date(company.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Visibility fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Business className="text-gray-300 text-4xl mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h4>
                      <p className="text-gray-500 mb-4">Try adjusting your search or filter</p>
                      <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {sortedCompanies.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to 10 of {sortedCompanies.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Users Management Component
const UsersManagement = () => {
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
    role: 'user',
    company_id: ''
  });
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/core/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all companies for dropdown
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/companies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCompanies(Array.isArray(response.data.companies) ? response.data.companies : []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      setError(err.response?.data?.message || 'An error occurred');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/core/users`, {
        ...newUser,
        password_confirmation: newUser.password
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('User created successfully!');
      setTimeout(() => setSuccess(''), 5000);
      setNewUser({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        company_id: ''
      });
      fetchUsers();
    } catch (err) {
      handleError(err);
    }
  };

  // Update User
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(''), 5000);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      handleError(err);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/core/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 5000);
      fetchUsers();
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
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
          <p className="text-gray-500 mt-2">Manage system users and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers}
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
            <CheckCircle className="text-green-500 mr-3" />
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
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Add className="text-blue-600" />
          Add New User
        </h3>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Name', value: newUser.name, key: 'name', type: 'text', cols: 2 },
            { label: 'Email', value: newUser.email, key: 'email', type: 'email', cols: 2 },
            { label: 'Role', value: newUser.role, key: 'role', type: 'select', options: ['user', 'admin'], cols: 1 },
            { label: 'Company', value: newUser.company_id, key: 'company_id', type: 'select', options: companies, cols: 1 },
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
                  <option value="">Select {field.label}</option>
                  {field.options?.map(opt => 
                    typeof opt === 'object' ? (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ) : (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    )
                  )}
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 shadow-md"
            >
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Person />
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
                    <div className="flex items-center gap-2">
                      <Business className="text-gray-400" />
                      <span className="text-sm text-gray-900">{user.company?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Active
                    </span>
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

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companies, setCompanies] = useState([]);
  const [modules, setModules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
    admin_password_confirmation: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/companies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCompanies(Array.isArray(response.data.companies) ? response.data.companies : []);
    } catch (err) {
      handleError(err);
      setCompanies([]);
    }
  };

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/modules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setModules(Array.isArray(response.data.modules) ? response.data.modules : []);
    } catch (err) {
      handleError(err);
      setModules([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/core/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (err) {
      handleError(err);
      setUsers([]);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/companies`, {
        ...newCompany,
        admin_password_confirmation: newCompany.admin_password
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setError('');
      alert('Company created successfully!');
      setNewCompany({
        company_name: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirmation: ''
      });
      fetchCompanies();
    } catch (err) {
      handleError(err);
    }
  };

  const toggleModule = async (companyId, moduleKey, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/modules/toggle`, {
        company_id: companyId,
        module_key: moduleKey,
        status: currentStatus === 'active' ? 'inactive' : 'active'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCompanies();
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCompanies(), fetchModules(), fetchUsers()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
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
              <DashboardView companies={companies} users={users} modules={modules} />
            )}
            {activeTab === 'companies' && (
              <CompaniesManagement
                fetchCompanies={fetchCompanies}
                fetchModules={fetchModules}
                companies={companies}
                modules={modules}
                setNewCompany={setNewCompany}
                newCompany={newCompany}
                handleCreateCompany={handleCreateCompany}
                toggleModule={toggleModule}
              />
            )}
            {activeTab === 'users' && <UsersManagement />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
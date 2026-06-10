import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Users, ChevronRight, Eye, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { useTransactions } from '../context/TransactionContext';
import UserAvatar from './UserAvatar';

export default function AdminUsersTab() {
  const { users, refreshUsers } = useUsers();
  const { transactions, refreshTransactions, getUserBalance } = useTransactions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    refreshUsers();
    refreshTransactions();
  }, []);

  const userStats = useMemo(() => {
    return users
      .filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(user => {
      const balance = getUserBalance(user.id);
      
      return {
        ...user,
        available: balance.available,
        pending: balance.pending
      };
    });
  }, [users, transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Users Management</h2>
            <p className="text-gray-500 text-sm font-medium">View and manage registered platform users.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by ID or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-gray-900 transition-colors w-full md:w-80"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 rounded-tl-xl border-r border-gray-200">Avatar</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Full Name</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Email</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Balance</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Profile Survey</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {userStats.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-4">
                    <UserAvatar avatarId={user.avatarId} size="sm" fallbackName={user.fullName} className="rounded-full shadow-sm" />
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-gray-900">{user.fullName || (user.firstName + ' ' + user.lastName)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">{user.email}</span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5">{user.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-green-600">${user.available.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    {user.profileSurveyCompleted ? (
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold uppercase tracking-wider">Completed</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold uppercase tracking-wider">Not Completed</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {userStats.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

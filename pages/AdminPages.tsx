
import React, { useState, useEffect } from 'react';
import { useApp } from '../scr/context/AppContext';
import { User, Role, LevelConfig, SpecificOrderConfig, SystemConfig, ContentItem, Product, TransactionStatus, TransactionType } from '../types';
import { TRANSLATIONS } from '../constants';
import { Check, X, Search, Edit, Plus, Trash2, Save, Key, Copy, Globe, Calendar, User as UserIcon, Shield, CreditCard, MapPin, Power, RefreshCcw, Lock, Unlock, Filter, Ban, Clock, Wifi, ArrowDown, ArrowUp, Settings, Laptop, UserCheck, UserX, Image, Type, Smartphone, AlertCircle, Percent, DollarSign, Activity, MessageSquare, FileText, Palette, Layout, Link as LinkIcon, PlayCircle, PlusCircle, MinusCircle, PauseCircle, Layers, Images, Box, HelpCircle, MousePointer2 } from 'lucide-react';

// ... (Keep AdminDashboard, AdminProducts, AdminUsers, AdminTransactions, AdminOrderConfig, AdminInviteCodes components unchanged)
export const AdminDashboard: React.FC = () => {
  const { users, transactions, orders, levelConfigs, systemConfig, language, products } = useApp();
  const t = TRANSLATIONS[language];

  const totalUsers = users.filter(u => u.role === Role.USER).length;
  const pendingDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'PENDING').length;
  const pendingWithdraws = transactions.filter(t => t.type === 'WITHDRAW' && t.status === 'PENDING').length;
  const totalOrders = orders.length;

  const Card = ({ title, val, color }: any) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 ${color}`}>
      <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
      <p className="text-3xl font-bold mt-2 dark:text-white">{val}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold dark:text-white">{t.admin_dashboard}</h2>
         {systemConfig.maintenanceMode && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center animate-pulse">
               <Power size={18} className="mr-2" />
               <span className="font-bold">{t.maintenance_mode} Active</span>
            </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title={t.total_users} val={totalUsers} color="border-blue-500" />
        <Card title={t.pending_deposits} val={pendingDeposits} color="border-green-500" />
        <Card title={t.pending_withdraws} val={pendingWithdraws} color="border-red-500" />
        <Card title={t.orders} val={totalOrders} color="border-purple-500" />
        <Card title="Catalog Products" val={products.length} color="border-yellow-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold dark:text-white flex items-center">
                <Settings size={18} className="mr-2 text-gray-500" /> 
                System Configuration Defaults
            </h3>
            <span className="text-xs text-blue-500 cursor-pointer hover:underline" onClick={() => window.location.hash = '#/admin/settings'}>Edit</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-300 uppercase font-bold">Daily Limit</p>
                <p className="font-bold dark:text-white text-lg">{systemConfig.dailyOrderLimit} Orders</p>
             </div>
             <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-300 uppercase font-bold">Commission</p>
                <p className="font-bold dark:text-white text-lg">{(systemConfig.commissionRate * 100).toFixed(2)}%</p>
             </div>
             <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                <p className="text-xs text-purple-600 dark:text-purple-300 uppercase font-bold">Min Order Amount</p>
                <p className="font-bold dark:text-white text-lg">{(systemConfig.minBalancePercent * 100).toFixed(0)}% <span className="text-xs font-normal opacity-70">of Balance</span></p>
             </div>
             <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                <p className="text-xs text-purple-600 dark:text-purple-300 uppercase font-bold">Max Order Amount</p>
                <p className="font-bold dark:text-white text-lg">{(systemConfig.maxBalancePercent * 100).toFixed(0)}% <span className="text-xs font-normal opacity-70">of Balance</span></p>
             </div>
          </div>
      </div>
    </div>
  );
};

export const AdminProducts: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, generateMockProducts, formatPrice } = useApp();
    const [search, setSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleSave = async () => {
        if (!editingProduct || !editingProduct.name || !editingProduct.price) return;
        if (editingProduct.id) {
            await updateProduct(editingProduct as Product);
        } else {
            await addProduct(editingProduct as Omit<Product, 'id'>);
        }
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white flex items-center"><Box className="mr-2"/> Order Catalog</h2>
                <div className="flex space-x-2">
                    <button onClick={generateMockProducts} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-yellow-600">
                        + Generate 20 Mock Data
                    </button>
                    <button onClick={() => setEditingProduct({ name: '', imageUrl: '', price: 0 })} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700">
                        <Plus size={18} className="mr-2" /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 font-medium uppercase sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={3} className="p-4 text-center text-gray-500">No products found.</td></tr>
                            ) : (
                                filtered.map(prod => (
                                    <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <td className="px-4 py-3 flex items-center space-x-3">
                                            <img src={prod.imageUrl} className="w-10 h-10 rounded object-cover bg-gray-100" alt="" />
                                            <span className="font-bold dark:text-white">{prod.name}</span>
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            {formatPrice(prod.price)}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button onClick={() => setEditingProduct(prod)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                                            <button onClick={() => deleteProduct(prod.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{editingProduct.id ? 'Edit Product' : 'Add Product'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Product Name</label>
                                <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={editingProduct?.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                                <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={editingProduct?.imageUrl || ''} onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Price (USD)</label>
                                <input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={editingProduct?.price || 0} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-gray-500 hover:text-gray-700 font-bold">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminUsers: React.FC = () => {
  const { users, updateUser, toggleUserType, resetUserDailyOrders, language, levelConfigs, systemConfig, transactions } = useApp();
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState('');
  const [userTab, setUserTab] = useState<'ALL' | 'REAL' | 'FAKE'>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<'INFO' | 'BANK' | 'SECURITY' | 'CONFIG'>('INFO');
  
  // Helper to determine if user is online (within 5 minutes of last activity)
  const isUserOnline = (lastOnline?: number): boolean => {
    if (!lastOnline) return false;
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    return lastOnline > fiveMinutesAgo;
  };

  const addSpecificOrder = () => {
      if(!editingUser) return;
      const newOrder: SpecificOrderConfig = { orderIndex: 1, amount: 100000, commissionRate: 0.1, productName: '', productImage: '' };
      setEditingUser({...editingUser, customSpecificOrders: [...(editingUser.customSpecificOrders || []), newOrder]});
  };

  const filteredUsers = users.filter(u => {
    if (u.role !== Role.USER) return false;
    if (userTab === 'REAL' && u.isFake) return false;
    if (userTab === 'FAKE' && !u.isFake) return false;
    const term = search.toLowerCase();
    return (
        u.username.toLowerCase().includes(term) ||
        u.id.toLowerCase().includes(term) ||
        u.phoneNumber.includes(term) ||
        (u.ipAddress && u.ipAddress.includes(term))
    );
  });

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h2 className="text-2xl font-bold dark:text-white">{t.admin_users}</h2>
          <div className="flex space-x-2">
             <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                {(['ALL', 'REAL', 'FAKE'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setUserTab(tab)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${userTab === tab ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        {tab === 'ALL' ? t.all : tab === 'REAL' ? t.real_user : t.fake_user}
                    </button>
                ))}
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                type="text" 
                placeholder={t.search_placeholder} 
                className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
                />
             </div>
          </div>
       </div>

       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 font-medium uppercase">
               <tr>
                 <th className="px-4 py-3">{t.user_info}</th>
                 <th className="px-4 py-3">{t.balance}</th>
                 <th className="px-4 py-3">Progress</th>
                 <th className="px-4 py-3">{t.ip_address}</th>
                 <th className="px-4 py-3">{t.status}</th>
                 <th className="px-4 py-3 text-right">{t.action}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
               {filteredUsers.map(user => {
                 const configLimit = user.customDailyOrderLimit || levelConfigs.find(l => l.level === user.level)?.dailyOrderLimit || systemConfig.dailyOrderLimit;
                 const hasPendingTransactions = transactions.some(tx => tx.userId === user.id && tx.status === 'PENDING');
                 const isOnline = isUserOnline(user.lastOnline);

                 return (
                 <tr key={user.id} className={`hover:bg-gray-50 dark:hover:bg-gray-750 ${hasPendingTransactions ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500' : ''}`}>
                   <td className="px-4 py-3">
                     <div className="flex items-center">
                        <div className="relative mr-3 shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        </div>
                        <div>
                           <div className="flex items-center space-x-2">
                                <p className="font-bold dark:text-white">{user.username}</p>
                                {hasPendingTransactions && <AlertCircle size={14} className="text-yellow-500 animate-pulse" />}
                           </div>
                           <p className="text-xs text-gray-400">{user.phoneNumber}</p>
                           <div className="flex space-x-1 mt-1">
                               {user.isFake && <span className="text-[10px] bg-purple-100 text-purple-600 px-1 rounded border border-purple-200">FAKE</span>}
                               {user.isOrderFrozen && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded border border-red-200 flex items-center"><Ban size={10} className="mr-0.5"/> FROZEN</span>}
                           </div>
                        </div>
                     </div>
                   </td>
                   <td className="px-4 py-3 dark:text-gray-300">
                      {user.balance.toLocaleString()}
                   </td>
                   <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                          <span className="text-gray-600 dark:text-gray-400 font-mono">{user.ordersCompletedToday} / {configLimit}</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (user.ordersCompletedToday / configLimit) * 100)}%` }}></div>
                          </div>
                      </div>
                   </td>
                   <td className="px-4 py-3">
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-mono">{user.ipAddress || '-'}</div>
                      <div className="text-[10px] text-gray-500">{user.deviceInfo || 'Unknown'}</div>
                   </td>
                   <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.status}
                      </span>
                   </td>
                   <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => toggleUserType(user.id)} title={t.user_type} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded">
                         {user.isFake ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button onClick={() => updateUser(user.id, { isOrderFrozen: !user.isOrderFrozen })} title="Freeze Orders" className={`p-1.5 rounded ${user.isOrderFrozen ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                         <PauseCircle size={16} />
                      </button>
                      <button onClick={() => resetUserDailyOrders(user.id)} title={t.reset_orders} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded">
                         <RefreshCcw size={16} />
                      </button>
                      <button onClick={() => updateUser(user.id, { status: user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE' })} title={t.lock_account} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                         {user.status === 'ACTIVE' ? <Unlock size={16} /> : <Lock size={16} />}
                      </button>
                      <button onClick={() => { setEditingUser(user); setActiveEditTab('INFO'); }} title={t.edit_user} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                         <Edit size={16} />
                      </button>
                   </td>
                 </tr>
               );})}
             </tbody>
           </table>
         </div>
       </div>
       
       {editingUser && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
               <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700 mb-4">
                   <h3 className="font-bold text-lg dark:text-white">{t.edit_user}: {editingUser.username}</h3>
                   <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-gray-700"><X size={20}/></button>
               </div>

               <div className="flex space-x-2 border-b dark:border-gray-700 mb-4">
                   {['INFO', 'BANK', 'SECURITY', 'CONFIG'].map((tab) => (
                       <button key={tab} onClick={() => setActiveEditTab(tab as any)} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeEditTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                           {tab}
                       </button>
                   ))}
               </div>
               
               <div className="flex-1 overflow-y-auto">
                   {activeEditTab === 'INFO' && (
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="text-xs text-gray-500 font-bold">Balance</label>
                               <input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.balance} onChange={e => setEditingUser({...editingUser, balance: Number(e.target.value)})} />
                           </div>
                           <div>
                               <label className="text-xs text-gray-500 font-bold">Full Name</label>
                               <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.fullName} onChange={e => setEditingUser({...editingUser, fullName: e.target.value})} />
                           </div>
                           <div className="col-span-2">
                               <label className="text-xs text-gray-500 font-bold">Address</label>
                               <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.address || ''} onChange={e => setEditingUser({...editingUser, address: e.target.value})} />
                           </div>
                       </div>
                   )}
                   {activeEditTab === 'BANK' && (
                       <div className="space-y-4">
                           <div>
                               <label className="text-xs text-gray-500 font-bold">Bank Name</label>
                               <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.bankInfo?.bankName || ''} onChange={e => setEditingUser({...editingUser, bankInfo: { ...(editingUser.bankInfo || { bankName: '', accountNumber: '', realName: '' }), bankName: e.target.value }})} />
                           </div>
                           <div>
                               <label className="text-xs text-gray-500 font-bold">Account Number</label>
                               <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.bankInfo?.accountNumber || ''} onChange={e => setEditingUser({...editingUser, bankInfo: { ...(editingUser.bankInfo || { bankName: '', accountNumber: '', realName: '' }), accountNumber: e.target.value }})} />
                           </div>
                           <div>
                               <label className="text-xs text-gray-500 font-bold">Account Holder</label>
                               <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.bankInfo?.realName || ''} onChange={e => setEditingUser({...editingUser, bankInfo: { ...(editingUser.bankInfo || { bankName: '', accountNumber: '', realName: '' }), realName: e.target.value }})} />
                           </div>
                       </div>
                   )}
                   {activeEditTab === 'SECURITY' && (
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="text-xs text-gray-500 font-bold">Login Password</label>
                               <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.password || ''} onChange={e => setEditingUser({...editingUser, password: e.target.value})} />
                           </div>
                           <div>
                               <label className="text-xs text-gray-500 font-bold">Transaction Password</label>
                               <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.transactionPassword || ''} onChange={e => setEditingUser({...editingUser, transactionPassword: e.target.value})} />
                           </div>
                       </div>
                   )}
                   {activeEditTab === 'CONFIG' && (
                       <div className="space-y-4">
                           <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                               <h4 className="font-bold text-sm mb-3 dark:text-white text-blue-800 dark:text-blue-300">Account Level & Limits</h4>
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                   <div>
                                       <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Level</label>
                                       <input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" value={editingUser.level} onChange={e => setEditingUser({...editingUser, level: Number(e.target.value)})} />
                                   </div>
                                   <div>
                                       <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Daily Order Limit</label>
                                       <input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" placeholder="Default" value={editingUser.customDailyOrderLimit ?? ''} onChange={e => setEditingUser({...editingUser, customDailyOrderLimit: e.target.value ? Number(e.target.value) : undefined})} />
                                   </div>
                                   <div>
                                       <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Commission Rate</label>
                                       <input type="number" step="0.001" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" placeholder="Default" value={editingUser.customCommissionRate ?? ''} onChange={e => setEditingUser({...editingUser, customCommissionRate: e.target.value ? Number(e.target.value) : undefined})} />
                                   </div>
                                   <div>
                                       <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Max Order Amount (Cap)</label>
                                       <input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" placeholder="No Limit" value={editingUser.customMaxOrderAmount ?? ''} onChange={e => setEditingUser({...editingUser, customMaxOrderAmount: e.target.value ? Number(e.target.value) : undefined})} />
                                   </div>
                                   <div>
                                       <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Order Loading Time (sec)</label>
                                       <input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-1" placeholder="Default (3)" value={editingUser.customOrderLoadingTime ?? ''} onChange={e => setEditingUser({...editingUser, customOrderLoadingTime: e.target.value ? Number(e.target.value) : undefined})} />
                                   </div>
                               </div>
                           </div>
                           <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600">
                               <div className="flex justify-between items-center mb-2">
                                   <label className="font-bold text-xs dark:text-white">Rigged Orders (Custom Products/Amounts)</label>
                                   <button onClick={addSpecificOrder} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 font-bold">+ Add Order Rule</button>
                               </div>
                               <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                   {(editingUser.customSpecificOrders || []).map((so, idx) => (
                                       <div key={idx} className="bg-white dark:bg-gray-600 p-3 rounded text-xs shadow-sm border dark:border-gray-500 space-y-2">
                                           <div className="flex items-center space-x-2">
                                              <span className="text-gray-500 font-bold w-12">Idx:</span>
                                              <input type="number" className="w-16 bg-transparent border-b border-gray-300 dark:text-white font-bold text-blue-600" value={so.orderIndex} onChange={e => {
                                                  const newOrders = [...(editingUser.customSpecificOrders || [])];
                                                  newOrders[idx].orderIndex = Number(e.target.value);
                                                  setEditingUser({...editingUser, customSpecificOrders: newOrders});
                                              }} />
                                              <button onClick={() => {
                                                  const newOrders = editingUser.customSpecificOrders?.filter((_, i) => i !== idx);
                                                  setEditingUser({...editingUser, customSpecificOrders: newOrders});
                                              }} className="text-red-500 p-1 ml-auto"><Trash2 size={16}/></button>
                                           </div>
                                           <div className="grid grid-cols-2 gap-2">
                                               <div><label className="block text-[10px] text-gray-400">Amount</label><input type="number" className="w-full bg-transparent border-b border-gray-300 dark:text-white" value={so.amount} onChange={e => {
                                                   const newOrders = [...(editingUser.customSpecificOrders || [])];
                                                   newOrders[idx].amount = Number(e.target.value);
                                                   setEditingUser({...editingUser, customSpecificOrders: newOrders});
                                               }} /></div>
                                               <div><label className="block text-[10px] text-gray-400">Comm. Rate</label><input type="number" step="0.01" className="w-full bg-transparent border-b border-gray-300 dark:text-white" value={so.commissionRate} onChange={e => {
                                                   const newOrders = [...(editingUser.customSpecificOrders || [])];
                                                   newOrders[idx].commissionRate = Number(e.target.value);
                                                   setEditingUser({...editingUser, customSpecificOrders: newOrders});
                                               }} /></div>
                                           </div>
                                           <div className="grid grid-cols-2 gap-2">
                                               <div><label className="block text-[10px] text-gray-400">Product Name</label><input type="text" className="w-full bg-transparent border-b border-gray-300 dark:text-white" value={so.productName || ''} placeholder="Auto" onChange={e => {
                                                   const newOrders = [...(editingUser.customSpecificOrders || [])];
                                                   newOrders[idx].productName = e.target.value;
                                                   setEditingUser({...editingUser, customSpecificOrders: newOrders});
                                               }} /></div>
                                               <div><label className="block text-[10px] text-gray-400">Product Image URL</label><input type="text" className="w-full bg-transparent border-b border-gray-300 dark:text-white" value={so.productImage || ''} placeholder="Auto" onChange={e => {
                                                   const newOrders = [...(editingUser.customSpecificOrders || [])];
                                                   newOrders[idx].productImage = e.target.value;
                                                   setEditingUser({...editingUser, customSpecificOrders: newOrders});
                                               }} /></div>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}
               </div>
               
               <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700 mt-4">
                  <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded text-gray-500 hover:bg-gray-100 font-bold">{t.cancel}</button>
                  <button onClick={() => { updateUser(editingUser.id, editingUser); setEditingUser(null); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">{t.confirm}</button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export const AdminTransactions: React.FC = () => {
  const { transactions, approveTransaction, rejectTransaction, createTransaction, deleteTransaction, language, formatPrice, users } = useApp();
  const t = TRANSLATIONS[language];
  const [filter, setFilter] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAW'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [userTypeFilter, setUserTypeFilter] = useState<'ALL' | 'REAL' | 'FAKE'>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ userId: '', type: 'DEPOSIT', amount: 0 });

  const filteredTransactions = transactions.filter(tx => {
    const user = users.find(u => u.id === tx.userId);
    if (!user) return false; 

    if (filter !== 'ALL' && tx.type !== filter) return false;
    if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;
    if (userTypeFilter === 'REAL' && user.isFake) return false;
    if (userTypeFilter === 'FAKE' && !user.isFake) return false;

    const term = search.toLowerCase();
    return tx.id.toLowerCase().includes(term) || tx.userId.toLowerCase().includes(term);
  });

  const handleCreate = async () => {
      await createTransaction({ 
          userId: newTx.userId, 
          type: newTx.type as TransactionType, 
          amount: Number(newTx.amount), 
          status: TransactionStatus.COMPLETED, 
          details: 'Manual Admin Entry' 
      });
      setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
         <h2 className="text-2xl font-bold dark:text-white">{t.admin_transactions}</h2>
         <div className="flex items-center space-x-2">
             <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700">
                 <Plus size={18} className="mr-2"/> Create
             </button>
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search TX or User ID..."
                    className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
             </div>
         </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
         <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            {['ALL', 'REAL', 'FAKE'].map(type => (
                <button key={type} onClick={() => setUserTypeFilter(type as any)} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${userTypeFilter === type ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500'}`}>
                    {type} Users
                </button>
            ))}
         </div>
         <div className="w-px h-8 bg-gray-300 mx-1"></div>
         {['ALL', 'DEPOSIT', 'WITHDRAW'].map(f => (
             <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1 rounded-lg text-xs font-bold ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}`}>{f}</button>
         ))}
         <div className="w-px h-8 bg-gray-300 mx-1"></div>
         {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
             <button key={s} onClick={() => setStatusFilter(s as any)} className={`px-3 py-1 rounded-lg text-xs font-bold ${statusFilter === s ? 'bg-gray-800 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}`}>{s}</button>
         ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 font-medium uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">{t.status}</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3 text-right">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3 text-xs">
                      <div className="font-bold dark:text-white">{user?.username || tx.userId}</div>
                      {user?.isFake && <span className="text-[10px] bg-purple-100 text-purple-600 px-1 rounded border border-purple-200">FAKE</span>}
                  </td>
                  <td className="px-4 py-3">
                     <span className={`text-xs font-bold px-2 py-1 rounded ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-700' : tx.type === 'WITHDRAW' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                         {tx.type}
                     </span>
                  </td>
                  <td className="px-4 py-3 font-bold dark:text-white">
                     {formatPrice(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                     <span className={`text-xs font-bold px-2 py-1 rounded ${tx.status === 'APPROVED' || tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : tx.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {tx.status}
                     </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                     {tx.status === 'PENDING' && (
                         <>
                            <button onClick={() => approveTransaction(tx.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600">{t.approve}</button>
                            <button onClick={() => rejectTransaction(tx.id)} className="px-3 py-1 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600">{t.reject}</button>
                         </>
                     )}
                     <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">Create Transaction</h3>
                  <div className="space-y-3">
                      <input type="text" placeholder="User ID" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" onChange={e => setNewTx({...newTx, userId: e.target.value})} />
                      <select className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" onChange={e => setNewTx({...newTx, type: e.target.value})}>
                          <option value="DEPOSIT">Deposit</option>
                          <option value="WITHDRAW">Withdraw</option>
                      </select>
                      <input type="number" placeholder="Amount" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} />
                      <div className="flex justify-end space-x-2 mt-4">
                          <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Create</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export const AdminOrderConfig: React.FC = () => {
  const { levelConfigs, updateLevelConfig, addLevelConfig, deleteLevelConfig, systemConfig, updateSystemConfig, language } = useApp();
  const t = TRANSLATIONS[language];
  const [editingLevel, setEditingLevel] = useState<LevelConfig | null>(null);

  const handleSaveLevel = () => {
      if (editingLevel) {
          if (levelConfigs.find(l => l.level === editingLevel.level)) {
              updateLevelConfig(editingLevel);
          } else {
              addLevelConfig(editingLevel);
          }
          setEditingLevel(null);
      }
  };

  const addSpecificRule = () => {
      if (editingLevel) {
          const newRule: SpecificOrderConfig = { orderIndex: 1, amount: 100, commissionRate: 0.05 };
          setEditingLevel({ ...editingLevel, specificOrders: [...(editingLevel.specificOrders || []), newRule] });
      }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">{t.admin_orders}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levelConfigs.map(config => (
          <div key={config.level} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative group hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">{config.level}</div>
               <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setEditingLevel(config)} className="text-blue-500 hover:text-blue-700"><Edit size={18}/></button>
                   <button onClick={() => deleteLevelConfig(config.level)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
               </div>
            </div>
            <h3 className="text-xl font-bold dark:text-white">{config.name}</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
               <p className="flex justify-between"><span>Limit:</span> <span className="font-bold dark:text-white">{config.dailyOrderLimit ?? systemConfig.dailyOrderLimit}</span></p>
               <p className="flex justify-between"><span>Rate:</span> <span className="font-bold dark:text-white">{((config.commissionRate ?? systemConfig.commissionRate) * 100).toFixed(1)}%</span></p>
               <p className="flex justify-between"><span>Min Balance:</span> <span className="font-bold dark:text-white">{((config.minBalancePercent ?? systemConfig.minBalancePercent) * 100).toFixed(0)}%</span></p>
            </div>
            {config.specificOrders && config.specificOrders.length > 0 && (
                <div className="mt-3 pt-3 border-t dark:border-gray-700">
                    <p className="text-xs font-bold text-purple-600">{config.specificOrders.length} Special Rules</p>
                </div>
            )}
          </div>
        ))}
        
        <button onClick={() => setEditingLevel({ level: levelConfigs.length + 1, name: 'New Level', specificOrders: [] })} className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-6 text-gray-400 hover:text-blue-500 hover:border-blue-300 transition-colors h-full min-h-[200px]">
            <Plus size={32} />
            <span className="font-bold mt-2">Add Level</span>
        </button>
      </div>

      {editingLevel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold mb-4 dark:text-white">Edit Level {editingLevel.level}</h3>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-xs font-bold text-gray-500">Name</label><input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={editingLevel.name} onChange={e => setEditingLevel({...editingLevel, name: e.target.value})} /></div>
                          <div><label className="text-xs font-bold text-gray-500">Level Index</label><input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={editingLevel.level} onChange={e => setEditingLevel({...editingLevel, level: Number(e.target.value)})} /></div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                          <h4 className="font-bold text-sm mb-2 dark:text-white">Overrides (Leave empty to use System Defaults)</h4>
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="text-xs text-gray-500">Daily Limit (Def: {systemConfig.dailyOrderLimit})</label><input type="number" className="w-full border p-2 rounded dark:bg-gray-600 dark:text-white" value={editingLevel.dailyOrderLimit || ''} onChange={e => setEditingLevel({...editingLevel, dailyOrderLimit: e.target.value ? Number(e.target.value) : undefined})} /></div>
                              <div><label className="text-xs text-gray-500">Comm. Rate (Def: {systemConfig.commissionRate})</label><input type="number" step="0.001" className="w-full border p-2 rounded dark:bg-gray-600 dark:text-white" value={editingLevel.commissionRate || ''} onChange={e => setEditingLevel({...editingLevel, commissionRate: e.target.value ? Number(e.target.value) : undefined})} /></div>
                          </div>
                      </div>

                      <div className="border-t pt-4 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-sm dark:text-white">Special Order Configuration</h4>
                              <button onClick={addSpecificRule} className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded font-bold">+ Add Rule</button>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                              {editingLevel.specificOrders?.map((rule, idx) => (
                                  <div key={idx} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                      <span className="text-xs font-bold w-8">#{rule.orderIndex}</span>
                                      <input type="number" className="w-20 p-1 text-xs border rounded" placeholder="Amt" value={rule.amount} onChange={e => {
                                          const newRules = [...(editingLevel.specificOrders || [])];
                                          newRules[idx].amount = Number(e.target.value);
                                          setEditingLevel({...editingLevel, specificOrders: newRules});
                                      }} />
                                      <input type="number" step="0.01" className="w-20 p-1 text-xs border rounded" placeholder="Rate" value={rule.commissionRate} onChange={e => {
                                          const newRules = [...(editingLevel.specificOrders || [])];
                                          newRules[idx].commissionRate = Number(e.target.value);
                                          setEditingLevel({...editingLevel, specificOrders: newRules});
                                      }} />
                                      <button onClick={() => {
                                          const newRules = editingLevel.specificOrders?.filter((_, i) => i !== idx);
                                          setEditingLevel({...editingLevel, specificOrders: newRules});
                                      }} className="text-red-500 ml-auto"><Trash2 size={14}/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                      <button onClick={() => setEditingLevel(null)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                      <button onClick={handleSaveLevel} className="px-6 py-2 bg-blue-600 text-white rounded font-bold">Save</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export const AdminInviteCodes: React.FC = () => {
  const { registrationCodes, createRegistrationCode, expireRegistrationCode, deleteRegistrationCode, users, language } = useApp();
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState('');

  const filteredCodes = registrationCodes.filter(rc => 
      rc.code.includes(search) || (rc.usedBy && users.find(u => u.id === rc.usedBy)?.username.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold dark:text-white">{t.admin_invites}</h2>
         <div className="flex space-x-2">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" placeholder={t.search_placeholder} className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={search} onChange={e => setSearch(e.target.value)} />
             </div>
             <button onClick={createRegistrationCode} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700">
                <Plus size={18} className="mr-2" /> {t.generate_code}
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCodes.map(code => {
            const usedUser = code.usedBy ? users.find(u => u.id === code.usedBy) : null;
            return (
                <div key={code.id} className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 ${code.status === 'UNUSED' ? 'border-green-500' : code.status === 'USED' ? 'border-blue-500' : 'border-gray-400'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-lg font-mono font-bold dark:text-white">{code.code}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${code.status === 'UNUSED' ? 'bg-green-100 text-green-700' : code.status === 'USED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {code.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{t.created}: {new Date(code.createdAt).toLocaleDateString()}</p>
                    
                    {code.status === 'USED' && usedUser && (
                        <div className="mt-3 pt-3 border-t dark:border-gray-700 text-xs">
                            <p className="font-bold text-gray-700 dark:text-gray-300 flex items-center"><UserIcon size={12} className="mr-1"/> {usedUser.username}</p>
                            <p className="text-gray-500 mt-1">IP: {usedUser.ipAddress}</p>
                            <p className="text-gray-500">Used: {code.usedAt ? new Date(code.usedAt).toLocaleString() : '-'}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-3">
                        {code.status === 'UNUSED' && (
                            <button onClick={() => expireRegistrationCode(code.id)} className="text-xs text-orange-500 hover:underline">{t.expire}</button>
                        )}
                        <button onClick={() => deleteRegistrationCode(code.id)} className="text-xs text-red-500 hover:underline">{t.delete}</button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export const AdminSettings: React.FC = () => {
  const { systemConfig, updateSystemConfig, appContent, updateAppContent, language, formatPrice } = useApp();
  const t = TRANSLATIONS[language];
  const [localSystem, setLocalSystem] = useState(systemConfig);
  const [localContent, setLocalContent] = useState(appContent);
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'HOME' | 'CONTENT' | 'GRAB' | 'AUTH UI'>('SYSTEM');

  const handleSaveSystem = () => {
      updateSystemConfig(localSystem);
      alert("System Settings Saved");
  };

  const handleSaveContent = () => {
      updateAppContent(localContent);
      alert("Content Settings Saved");
  };

  // Helper to add/remove slides
  const addSlide = () => setLocalContent({...localContent, slides: [...localContent.slides, '']});
  const updateSlide = (idx: number, val: string) => {
      const newSlides = [...localContent.slides];
      newSlides[idx] = val;
      setLocalContent({...localContent, slides: newSlides});
  };
  const removeSlide = (idx: number) => {
      setLocalContent({...localContent, slides: localContent.slides.filter((_, i) => i !== idx)});
  };

  // Helper for Additional Content (Help/More/Grab)
  const addContentItem = () => {
      const newItem: ContentItem = { id: `item-${Date.now()}`, title: 'New Section', text: 'Content here...', section: 'HELP' };
      setLocalContent({...localContent, additionalContent: [...(localContent.additionalContent || []), newItem]});
  };
  const updateContentItem = (idx: number, field: keyof ContentItem, val: string) => {
      const newItems = [...(localContent.additionalContent || [])];
      // @ts-ignore
      newItems[idx] = { ...newItems[idx], [field]: val };
      setLocalContent({...localContent, additionalContent: newItems});
  };
  const removeContentItem = (idx: number) => {
      setLocalContent({...localContent, additionalContent: (localContent.additionalContent || []).filter((_, i) => i !== idx)});
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold dark:text-white">{t.admin_settings}</h2>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg w-fit flex-wrap">
          {['SYSTEM', 'HOME', 'CONTENT', 'GRAB', 'AUTH UI'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  {tab === 'SYSTEM' ? 'System' : tab === 'HOME' ? 'Home' : tab === 'CONTENT' ? 'Content' : tab === 'GRAB' ? 'Grab Order' : 'Auth UI'}
              </button>
          ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          {activeTab === 'SYSTEM' && (
              <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
                      <div>
                          <h4 className="font-bold text-red-700 dark:text-red-400">{t.maintenance_mode}</h4>
                          <p className="text-xs text-red-600/70">{t.maintenance_desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={localSystem.maintenanceMode} onChange={e => setLocalSystem({...localSystem, maintenanceMode: e.target.checked})} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Default Daily Order Limit</label>
                          <input type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localSystem.dailyOrderLimit} onChange={e => setLocalSystem({...localSystem, dailyOrderLimit: Number(e.target.value)})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Default Commission Rate (0.01 = 1%)</label>
                          <input type="number" step="0.001" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localSystem.commissionRate} onChange={e => setLocalSystem({...localSystem, commissionRate: Number(e.target.value)})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Min Balance % for Order</label>
                          <input type="number" step="0.01" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localSystem.minBalancePercent} onChange={e => setLocalSystem({...localSystem, minBalancePercent: Number(e.target.value)})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max Balance % for Order</label>
                          <input type="number" step="0.01" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localSystem.maxBalancePercent} onChange={e => setLocalSystem({...localSystem, maxBalancePercent: Number(e.target.value)})} />
                      </div>
                  </div>
                  <button onClick={handleSaveSystem} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{t.save_settings}</button>
              </div>
          )}

          {activeTab === 'HOME' && (
              <div className="space-y-8">
                  {/* Logo & Text Config */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logo URL</label>
                          <div className="flex space-x-2">
                              <input type="text" className="flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.logoUrl || ''} onChange={e => setLocalContent({...localContent, logoUrl: e.target.value})} placeholder="https://..." />
                              {localContent.logoUrl && <img src={localContent.logoUrl} className="w-10 h-10 object-contain border rounded bg-gray-100" alt="Logo Preview" />}
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">App Name / Title</label>
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.welcomeText} onChange={e => setLocalContent({...localContent, welcomeText: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marquee Text</label>
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.marqueeText} onChange={e => setLocalContent({...localContent, marqueeText: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Banner Image URL</label>
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.bannerUrl} onChange={e => setLocalContent({...localContent, bannerUrl: e.target.value})} />
                      </div>
                  </div>

                  {/* Intro Config */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                      <h4 className="font-bold text-sm mb-3 flex items-center"><Shield size={16} className="mr-2"/> Introduction Section</h4>
                      <div className="space-y-3">
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-600 dark:text-white" placeholder="Intro Image URL" value={localContent.introImageUrl || ''} onChange={e => setLocalContent({...localContent, introImageUrl: e.target.value})} />
                          <textarea className="w-full border p-2 rounded dark:bg-gray-600 dark:text-white h-24" placeholder="Intro Text..." value={localContent.introText} onChange={e => setLocalContent({...localContent, introText: e.target.value})} />
                          
                          <div className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                  <label className="text-xs">Text Color</label>
                                  <input type="color" value={localContent.textColor} onChange={e => setLocalContent({...localContent, textColor: e.target.value})} className="h-8 w-14 rounded cursor-pointer" />
                              </div>
                              <div className="flex items-center space-x-2">
                                  <label className="text-xs">Size</label>
                                  <select value={localContent.textSize} onChange={e => setLocalContent({...localContent, textSize: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                      <option value="text-sm">Small</option>
                                      <option value="text-base">Medium</option>
                                      <option value="text-lg">Large</option>
                                      <option value="text-xl">Extra Large</option>
                                  </select>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <label className="text-xs">Font</label>
                                  <select value={localContent.textFontFamily || ''} onChange={e => setLocalContent({...localContent, textFontFamily: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                      <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial">Inter / System</option>
                                      <option value="Roboto, system-ui, -apple-system, 'Segoe UI', Arial">Roboto</option>
                                      <option value="'Helvetica Neue', Arial, sans-serif">Helvetica Neue</option>
                                      <option value="Georgia, serif">Georgia</option>
                                      <option value="'Courier New', monospace">Courier New</option>
                                  </select>
                                  <select value={localContent.textFontWeight || ''} onChange={e => setLocalContent({...localContent, textFontWeight: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                      <option value="300">300</option>
                                      <option value="400">400</option>
                                      <option value="500">500</option>
                                      <option value="600">600</option>
                                      <option value="700">700</option>
                                      <option value="800">800</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Slide Manager */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-sm flex items-center"><Images size={16} className="mr-2"/> Image Slideshow (Top)</h4>
                          <button onClick={addSlide} className="text-xs bg-blue-600 text-white px-3 py-1 rounded font-bold hover:bg-blue-700">+ Add Slide</button>
                      </div>
                      <div className="space-y-2">
                          {localContent.slides.map((url, idx) => (
                              <div key={idx} className="flex space-x-2">
                                  <input type="text" className="flex-1 border p-2 rounded text-sm dark:bg-gray-700 dark:text-white" value={url} onChange={e => updateSlide(idx, e.target.value)} placeholder="Image URL..." />
                                  <button onClick={() => removeSlide(idx)} className="text-red-500 p-2 hover:bg-red-100 rounded"><Trash2 size={16}/></button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Popup Config */}
                  <div className="p-4 border rounded-lg dark:border-gray-700">
                      <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-sm">Home Popup</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={localContent.popupEnabled} onChange={e => setLocalContent({...localContent, popupEnabled: e.target.checked})} />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                      </div>
                      {localContent.popupEnabled && (
                          <div className="space-y-3">
                              <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" placeholder="Popup Title" value={localContent.popupTitle} onChange={e => setLocalContent({...localContent, popupTitle: e.target.value})} />
                              <div className="flex space-x-3">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Title Color</label>
                                      <div className="flex items-center space-x-2"><input type="color" className="h-10 w-20 rounded cursor-pointer" value={localContent.popupTitleColor || '#1e3a8a'} onChange={e => setLocalContent({...localContent, popupTitleColor: e.target.value})} /><span className="text-xs">{localContent.popupTitleColor}</span></div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Title Size</label>
                                      <select value={localContent.popupTitleSize || 'text-xl'} onChange={e => setLocalContent({...localContent, popupTitleSize: e.target.value})} className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full">
                                          <option value="text-sm">Small</option>
                                          <option value="text-base">Base</option>
                                          <option value="text-lg">Large</option>
                                          <option value="text-xl">XL</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="flex space-x-3">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Title Font Family</label>
                                      <select value={localContent.popupTitleFontFamily || "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"} onChange={e => setLocalContent({...localContent, popupTitleFontFamily: e.target.value})} className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full">
                                          <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif">Inter / System UI</option>
                                          <option value="Roboto, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial">Roboto</option>
                                          <option value="Arial, Helvetica, sans-serif">Arial</option>
                                          <option value="Georgia, serif">Georgia</option>
                                          <option value="'Courier New', monospace">Courier</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Title Font Weight</label>
                                      <select value={localContent.popupTitleFontWeight || '700'} onChange={e => setLocalContent({...localContent, popupTitleFontWeight: e.target.value})} className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full">
                                          <option value="400">400</option>
                                          <option value="500">500</option>
                                          <option value="600">600</option>
                                          <option value="700">700</option>
                                          <option value="800">800</option>
                                      </select>
                                  </div>
                              </div>
                              <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" placeholder="Popup Image URL (Optional)" value={localContent.popupImageUrl || ''} onChange={e => setLocalContent({...localContent, popupImageUrl: e.target.value})} />
                              <textarea className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white h-20" placeholder="Message..." value={localContent.popupMessage} onChange={e => setLocalContent({...localContent, popupMessage: e.target.value})} />
                              <div className="flex space-x-3 mt-2">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Message Color</label>
                                      <div className="flex items-center space-x-2"><input type="color" className="h-10 w-20 rounded cursor-pointer" value={localContent.popupTextColor || '#374151'} onChange={e => setLocalContent({...localContent, popupTextColor: e.target.value})} /><span className="text-xs">{localContent.popupTextColor}</span></div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Message Size</label>
                                      <select value={localContent.popupTextSize || 'text-base'} onChange={e => setLocalContent({...localContent, popupTextSize: e.target.value})} className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full">
                                          <option value="text-sm">Small</option>
                                          <option value="text-base">Base</option>
                                          <option value="text-lg">Large</option>
                                          <option value="text-xl">XL</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="flex space-x-3 mt-2">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Message Font Family</label>
                                      <select value={localContent.popupTextFontFamily || "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"} onChange={e => setLocalContent({...localContent, popupTextFontFamily: e.target.value})} className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full">
                                          <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif">Inter / System UI</option>
                                          <option value="Roboto, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial">Roboto</option>
                                          <option value="Arial, Helvetica, sans-serif">Arial</option>
                                          <option value="Georgia, serif">Georgia</option>
                                          <option value="'Courier New', monospace">Courier</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Message Font Weight</label>
                                      <select value={localContent.popupTextFontWeight || '400'} onChange={e => setLocalContent({...localContent, popupTextFontWeight: e.target.value})} className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full">
                                          <option value="400">400</option>
                                          <option value="500">500</option>
                                          <option value="600">600</option>
                                          <option value="700">700</option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>

                  <button onClick={handleSaveContent} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{t.save_settings}</button>
              </div>
          )}

          {activeTab === 'CONTENT' && (
              <div className="space-y-8">
                  {/* Start Page Content */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                      <h4 className="font-bold text-sm mb-3 flex items-center text-yellow-800 dark:text-yellow-200"><PlayCircle size={16} className="mr-2"/> "Start" Page Custom Content</h4>
                      <div className="space-y-3">
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" placeholder="Image URL" value={localContent.startPageImage || ''} onChange={e => setLocalContent({...localContent, startPageImage: e.target.value})} />
                          <textarea className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" placeholder="Text content..." value={localContent.startPageText || ''} onChange={e => setLocalContent({...localContent, startPageText: e.target.value})} />
                          <div className="flex items-center space-x-2">
                              <label className="text-xs font-bold text-gray-500">Text Color:</label>
                              <input type="color" value={localContent.startPageTextColor} onChange={e => setLocalContent({...localContent, startPageTextColor: e.target.value})} className="h-8 w-14 rounded cursor-pointer" />
                          </div>
                          <div className="flex items-center space-x-2">
                              <label className="text-xs font-bold text-gray-500">Size</label>
                              <select value={localContent.startPageTextSize} onChange={e => setLocalContent({...localContent, startPageTextSize: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                  <option value="text-sm">Small</option>
                                  <option value="text-base">Medium</option>
                                  <option value="text-lg">Large</option>
                                  <option value="text-xl">Extra Large</option>
                              </select>
                          </div>
                          <div className="flex items-center space-x-2">
                              <label className="text-xs font-bold text-gray-500">Font</label>
                              <select value={localContent.startPageFontFamily || ''} onChange={e => setLocalContent({...localContent, startPageFontFamily: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                  <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial">Inter / System</option>
                                  <option value="Roboto, system-ui, -apple-system, 'Segoe UI', Arial">Roboto</option>
                                  <option value="'Helvetica Neue', Arial, sans-serif">Helvetica Neue</option>
                                  <option value="Georgia, serif">Georgia</option>
                                  <option value="'Courier New', monospace">Courier New</option>
                              </select>
                              <select value={localContent.startPageFontWeight || ''} onChange={e => setLocalContent({...localContent, startPageFontWeight: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                  <option value="300">300</option>
                                  <option value="400">400</option>
                                  <option value="500">500</option>
                                  <option value="600">600</option>
                                  <option value="700">700</option>
                              </select>
                          </div>
                      </div>
                  </div>

                  {/* Getting Started Content */}
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                      <h4 className="font-bold text-sm mb-3 flex items-center text-green-800 dark:text-green-200"><HelpCircle size={16} className="mr-2"/> "Getting Started" (Help Page)</h4>
                      <div className="space-y-3">
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" placeholder="Image URL" value={localContent.gettingStartedImage || ''} onChange={e => setLocalContent({...localContent, gettingStartedImage: e.target.value})} />
                          <textarea className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white h-24" placeholder="Instructions text..." value={localContent.gettingStartedText || ''} onChange={e => setLocalContent({...localContent, gettingStartedText: e.target.value})} />
                      </div>
                  </div>

                  {/* Customer Service */}
                  <div className="p-4 border rounded-lg dark:border-gray-700">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Customer Service Link</label>
                      <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.csLink || ''} onChange={e => setLocalContent({...localContent, csLink: e.target.value})} placeholder="https://t.me/..." />
                  </div>

                  {/* Additional Content Blocks */}
                  <div className="border-t pt-6 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-lg dark:text-white">Additional Help/Content Blocks</h4>
                          <button onClick={addContentItem} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700">+ Add Block</button>
                      </div>
                      <div className="space-y-4">
                          {(localContent.additionalContent || []).filter(i => i.section === 'HELP' || i.section === 'HOME').map((item, idx) => (
                              <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg relative group">
                                  <button onClick={() => removeContentItem(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                                  <div className="space-y-2 pr-8">
                                      <div className="flex space-x-2 mb-2">
                                          <label className="text-xs font-bold text-gray-500 self-center">Section:</label>
                                          <select 
                                            value={item.section || 'HELP'} 
                                            onChange={e => updateContentItem(idx, 'section', e.target.value)} 
                                            className="border p-1 rounded text-xs font-bold bg-white dark:bg-gray-600 dark:text-white"
                                          >
                                              <option value="HELP">Help Page</option>
                                              <option value="HOME">Home Page</option>
                                          </select>
                                      </div>
                                      <input type="text" className="w-full border p-2 rounded text-sm font-bold dark:bg-gray-600 dark:text-white" value={item.title} onChange={e => updateContentItem(idx, 'title', e.target.value)} placeholder="Title" />
                                      <input type="text" className="w-full border p-2 rounded text-xs dark:bg-gray-600 dark:text-white" value={item.imageUrl || ''} onChange={e => updateContentItem(idx, 'imageUrl', e.target.value)} placeholder="Image URL (Optional)" />
                                      <textarea className="w-full border p-2 rounded text-sm dark:bg-gray-600 dark:text-white" value={item.text} onChange={e => updateContentItem(idx, 'text', e.target.value)} placeholder="Content text..." />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <button onClick={handleSaveContent} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{t.save_settings}</button>
              </div>
          )}

          {activeTab === 'GRAB' && (
              <div className="space-y-8">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                      <h4 className="font-bold text-sm mb-3 flex items-center text-indigo-800 dark:text-indigo-200"><MousePointer2 size={16} className="mr-2"/> Grab Order Page Config</h4>
                      <div className="space-y-3">
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" placeholder="Main Image URL" value={localContent.grabPageImage || ''} onChange={e => setLocalContent({...localContent, grabPageImage: e.target.value})} />
                          <textarea className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white h-24" placeholder="Instruction Text..." value={localContent.grabPageText || ''} onChange={e => setLocalContent({...localContent, grabPageText: e.target.value})} />
                          <div className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                  <label className="text-xs">Color</label>
                                  <input type="color" value={localContent.grabPageTextColor} onChange={e => setLocalContent({...localContent, grabPageTextColor: e.target.value})} className="h-8 w-14 rounded cursor-pointer" />
                              </div>
                              <div className="flex items-center space-x-2">
                                  <label className="text-xs">Size</label>
                                  <select value={localContent.grabPageTextSize} onChange={e => setLocalContent({...localContent, grabPageTextSize: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                      <option value="text-sm">Small</option>
                                      <option value="text-base">Medium</option>
                                      <option value="text-lg">Large</option>
                                      <option value="text-xl">Extra Large</option>
                                  </select>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <label className="text-xs">Font</label>
                                  <select value={localContent.grabPageFontFamily || ''} onChange={e => setLocalContent({...localContent, grabPageFontFamily: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                      <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial">Inter / System</option>
                                      <option value="Roboto, system-ui, -apple-system, 'Segoe UI', Arial">Roboto</option>
                                      <option value="'Helvetica Neue', Arial, sans-serif">Helvetica Neue</option>
                                      <option value="Georgia, serif">Georgia</option>
                                      <option value="'Courier New', monospace">Courier New</option>
                                  </select>
                                  <select value={localContent.grabPageFontWeight || ''} onChange={e => setLocalContent({...localContent, grabPageFontWeight: e.target.value})} className="border p-1 rounded dark:bg-gray-600 text-sm">
                                      <option value="300">300</option>
                                      <option value="400">400</option>
                                      <option value="500">500</option>
                                      <option value="600">600</option>
                                      <option value="700">700</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Additional Grab Content Blocks */}
                  <div className="border-t pt-6 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-lg dark:text-white">Additional Grab Content Blocks</h4>
                          <button onClick={() => {
                              const newItem: ContentItem = { id: `grab-${Date.now()}`, title: 'Info', text: '...', section: 'GRAB' };
                              setLocalContent({...localContent, additionalContent: [...(localContent.additionalContent || []), newItem]});
                          }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700">+ Add Block</button>
                      </div>
                      <div className="space-y-4">
                          {(localContent.additionalContent || []).filter(i => i.section === 'GRAB').map((item, idx) => (
                              <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg relative group">
                                  <button onClick={() => {
                                      const realIdx = (localContent.additionalContent || []).findIndex(i => i.id === item.id);
                                      removeContentItem(realIdx);
                                  }} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                                  <div className="space-y-2 pr-8">
                                      <input type="text" className="w-full border p-2 rounded text-sm font-bold dark:bg-gray-600 dark:text-white" value={item.title} onChange={e => {
                                          const realIdx = (localContent.additionalContent || []).findIndex(i => i.id === item.id);
                                          updateContentItem(realIdx, 'title', e.target.value);
                                      }} placeholder="Title" />
                                      <input type="text" className="w-full border p-2 rounded text-xs dark:bg-gray-600 dark:text-white" value={item.imageUrl || ''} onChange={e => {
                                          const realIdx = (localContent.additionalContent || []).findIndex(i => i.id === item.id);
                                          updateContentItem(realIdx, 'imageUrl', e.target.value);
                                      }} placeholder="Image URL" />
                                      <textarea className="w-full border p-2 rounded text-sm dark:bg-gray-600 dark:text-white" value={item.text} onChange={e => {
                                          const realIdx = (localContent.additionalContent || []).findIndex(i => i.id === item.id);
                                          updateContentItem(realIdx, 'text', e.target.value);
                                      }} placeholder="Content text..." />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  <button onClick={handleSaveContent} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{t.save_settings}</button>
              </div>
          )}

          {activeTab === 'AUTH UI' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Background Image URL</label>
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.authBgImage || ''} onChange={e => setLocalContent({...localContent, authBgImage: e.target.value})} placeholder="https://..." />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">App Title (Login Page)</label>
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.authTitle || ''} onChange={e => setLocalContent({...localContent, authTitle: e.target.value})} placeholder="App Name" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label>
                          <input type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.authSubtitle || ''} onChange={e => setLocalContent({...localContent, authSubtitle: e.target.value})} placeholder="Welcome Back" />
                      </div>
                      <div className="flex space-x-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Primary Color</label>
                              <div className="flex items-center space-x-2">
                                  <input type="color" className="h-10 w-20 rounded cursor-pointer" value={localContent.authPrimaryColor || '#2563eb'} onChange={e => setLocalContent({...localContent, authPrimaryColor: e.target.value})} />
                                  <span className="text-xs">{localContent.authPrimaryColor}</span>
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Title Color</label>
                              <div className="flex items-center space-x-2">
                                  <input type="color" className="h-10 w-20 rounded cursor-pointer" value={localContent.authTitleColor || '#1e3a8a'} onChange={e => setLocalContent({...localContent, authTitleColor: e.target.value})} />
                                  <span className="text-xs">{localContent.authTitleColor}</span>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Title Size</label>
                          <select className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" value={localContent.authTitleSize || 'text-3xl'} onChange={e => setLocalContent({...localContent, authTitleSize: e.target.value})}>
                              <option value="text-2xl">Small (2xl)</option>
                              <option value="text-3xl">Medium (3xl)</option>
                              <option value="text-4xl">Large (4xl)</option>
                              <option value="text-5xl">Extra Large (5xl)</option>
                          </select>
                      </div>
                  </div>
                  <button onClick={handleSaveContent} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{t.save_settings}</button>
              </div>
          )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Module, PendingChange, User } from '../types';
import ModuleCard from './ModuleCard';
import AdminEditor from './AdminEditor';
import { Plus, Settings, Users, BookOpen, Trash2, Shield, User as UserIcon, Lock, Edit2, Save, X, BarChart3, CheckCircle, Clock, FileText, Check, AlertTriangle, Copy, Info, Link as LinkIcon } from 'lucide-react';
import { DEFAULT_SUPER_ADMIN } from '../constants';

interface AdminDashboardProps {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
}

interface LocalUser {
  username: string;
  role: 'admin' | 'user';
  password?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ modules, setModules }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'progress' | 'approvals'>('content');
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // User Management State
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' as 'admin' | 'user' });
  const [editingUser, setEditingUser] = useState<LocalUser | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Super Admin Management State
  const [superAdmin, setSuperAdmin] = useState(DEFAULT_SUPER_ADMIN);
  const [isEditingSuperAdmin, setIsEditingSuperAdmin] = useState(false);
  const [tempSuperAdmin, setTempSuperAdmin] = useState(DEFAULT_SUPER_ADMIN);

  // Approvals State
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);

  // Progress State
  const [userProgressData, setUserProgressData] = useState<any>({});

  useEffect(() => {
    // Load current user
    const curUser = JSON.parse(localStorage.getItem('fh_current_user') || 'null');
    setCurrentUser(curUser);

    // Load users from local storage safely
    try {
      const storedUsers = JSON.parse(localStorage.getItem('fh_users') || '[]');
      setUsers(storedUsers);
    } catch (e) {
      console.error("Failed to load users", e);
      setUsers([]);
    }

    // Load Super Admin from local storage
    const storedSuperAdmin = JSON.parse(localStorage.getItem('fh_super_admin') || 'null');
    if (storedSuperAdmin) {
      setSuperAdmin(storedSuperAdmin);
    }

    // Load Progress
    const storedProgress = JSON.parse(localStorage.getItem('fh_user_progress') || '{}');
    setUserProgressData(storedProgress);

    // Load Pending Changes
    const storedPending = JSON.parse(localStorage.getItem('fh_pending_changes') || '[]');
    setPendingChanges(storedPending);

  }, [activeTab]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 5000);
  };

  // Safely check for super admin status (case-insensitive)
  const isSuperAdmin = currentUser?.username?.toLowerCase() === superAdmin.username.toLowerCase();

  // --- Module Handlers ---

  const handleDeleteModule = (id: string) => {
    if (isSuperAdmin) {
      if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
        setModules(prev => prev.filter(m => m.id !== id));
        showNotification('Module deleted successfully.');
      }
    } else {
      const moduleTitle = modules.find(m => m.id === id)?.title;
      if (window.confirm(`Request deletion for "${moduleTitle}"? This requires Super Admin approval.`)) {
        const newRequest: PendingChange = {
          id: `req_${Date.now()}`,
          type: 'DELETE',
          targetModuleId: id,
          requestedBy: currentUser?.username || 'Unknown Admin',
          timestamp: new Date().toISOString()
        };
        const updatedPending = [...pendingChanges, newRequest];
        setPendingChanges(updatedPending);
        localStorage.setItem('fh_pending_changes', JSON.stringify(updatedPending));
        showNotification('Deletion request sent to Super Admin.');
      }
    }
  };

  const handleSaveModule = (module: Module) => {
    if (isSuperAdmin) {
      if (isCreating) {
        setModules(prev => [...prev, module]);
      } else {
        setModules(prev => prev.map(m => m.id === module.id ? module : m));
      }
      setEditingModule(null);
      setIsCreating(false);
      showNotification(`Module ${isCreating ? 'created' : 'updated'} successfully.`);
    } else {
      const type = isCreating ? 'CREATE' : 'UPDATE';
      const newRequest: PendingChange = {
        id: `req_${Date.now()}`,
        type: type,
        moduleData: module,
        targetModuleId: module.id,
        requestedBy: currentUser?.username || 'Unknown Admin',
        timestamp: new Date().toISOString()
      };
      
      const updatedPending = [...pendingChanges, newRequest];
      setPendingChanges(updatedPending);
      localStorage.setItem('fh_pending_changes', JSON.stringify(updatedPending));
      
      setEditingModule(null);
      setIsCreating(false);
      showNotification(`${type === 'CREATE' ? 'Creation' : 'Update'} request sent to Super Admin.`);
    }
  };

  // --- Approval Handlers ---
  const handleApprove = (change: PendingChange) => {
    if (change.type === 'DELETE' && change.targetModuleId) {
      setModules(prev => prev.filter(m => m.id !== change.targetModuleId));
    } else if (change.type === 'CREATE' && change.moduleData) {
      setModules(prev => [...prev, change.moduleData!]);
    } else if (change.type === 'UPDATE' && change.moduleData) {
      setModules(prev => prev.map(m => m.id === change.targetModuleId ? change.moduleData! : m));
    }

    const updatedPending = pendingChanges.filter(p => p.id !== change.id);
    setPendingChanges(updatedPending);
    localStorage.setItem('fh_pending_changes', JSON.stringify(updatedPending));
    showNotification('Request approved successfully.');
  };

  const handleReject = (id: string) => {
    if (window.confirm('Reject this request?')) {
      const updatedPending = pendingChanges.filter(p => p.id !== id);
      setPendingChanges(updatedPending);
      localStorage.setItem('fh_pending_changes', JSON.stringify(updatedPending));
      showNotification('Request rejected.');
    }
  };

  // --- User Handlers ---
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = newUser.username.trim();
    const cleanPassword = newUser.password.trim();

    if (!cleanUsername || !cleanPassword) {
      alert("Please enter both username and password.");
      return;
    }
    
    if (cleanUsername.length < 3) {
      alert("Username must be at least 3 characters.");
      return;
    }

    // Refresh from storage to avoid stale state issues
    const currentUsers: LocalUser[] = JSON.parse(localStorage.getItem('fh_users') || '[]');

    // Check for duplicates (Case Insensitive)
    if (currentUsers.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      alert('User already exists (usernames are not case sensitive). Delete the existing user to recreate.');
      return;
    }

    // Check vs Super Admin
    if (cleanUsername.toLowerCase() === superAdmin.username.toLowerCase()) {
      alert('Cannot create a user with the same name as Super Admin');
      return;
    }

    const userToSave: LocalUser = { 
      username: cleanUsername, 
      password: cleanPassword,
      role: newUser.role
    };

    const updatedUsers = [...currentUsers, userToSave];
    
    // Save to storage AND update state
    localStorage.setItem('fh_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    showNotification(`${newUser.role === 'admin' ? 'Admin' : 'Learner'} account created! They can now login.`);
    setNewUser({ username: '', password: '', role: 'user' });
  };

  const handleUpdateUserPassword = () => {
    if (!editingUser || !newPassword.trim()) return;

    const updatedUsers = users.map(u => 
      u.username === editingUser.username ? { ...u, password: newPassword.trim() } : u
    );
    
    localStorage.setItem('fh_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setEditingUser(null);
    setNewPassword('');
    showNotification(`Password for ${editingUser.username} updated successfully.`);
  };

  const handleDeleteUser = (username: string) => {
    if (window.confirm(`Remove access for ${username}? This will also delete their login credentials.`)) {
      // Refresh from storage
      const currentUsers: LocalUser[] = JSON.parse(localStorage.getItem('fh_users') || '[]');
      const updatedUsers = currentUsers.filter(u => u.username !== username);
      
      localStorage.setItem('fh_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      showNotification('User deleted.');
    }
  };

  const copyLoginLink = (role: 'admin' | 'user') => {
    // Construct link based on HashRouter format
    const baseUrl = window.location.origin + window.location.pathname;
    // Ensure we don't double slash if pathname ends in /
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const link = role === 'admin' ? `${cleanBaseUrl}/#/admin/login` : `${cleanBaseUrl}/#/login`;
    
    navigator.clipboard.writeText(link);
    showNotification(`Copied ${role === 'admin' ? 'Admin' : 'Learner'} login link to clipboard`);
  };

  // --- Super Admin Handlers ---
  const startEditSuperAdmin = () => {
    setTempSuperAdmin(superAdmin);
    setIsEditingSuperAdmin(true);
  };

  const cancelEditSuperAdmin = () => {
    setIsEditingSuperAdmin(false);
    setTempSuperAdmin(DEFAULT_SUPER_ADMIN);
  };

  const saveSuperAdmin = () => {
    if (!tempSuperAdmin.username || !tempSuperAdmin.password) {
      alert("Username and password cannot be empty");
      return;
    }
    setSuperAdmin(tempSuperAdmin);
    localStorage.setItem('fh_super_admin', JSON.stringify(tempSuperAdmin));
    setIsEditingSuperAdmin(false);
    showNotification('Super Admin credentials updated successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="mt-2 text-slate-600">
            {isSuperAdmin 
              ? "Super Admin Access: Full control over content and approvals." 
              : "Admin Access: Manage users and request content changes."}
          </p>
        </div>
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm ${
          notification.type === 'success' ? 'bg-teal-50 text-teal-800 border border-teal-100' : 'bg-red-50 text-red-800 border border-red-100'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="font-medium">{notification.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'content' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Training Content
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'users' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'progress' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Learner Progress
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'approvals' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Approvals
            {pendingChanges.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                {pendingChanges.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* CONTENT TAB */}
      {activeTab === 'content' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
               <Settings className="w-3 h-3" />
               <span>{isSuperAdmin ? 'Live Content Editor' : 'Content Request Mode'}</span>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> {isSuperAdmin ? 'Create Module' : 'Request New Module'}
            </button>
          </div>

          {!isSuperAdmin && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Approval Required</p>
                <p>As a regular admin, any changes you make (create, edit, delete) will be sent to the Super Admin for approval before going live.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map(module => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                isAdmin={true} 
                onEdit={(m) => setEditingModule(m)}
                onDelete={handleDeleteModule}
              />
            ))}
          </div>

          {modules.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400">No modules found. Start by creating one.</p>
            </div>
          )}
        </div>
      )}

      {/* APPROVALS TAB (Super Admin Only) */}
      {activeTab === 'approvals' && isSuperAdmin && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Pending Requests</h3>
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{pendingChanges.length} Pending</span>
             </div>

             <div className="divide-y divide-slate-100">
               {pendingChanges.map(change => (
                 <div key={change.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:bg-slate-50">
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                          change.type === 'CREATE' ? 'bg-green-100 text-green-700 border-green-200' :
                          change.type === 'UPDATE' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {change.type}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(change.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-lg">
                        {change.moduleData?.title || (modules.find(m => m.id === change.targetModuleId)?.title || "Deleted Module")}
                      </h4>
                      
                      <p className="text-sm text-slate-600 mt-1">
                        Requested by: <span className="font-medium text-slate-900">{change.requestedBy}</span>
                      </p>
                   </div>

                   <div className="flex items-center gap-3 w-full md:w-auto">
                     <button
                       onClick={() => handleApprove(change)}
                       className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                     >
                       <Check className="w-4 h-4" /> Approve
                     </button>
                     <button
                       onClick={() => handleReject(change.id)}
                       className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 px-5 py-2.5 rounded-lg font-medium transition-colors"
                     >
                       <X className="w-4 h-4" /> Reject
                     </button>
                   </div>
                 </div>
               ))}

               {pendingChanges.length === 0 && (
                 <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                     <CheckCircle className="w-8 h-8 text-teal-500" />
                   </div>
                   <p className="font-medium text-slate-600">All caught up!</p>
                   <p className="text-sm mt-1">No pending content requests.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Create User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-600" />
                Create New Account
              </h3>
              
              <form onSubmit={handleCreateUser} className="space-y-4" autoComplete="off">
                {/* Dummy hidden inputs to trick browser autocomplete */}
                <input type="text" style={{display: 'none'}} />
                <input type="password" style={{display: 'none'}} />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewUser({...newUser, role: 'user'})}
                      className={`px-4 py-2 text-sm rounded-lg border text-center transition-colors ${newUser.role === 'user' ? 'bg-teal-50 border-teal-200 text-teal-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Learner
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewUser({...newUser, role: 'admin'})}
                      className={`px-4 py-2 text-sm rounded-lg border text-center transition-colors ${newUser.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email</label>
                  <input
                    type="text"
                    required
                    autoComplete="new-username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none text-sm"
                    placeholder="e.g. john.doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoComplete="new-password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none text-sm pr-10"
                      placeholder="Set a password"
                    />
                    <div className="absolute right-3 top-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Password is visible so you can copy it.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>

          {/* User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Active Accounts</h3>
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{users.length + 1} Users</span>
              </div>
              
              <div className="divide-y divide-slate-100">
                {/* Super Admin */}
                {isEditingSuperAdmin ? (
                  <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-bold text-slate-900">Editing Super Admin</div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Username</label>
                        <input 
                          type="text"
                          value={tempSuperAdmin.username}
                          onChange={(e) => setTempSuperAdmin({...tempSuperAdmin, username: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
                        <input 
                          type="text"
                          value={tempSuperAdmin.password}
                          onChange={(e) => setTempSuperAdmin({...tempSuperAdmin, password: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={saveSuperAdmin}
                          className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded hover:bg-indigo-700 flex items-center justify-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Save Changes
                        </button>
                        <button 
                          onClick={cancelEditSuperAdmin}
                          className="flex-1 bg-white border border-slate-300 text-slate-600 text-xs font-bold py-2 rounded hover:bg-slate-50 flex items-center justify-center gap-1"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          Prashant (Main)
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">SUPER ADMIN</span>
                        </div>
                        <div className="text-xs text-slate-500">{superAdmin.username}</div>
                      </div>
                    </div>
                    {isSuperAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyLoginLink('admin')}
                          className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Copy Admin Login Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={startEditSuperAdmin}
                          className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Super Admin Credentials"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Dynamic Users */}
                {users.map((user) => (
                  <div key={user.username} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                        {user.role === 'admin' ? <Lock className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.username}</div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                            user.role === 'admin' 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                              : 'bg-teal-50 text-teal-700 border-teal-100'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                             Pwd: <span className="font-bold text-slate-700">{user.password}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => copyLoginLink(user.role)}
                        className="text-slate-400 hover:text-blue-600 px-2 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                        title="Copy Login Link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingUser(user); setNewPassword(''); }}
                        className="text-slate-400 hover:text-teal-600 px-2 py-2 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-2"
                        title="Reset Password"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.username)}
                        className="text-slate-400 hover:text-red-600 px-2 py-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Password Reset Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Reset Password for {editingUser.username}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUserPassword}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {(editingModule || isCreating) && activeTab === 'content' && (
        <AdminEditor 
          initialData={editingModule || undefined}
          onSave={handleSaveModule}
          onCancel={() => { setEditingModule(null); setIsCreating(false); }}
          saveLabel={isSuperAdmin ? 'Save Module' : 'Submit for Approval'}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
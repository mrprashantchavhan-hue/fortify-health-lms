import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ExternalLink, Settings, LogOut, Shield, PlayCircle, User, Lock, LayoutDashboard } from 'lucide-react';
import { INITIAL_MODULES } from './constants';
import { Module, User as UserType } from './types';
import ModuleCard from './components/ModuleCard';
import ChatWidget from './components/ChatWidget';
import { LoginPage, RegisterPage, AdminLoginPage, ForgotPasswordPage } from './components/AuthPages';
import VideoModal from './components/VideoModal';
import AdminDashboard from './components/AdminDashboard';

// --- Top Bars ---

const UserTopBar = ({ user, onLogout }: { user: UserType, onLogout: () => void }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">Fortify Health</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">LEARNER PORTAL</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center text-teal-700 border border-teal-100">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                 <span className="text-xs font-semibold text-slate-800">{user.username}</span>
                 <span className="text-[10px] text-slate-500 uppercase">Learner</span>
              </div>
            </div>
             
             <div className="h-6 w-px bg-slate-200 mx-2"></div>

             <button 
               onClick={onLogout}
               className="text-slate-400 hover:text-red-600 transition-colors"
               title="Logout"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

const AdminTopBar = ({ user, onLogout }: { user: UserType, onLogout: () => void }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="bg-slate-700 p-2 rounded-lg">
              <Lock className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">Fortify Health</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide hidden sm:block">ADMIN CONSOLE</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 border border-slate-700">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                 <span className="text-xs font-semibold text-white">{user.username}</span>
                 <span className="text-[10px] text-teal-400 uppercase">Administrator</span>
              </div>
            </div>
             
             <div className="h-6 w-px bg-slate-700 mx-2"></div>

             <button 
               onClick={onLogout}
               className="text-slate-400 hover:text-white transition-colors"
               title="Logout"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

// --- Module Components ---

const UserDashboard = ({ modules, user }: { modules: Module[], user: UserType | null }) => {
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user) {
      const allProgress = JSON.parse(localStorage.getItem('fh_user_progress') || '{}');
      setUserProgress(allProgress[user.username]?.modules || {});
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Training Modules</h2>
          <p className="mt-2 text-slate-600">Select a module to begin your quality assurance training.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map(module => {
          const mProgress = userProgress[module.id];
          const completed = mProgress?.completedTopicIds?.length || 0;
          const total = module.topics.length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          return (
            <ModuleCard 
              key={module.id} 
              module={module} 
              isAdmin={false}
              progress={percent}
            />
          );
        })}
      </div>
    </div>
  );
};

const ModuleDetail = ({ modules }: { modules: Module[] }) => {
  const { id } = useParams<{ id: string }>();
  const module = modules.find(m => m.id === id);
  const [playingVideo, setPlayingVideo] = useState<{url: string, title: string} | null>(null);

  if (!module) return <Navigate to="/dashboard" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/dashboard" className="text-teal-600 font-medium hover:underline mb-4 inline-block">&larr; Back to Modules</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{module.title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed">{module.description}</p>
      </div>

      <div className="space-y-6">
        {module.topics.map((topic, idx) => (
          <div key={topic.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{topic.title}</h3>
                  <p className="text-slate-600 mb-4">{topic.summary}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    {topic.links.map((link, i) => (
                      <button 
                        key={i} 
                        onClick={() => setPlayingVideo({ url: link.url, title: topic.title })}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors text-sm font-medium group"
                      >
                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-teal-900">Module Quiz</h3>
          <p className="text-teal-700">Ready to test your knowledge on this module?</p>
        </div>
        <a 
          href={module.quizLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-sm font-bold transition-all"
        >
          Take Quiz <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {playingVideo && (
        <VideoModal 
          url={playingVideo.url} 
          title={playingVideo.title} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </div>
  );
};

// --- Layouts ---

interface LayoutProps {
  children?: React.ReactNode;
  user: UserType | null;
  role: 'admin' | 'user';
  onLogout: () => void;
}

const UserLayout = ({ children, user, role, onLogout }: LayoutProps) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role && user.role !== 'admin') return <Navigate to="/login" replace />; // Allow admin to see user view? No, strict sep for now

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UserTopBar user={user} onLogout={onLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Fortify Health. All rights reserved.</p>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
};

const AdminLayout = ({ children, user, onLogout }: { children?: React.ReactNode, user: UserType | null, onLogout: () => void }) => {
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AdminTopBar user={user} onLogout={onLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Fortify Health Admin Console</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  // Initialize modules from localStorage or fallback to constants
  const [modules, setModules] = useState<Module[]>(() => {
    const savedModules = localStorage.getItem('fh_modules');
    return savedModules ? JSON.parse(savedModules) : INITIAL_MODULES;
  });

  // Save modules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fh_modules', JSON.stringify(modules));
  }, [modules]);

  const [user, setUser] = useState<UserType | null>(null);
  
  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fh_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: UserType) => {
    setUser(newUser);
    localStorage.setItem('fh_current_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fh_current_user');
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/login" element={<AdminLoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
        
        {/* User Portal */}
        <Route path="/dashboard" element={
          <UserLayout user={user} role="user" onLogout={handleLogout}>
            <UserDashboard modules={modules} user={user} />
          </UserLayout>
        } />
        
        <Route path="/module/:id" element={
          <UserLayout user={user} role="user" onLogout={handleLogout}>
            <ModuleDetail modules={modules} />
          </UserLayout>
        } />

        {/* Admin Portal */}
        <Route path="/admin/dashboard" element={
          <AdminLayout user={user} onLogout={handleLogout}>
            <AdminDashboard modules={modules} setModules={setModules} />
          </AdminLayout>
        } />

        {/* Default Redirect */}
        <Route path="/" element={
          user 
            ? (user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />) 
            : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
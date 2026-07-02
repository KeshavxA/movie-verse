import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { User, Mail, Calendar, Settings, Film } from "lucide-react";

const Profile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-10 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black mb-10 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Your Profile
        </h1>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-blue-500">
                  <User size={48} className="text-blue-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400 mb-2">
                <Mail size={16} />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400">
                <Calendar size={16} />
                <span>Joined: {new Date(currentUser.metadata.creationTime).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors border border-slate-200 dark:border-slate-700">
                <Settings size={18} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Film className="text-blue-500" /> Watch Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-black text-blue-500 mb-2">--</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Movies Watched</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-black text-purple-500 mb-2">--</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">TV Shows Watched</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-black text-green-500 mb-2">--</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Total Watch Hours</div>
          </div>
        </div>
        <div className="mt-8 text-center text-slate-500 text-sm">
          Detailed analytics dashboard coming soon...
        </div>
      </div>
    </div>
  );
};

export default Profile;

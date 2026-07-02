import { useState, useEffect } from "react";
import { useSocial } from "../hooks/useSocial";
import { useAuth } from "../context/AuthContext";
import { Search, UserPlus, UserCheck, Activity, Users, Film } from "lucide-react";
import { Link } from "react-router-dom";

const Network = () => {
    const { currentUser } = useAuth();
    const { following, feed, loadingFeed, searchUsers, toggleFollow } = useSocial();
    
    const [activeTab, setActiveTab] = useState("feed"); // "feed" | "search"
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const doSearch = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            const results = await searchUsers(searchQuery);
            setSearchResults(results);
            setIsSearching(false);
        };
        
        const timeoutId = setTimeout(doSearch, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Sign in to access Network</h2>
                    <p className="text-slate-500">Follow your friends and see what they are watching.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
                        <Users className="text-blue-500" size={40} />
                        Network
                    </h1>
                    
                    <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab("feed")}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "feed" ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <Activity size={16} />
                            Activity Feed
                        </button>
                        <button
                            onClick={() => setActiveTab("search")}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === "search" ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <Search size={16} />
                            Find Friends
                        </button>
                    </div>
                </div>

                {activeTab === "search" && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl mb-10">
                        <div className="relative mb-6">
                            <Search size={20} className="absolute left-4 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users by name (case-sensitive)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-lg"
                            />
                        </div>

                        {isSearching ? (
                            <div className="text-center py-8 text-slate-500 font-medium">Searching...</div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-4">
                                {searchResults.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xl">
                                                    {(user.displayName || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white">{user.displayName}</h3>
                                                <p className="text-xs text-slate-500 font-medium">Joined MovieVerse</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFollow(user.id)}
                                            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                                                following.includes(user.id) 
                                                ? 'bg-slate-200 hover:bg-red-100 hover:text-red-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-red-900/30' 
                                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                                            }`}
                                        >
                                            {following.includes(user.id) ? (
                                                <><UserCheck size={16} /> Following</>
                                            ) : (
                                                <><UserPlus size={16} /> Follow</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : searchQuery.length >= 2 ? (
                            <div className="text-center py-8 text-slate-500 font-medium">No users found for "{searchQuery}"</div>
                        ) : (
                            <div className="text-center py-8 text-slate-500 font-medium">Type at least 2 characters to search.</div>
                        )}
                    </div>
                )}

                {activeTab === "feed" && (
                    <div className="space-y-6">
                        {loadingFeed ? (
                            <div className="text-center py-12 text-slate-500 font-medium">Loading feed...</div>
                        ) : feed.length > 0 ? (
                            feed.map(activity => (
                                <div key={activity.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex gap-4 transition-all hover:shadow-lg">
                                    {activity.userPhotoURL ? (
                                        <img src={activity.userPhotoURL} alt={activity.userDisplayName} className="w-12 h-12 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                                            {(activity.userDisplayName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 flex-wrap mb-2">
                                            <span className="font-bold text-slate-900 dark:text-white text-lg">{activity.userDisplayName}</span>
                                            <span className="text-slate-500 font-medium">
                                                {activity.type === 'added_to_watchlist' ? 'added a title to' : 'reviewed'}
                                            </span>
                                            {activity.type === 'added_to_watchlist' && (
                                                <span className="font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">{activity.playlistName}</span>
                                            )}
                                            {activity.createdAt && typeof activity.createdAt.toDate === 'function' && (
                                                <span className="text-xs font-semibold text-slate-400 ml-auto">
                                                    {new Date(activity.createdAt.toDate()).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <Link to={`/${activity.mediaType}/${activity.mediaId}`} className="block mt-4 group">
                                            <div className="flex bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors group-hover:border-blue-500/50">
                                                {activity.mediaPoster ? (
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w200${activity.mediaPoster}`} 
                                                        alt={activity.mediaTitle}
                                                        className="w-24 h-36 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-36 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                                        <Film size={24} className="text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="p-4 flex flex-col justify-center">
                                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                                                        {activity.mediaTitle}
                                                    </h4>
                                                    <span className="text-sm font-bold tracking-widest text-slate-500 uppercase mt-2">
                                                        {activity.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <Activity className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Your feed is quiet</h3>
                                <p className="text-slate-500 font-medium mb-6 max-w-sm mx-auto">
                                    Follow some friends to see what they are watching and adding to their lists!
                                </p>
                                <button 
                                    onClick={() => setActiveTab("search")}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    Find Friends
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Network;

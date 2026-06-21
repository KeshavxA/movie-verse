import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

const AddToPlaylistModal = () => {
  const { 
    modalItem, 
    closeModal, 
    playlists, 
    createPlaylist, 
    addToPlaylist, 
    removeFromPlaylist, 
    isInPlaylist 
  } = useWatchlist();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!modalItem) return null;

  const handleToggle = (playlistId) => {
    if (isInPlaylist(modalItem.id, playlistId)) {
      removeFromPlaylist(modalItem.id, playlistId);
    } else {
      addToPlaylist(modalItem, playlistId);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const newId = createPlaylist(newPlaylistName.trim());
      addToPlaylist(modalItem, newId);
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeModal}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            Save to Collection
          </h3>
          <button 
            onClick={closeModal}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex gap-4 items-center border-b border-slate-100 dark:border-slate-800/50">
          <img 
            src={modalItem.poster_path ? `https://image.tmdb.org/t/p/w200${modalItem.poster_path}` : "https://via.placeholder.com/200x300?text=No+Poster"} 
            alt={modalItem.title || modalItem.name} 
            className="w-12 h-16 object-cover rounded-md shadow-sm"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{modalItem.title || modalItem.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{modalItem.media_type || 'Movie'}</p>
          </div>
        </div>

        <div className="p-2 overflow-y-auto flex-1">
          {playlists.map(playlist => (
            <label 
              key={playlist.id} 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isInPlaylist(modalItem.id, playlist.id)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                }`}>
                  {isInPlaylist(modalItem.id, playlist.id) && <Check size={14} className="text-white" />}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">{playlist.name}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          {isCreating ? (
            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Collection name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
              <button 
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Create
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
            >
              <Plus size={18} /> New Collection
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AddToPlaylistModal;

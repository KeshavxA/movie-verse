import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const useWatchlist = () => {
  return useContext(WatchlistContext);
};

export const WatchlistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
    try {
      const stored = localStorage.getItem("movieverse_playlists");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migration: If it's the old flat array format, convert to the new object format
        if (Array.isArray(parsed) && (parsed.length === 0 || parsed[0].id)) {
          // Wait, an old item has an 'id'. Let's check if the first item has 'items'. If not, it's the old format.
          if (parsed.length > 0 && !parsed[0].items) {
            return [{ id: 'default', name: 'Watchlist', items: parsed }];
          }
          if (parsed.length === 0) {
            return [{ id: 'default', name: 'Watchlist', items: [] }];
          }
          return parsed;
        }
      }
      return [{ id: 'default', name: 'Watchlist', items: [] }];
    } catch (error) {
      console.error("Failed to parse playlists from local storage", error);
      return [{ id: 'default', name: 'Watchlist', items: [] }];
    }
  });

  const [modalItem, setModalItem] = useState(null); // Item currently selected to add to a playlist

  useEffect(() => {
    localStorage.setItem("movieverse_playlists", JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name) => {
    const newId = Date.now().toString();
    setPlaylists(prev => [...prev, { id: newId, name, items: [] }]);
    return newId;
  };

  const deletePlaylist = (id) => {
    if (id === 'default') return; // Cannot delete the default watchlist
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const addToPlaylist = (item, playlistId) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (!p.items.find(m => m.id === item.id)) {
          return { ...p, items: [...p.items, item] };
        }
      }
      return p;
    }));
  };

  const removeFromPlaylist = (itemId, playlistId) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, items: p.items.filter(m => m.id !== itemId) };
      }
      return p;
    }));
  };

  const isInPlaylist = (itemId, playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist ? playlist.items.some(m => m.id === itemId) : false;
  };

  const isInAnyPlaylist = (itemId) => {
    return playlists.some(p => p.items.some(m => m.id === itemId));
  };

  // Backwards compatibility for components that haven't been updated yet
  const watchlist = playlists.find(p => p.id === 'default')?.items || [];
  const isInWatchlist = (itemId) => isInPlaylist(itemId, 'default');
  const toggleWatchlist = (item) => {
    // Instead of directly toggling, we now open the modal
    openModal(item);
  };

  const openModal = (item) => setModalItem(item);
  const closeModal = () => setModalItem(null);

  const value = {
    playlists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    isInPlaylist,
    isInAnyPlaylist,
    modalItem,
    openModal,
    closeModal,
    // Legacy support
    watchlist,
    isInWatchlist,
    toggleWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

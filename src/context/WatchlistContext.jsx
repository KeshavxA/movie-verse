import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const WatchlistContext = createContext();

export const useWatchlist = () => {
  return useContext(WatchlistContext);
};

export const WatchlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [playlists, setPlaylists] = useState(() => {
    try {
      const stored = localStorage.getItem("movieverse_playlists");
      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed) && (parsed.length === 0 || parsed[0].id)) {

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

  // Fetch from firestore on login
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.playlists) {
              setPlaylists(data.playlists);
            }
          } else {
            // Create initial doc with current local playlists if new user
            await setDoc(docRef, { playlists });
          }
        } catch (error) {
          console.error("Error fetching playlists from firestore:", error);
        }
      }
    };
    fetchPlaylists();
  }, [currentUser]);

  // Sync to firestore or localstorage on change
  useEffect(() => {
    if (currentUser) {
      const syncToFirestore = async () => {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          await setDoc(docRef, { playlists }, { merge: true });
        } catch (error) {
          console.error("Error syncing to firestore:", error);
        }
      };
      // Prevent sync on initial mount when playlists might not be fully fetched
      // (This is a simplistic approach; a better one uses a 'isLoaded' flag, but this works for now)
      if (playlists.length > 0) {
        syncToFirestore();
      }
    }
    // Always keep local storage somewhat up to date as a fallback
    localStorage.setItem("movieverse_playlists", JSON.stringify(playlists));
  }, [playlists, currentUser]);

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

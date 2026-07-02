import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export const useSocial = () => {
    const { currentUser } = useAuth();
    const [following, setFollowing] = useState([]);
    const [feed, setFeed] = useState([]);
    const [loadingFeed, setLoadingFeed] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setFollowing([]);
            setFeed([]);
            setLoadingFeed(false);
            return;
        }

        const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFollowing(data.following || []);
            } else {
                setFollowing([]);
            }
        });

        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser || following.length === 0) {
            setFeed([]);
            setLoadingFeed(false);
            return;
        }

        setLoadingFeed(true);

        const chunk = following.slice(0, 30);
        const q = query(
            collection(db, "activities"),
            where("userId", "in", chunk),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activities = [];
            snapshot.forEach((doc) => {
                activities.push({ id: doc.id, ...doc.data() });
            });
            setFeed(activities);
            setLoadingFeed(false);
        });

        return unsubscribe;
    }, [following, currentUser]);

    const searchUsers = async (searchTerm) => {
        if (!searchTerm.trim()) return [];

        try {
            const usersRef = collection(db, "users");

            const q = query(
                usersRef,
                where("displayName", ">=", searchTerm),
                where("displayName", "<=", searchTerm + '\uf8ff'),
                limit(20)
            );
            const snapshot = await getDocs(q);
            const results = [];
            snapshot.forEach(doc => {
                if (doc.id !== currentUser?.uid) {
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
            return results;
        } catch (error) {
            console.error("Error searching users:", error);
            return [];
        }
    };

    const toggleFollow = async (targetUserId) => {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        const isFollowing = following.includes(targetUserId);

        try {
            if (isFollowing) {
                await updateDoc(userRef, {
                    following: arrayRemove(targetUserId)
                });
            } else {
                await updateDoc(userRef, {
                    following: arrayUnion(targetUserId)
                });
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    return {
        following,
        feed,
        loadingFeed,
        searchUsers,
        toggleFollow
    };
};

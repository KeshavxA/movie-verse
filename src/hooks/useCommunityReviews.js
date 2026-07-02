import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export const useCommunityReviews = (mediaId, mediaType) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!mediaId || !mediaType) return;

    const q = query(
      collection(db, "reviews"),
      where("mediaId", "==", String(mediaId)),
      where("mediaType", "==", mediaType),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = [];
      let totalRating = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({ id: doc.id, ...data });
        totalRating += data.rating;
      });

      setReviews(fetchedReviews);
      
      if (fetchedReviews.length > 0) {
        setAverageRating(totalRating / fetchedReviews.length);
      } else {
        setAverageRating(0);
      }
      
      setLoading(false);
    }, (err) => {
      console.error("Error fetching community reviews:", err);
      setLoading(false);
    });

    return unsubscribe;
  }, [mediaId, mediaType]);

  const addReview = async (rating, content) => {
    if (!currentUser) throw new Error("Must be logged in to review");
    if (!rating || rating < 1 || rating > 5) throw new Error("Invalid rating");

    const reviewId = `${mediaType}_${mediaId}_${currentUser.uid}`;
    const reviewRef = doc(db, "reviews", reviewId);

    await setDoc(reviewRef, {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email.split('@')[0],
      userPhoto: currentUser.photoURL || null,
      mediaId: String(mediaId),
      mediaType,
      rating,
      content,
      createdAt: serverTimestamp()
    });
  };

  return { reviews, averageRating, loading, addReview };
};

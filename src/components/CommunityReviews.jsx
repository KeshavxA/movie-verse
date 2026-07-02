import { useState } from "react";
import { Star, MessageSquare, User, Send, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCommunityReviews } from "../hooks/useCommunityReviews";

const CommunityReviews = ({ mediaId, mediaType }) => {
  const { currentUser } = useAuth();
  const { reviews, loading, addReview } = useCommunityReviews(mediaId, mediaType);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (content.trim().length < 10) {
      setError("Review must be at least 10 characters long.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await addReview(rating, content);
      setRating(0);
      setContent("");
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 mb-10">
      <h2 className="text-xl font-bold mb-6 border-l-4 border-blue-500 pl-3 uppercase tracking-widest text-sm flex items-center gap-2">
        <MessageSquare size={20} className="text-blue-500" /> MovieVerse Community Reviews
      </h2>

      {/* Write a Review Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md mb-8">
        {!currentUser ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Want to share your thoughts?</h3>
            <p className="text-slate-500 mb-4">Sign in to write a review and rate this {mediaType === 'movie' ? 'movie' : 'TV show'}.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-colors">
              Sign In (Use Navbar)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              Write your review
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={28} 
                      className={`${
                        (hoverRating || rating) >= star 
                          ? "text-yellow-500 fill-yellow-500 drop-shadow-md" 
                          : "text-slate-300 dark:text-slate-700"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Review</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you think?"
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Post Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List of Reviews */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4 mb-3">
                {review.userPhoto ? (
                  <img src={review.userPhoto} alt={review.userName} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 border border-blue-200 dark:border-slate-700">
                    <User size={24} />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{review.userName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-0.5 rounded text-xs font-bold">
                      <Star size={12} fill="currentColor" />
                      <span>{review.rating.toFixed(1)}</span>
                    </div>
                    {review.createdAt && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {review.createdAt.toDate().toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-16">
                {review.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <MessageSquare size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">No community reviews yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityReviews;

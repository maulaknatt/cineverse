"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, StarHalf, Heart, MessageSquare, AlertTriangle, Edit3, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { formatRelativeTime } from "@/utils/format";
import { CommentDrawer } from "./comment-drawer";

interface User {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  level: number;
}

interface Review {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  rating: number;
  content: string;
  hasSpoiler: boolean;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  createdAt: string;
  user: User;
}

interface ReviewSectionProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
}

export function ReviewSection({ tmdbId, mediaType }: ReviewSectionProps) {
  const { userId } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  
  // Comment drawer states
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [tmdbId, mediaType]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews?tmdbId=${tmdbId}&mediaType=${mediaType}`);
      if (res.ok) {
        const data = await res.json();
        const allReviews = data.reviews || [];
        setReviews(allReviews);

        // Find current user's review if they are logged in
        if (userId) {
          const userRev = allReviews.find((r: Review) => r.user.id === userId || r.userId === userId);
          if (userRev) {
            setMyReview(userRev);
            setRating(userRev.rating);
            setContent(userRev.content);
            setHasSpoiler(userRev.hasSpoiler);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please sign in to write a review!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating!");
      return;
    }

    if (!content.trim()) {
      toast.error("Review content cannot be empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId,
          mediaType,
          rating,
          content,
          hasSpoiler,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(myReview ? "Review updated!" : "Review posted!");
        if (data.xpGained > 0) {
          toast.success(`Earned +${data.xpGained} XP! Level: ${data.currentLevel}`);
        }
        setIsEditing(false);
        fetchReviews();
      } else {
        toast.error("Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbId, mediaType }),
      });

      if (res.ok) {
        toast.success("Review deleted!");
        setMyReview(null);
        setRating(0);
        setContent("");
        setHasSpoiler(false);
        setIsEditing(false);
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleToggleLike = async (reviewId: string, isLiked: boolean) => {
    if (!userId) {
      toast.error("Please sign in to like reviews!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    // Optimistic Update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              isLiked: !isLiked,
              likesCount: isLiked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );
    if (myReview && myReview.id === reviewId) {
      setMyReview((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !isLiked,
              likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
            }
          : null
      );
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (!res.ok) {
        // Rollback
        fetchReviews();
        toast.error("Failed to like review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCommentDrawer = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsCommentDrawerOpen(true);
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  // Star Renderer Helper
  const renderStars = (val: number, interactive = false, size = "md") => {
    const stars = [];
    const sizeClass = size === "lg" ? "w-6 h-6" : size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
    
    for (let i = 1; i <= 5; i++) {
      const isHalf = val === i - 0.5;
      const isFull = val >= i;

      if (interactive) {
        stars.push(
          <div key={i} className="relative cursor-pointer shrink-0">
            {/* Left half target */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHoverRating(i - 0.5)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(i - 0.5)}
            />
            {/* Right half target */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(i)}
            />

            {isFull ? (
              <Star className={cn("text-yellow-400 fill-yellow-400", sizeClass)} />
            ) : isHalf ? (
              <StarHalf className={cn("text-yellow-400 fill-yellow-400 absolute left-0 top-0", sizeClass)} />
            ) : (
              <Star className={cn("text-zinc-600", sizeClass)} />
            )}
            {isHalf && <Star className={cn("text-zinc-600", sizeClass)} />}
          </div>
        );
      } else {
        stars.push(
          <div key={i} className="relative shrink-0">
            {isFull ? (
              <Star className={cn("text-yellow-400 fill-yellow-400", sizeClass)} />
            ) : isHalf ? (
              <StarHalf className={cn("text-yellow-400 fill-yellow-400 absolute left-0 top-0", sizeClass)} />
            ) : (
              <Star className={cn("text-zinc-700", sizeClass)} />
            )}
            {isHalf && <Star className={cn("text-zinc-700", sizeClass)} />}
          </div>
        );
      }
    }
    return <div className="flex gap-0.5 items-center">{stars}</div>;
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-16 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Community Reviews</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Read what other CineVerse members think about this title.
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-3 glass border-white/10 px-4 py-2 rounded-xl shrink-0">
            <span className="text-zinc-400 text-sm font-semibold">User Rating:</span>
            <div className="flex items-center gap-1.5">
              {renderStars(Math.round(averageRating * 2) / 2, false, "md")}
              <span className="text-white font-bold text-sm">
                {averageRating.toFixed(1)} / 5.0
              </span>
            </div>
            <span className="text-zinc-500 text-xs font-medium">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {/* Review Form or Edit Prompt */}
      {userId && myReview && !isEditing ? (
        <div className="glass border-white/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Your Review Added
            </span>
            <h4 className="font-semibold text-white text-sm">You rated this film:</h4>
            <div className="flex items-center gap-2">
              {renderStars(myReview.rating, false, "sm")}
              <span className="text-zinc-300 text-xs font-semibold">{myReview.rating.toFixed(1)} Stars</span>
            </div>
            <p className="text-zinc-400 text-xs line-clamp-2 italic max-w-xl">
              &quot;{myReview.content}&quot;
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs text-white font-semibold glass border-white/10 hover:bg-white/5 hover:border-white/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Review
            </button>
            <button
              onClick={handleDeleteReview}
              className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      ) : (
        (!myReview || isEditing) && (
          <form onSubmit={handlePostReview} className="glass border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-bold text-white text-base">
                {isEditing ? "Edit Your Review" : "Write a Review"}
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Rating Star Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Your Rating</label>
              <div className="flex items-center gap-3">
                {renderStars(activeRating, true, "lg")}
                {activeRating > 0 && (
                  <span className="text-yellow-400 font-bold text-sm">
                    {activeRating.toFixed(1)} Stars
                  </span>
                )}
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Your Review</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you think of this movie? Write a helpful review..."
                rows={4}
                className="w-full bg-[#18181B] text-zinc-200 text-sm placeholder-zinc-600 rounded-xl p-4 border border-white/10 outline-none focus:border-[#E50914]/40 transition-colors resize-y"
                required
              />
            </div>

            {/* Options Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Spoiler Toggle */}
              <label className="flex items-center gap-2 cursor-pointer group text-xs text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={hasSpoiler}
                  onChange={(e) => setHasSpoiler(e.target.checked)}
                  className="w-4 h-4 accent-[#E50914] rounded border-white/10 bg-zinc-800"
                />
                <span className="group-hover:text-zinc-200 transition-colors">
                  This review contains spoilers
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b20710] disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-[#E50914]/15 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        )
      )}

      {/* Review List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
            <p className="text-zinc-500 text-sm">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => {
            const hasSpoilerVisible = review.hasSpoiler && !revealedSpoilers[review.id];

            return (
              <div key={review.id} className="glass border-white/10 rounded-2xl p-5 md:p-6 space-y-4 relative overflow-hidden">
                {/* Background glow for high rated reviews */}
                {review.rating >= 4.5 && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/[0.02] rounded-full blur-[30px] pointer-events-none" />
                )}

                {/* Review User Info Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    {/* User Avatar with follow profile link */}
                    <Link
                      href={`/users/${review.user.username}`}
                      className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-[#E50914]/20 hover:border-[#E50914] transition-colors"
                    >
                      {review.user.avatarUrl ? (
                        <Image
                          src={review.user.avatarUrl}
                          alt={review.user.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm text-zinc-400 bg-zinc-800">
                          {review.user.username[0].toUpperCase()}
                        </div>
                      )}
                    </Link>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                          href={`/users/${review.user.username}`}
                          className="font-bold text-white hover:text-[#E50914] transition-colors text-sm"
                        >
                          {review.user.name || review.user.username}
                        </Link>
                        <span className="text-xs text-zinc-500 font-medium">@{review.user.username}</span>
                        <span className="text-[10px] bg-[#E50914]/20 text-[#E50914] px-1.5 py-0.5 rounded-full font-bold">
                          Lv.{review.user.level}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, false, "sm")}
                        <span className="text-zinc-500 text-[10px]">•</span>
                        <span className="text-zinc-500 text-[10px] font-medium">
                          {formatRelativeTime(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {review.hasSpoiler && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-3 h-3" />
                      Spoiler
                    </div>
                  )}
                </div>

                {/* Review Text Content */}
                <div className="space-y-3">
                  <p
                    className={cn(
                      "text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300",
                      hasSpoilerVisible && "blur-md select-none pointer-events-none"
                    )}
                  >
                    {review.content}
                  </p>

                  {hasSpoilerVisible && (
                    <button
                      onClick={() =>
                        setRevealedSpoilers((prev) => ({ ...prev, [review.id]: true }))
                      }
                      className="text-xs font-semibold text-[#E50914] bg-[#E50914]/10 hover:bg-[#E50914]/20 border border-[#E50914]/20 hover:border-[#E50914]/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      ⚠️ Reveal Spoiler Review
                    </button>
                  )}
                </div>

                {/* Actions (Like, Comment counts) */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-zinc-500">
                  {/* Like Button */}
                  <button
                    onClick={() => handleToggleLike(review.id, review.isLiked)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors",
                      review.isLiked ? "text-[#E50914]" : "hover:text-white"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", review.isLiked && "fill-current")} />
                    <span>{review.likesCount} likes</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => openCommentDrawer(review.id)}
                    className="flex items-center gap-1.5 text-xs font-medium hover:text-white cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{review.commentsCount} comments</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 glass border-white/10 rounded-2xl text-zinc-500">
            <span className="text-5xl block mb-4">✍️</span>
            <h3 className="font-semibold text-white mb-1">No reviews yet</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Be the first to share your rating and review for this movie!
            </p>
          </div>
        )}
      </div>

      {/* Comment Slide-over Drawer */}
      <CommentDrawer
        reviewId={selectedReviewId}
        isOpen={isCommentDrawerOpen}
        onClose={() => {
          setIsCommentDrawerOpen(false);
          setSelectedReviewId(null);
          fetchReviews(); // Refresh review comment counts
        }}
        onCommentsCountChange={() => {
          // Instantly refresh list when comment count changes in drawer
          fetchReviews();
        }}
      />
    </div>
  );
}

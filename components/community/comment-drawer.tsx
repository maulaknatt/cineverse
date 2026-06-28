"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Heart, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";

interface User {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  level: number;
}

interface Comment {
  id: string;
  userId: string;
  reviewId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  user: User;
  isLiked: boolean;
  likesCount: number;
}

interface CommentDrawerProps {
  reviewId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCommentsCountChange?: (count: number) => void;
}

export function CommentDrawer({
  reviewId,
  isOpen,
  onClose,
  onCommentsCountChange,
}: CommentDrawerProps) {
  const { userId } = useAuth();
  const router = useRouter();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && reviewId) {
      fetchComments();
    }
  }, [isOpen, reviewId]);

  useEffect(() => {
    if (comments.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const fetchComments = async () => {
    if (!reviewId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting || !reviewId) return;

    if (!userId) {
      toast.error("Please sign in to post a comment!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
        toast.success("Comment added!");
        if (data.xpGained > 0) {
          toast.success(`Earned +${data.xpGained} XP!`);
        }
        if (onCommentsCountChange) {
          onCommentsCountChange(comments.length + 1);
        }
      } else {
        toast.error("Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string, isLiked: boolean) => {
    if (!userId) {
      toast.error("Please sign in to like comments!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    // Optimistic Update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !isLiked,
              likesCount: isLiked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c
      )
    );

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (!res.ok) {
        // Rollback on error
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  isLiked: isLiked,
                  likesCount: isLiked ? c.likesCount + 1 : c.likesCount - 1,
                }
              : c
          )
        );
        toast.error("Failed to update like");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          {/* Drawer Slide Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/60 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#E50914]" />
                <h3 className="font-bold text-white text-base">Comments ({comments.length})</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2">
                  <Loader2 className="w-7 h-7 text-[#E50914] animate-spin" />
                  <p className="text-zinc-500 text-xs font-medium">Loading comments...</p>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 text-sm items-start">
                    {/* User Avatar */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                      {comment.user.avatarUrl ? (
                        <Image
                          src={comment.user.avatarUrl}
                          alt={comment.user.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-zinc-400 bg-zinc-800">
                          {comment.user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Comment Body */}
                    <div className="flex-1 min-w-0 bg-white/5 border border-white/5 rounded-2xl p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-white text-xs">
                            {comment.user.name || comment.user.username}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            @{comment.user.username}
                          </span>
                          <span className="text-[10px] bg-[#E50914]/20 text-[#E50914] px-1.5 py-0.5 rounded-full font-bold">
                            Lv.{comment.user.level}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      {/* Like button for comment */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleToggleLike(comment.id, comment.isLiked)}
                          className={cn(
                            "flex items-center gap-1 text-[10px] font-medium cursor-pointer transition-colors",
                            comment.isLiked ? "text-[#E50914]" : "text-zinc-500 hover:text-white"
                          )}
                        >
                          <Heart className={cn("w-3.5 h-3.5", comment.isLiked && "fill-current")} />
                          <span>{comment.likesCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
                  <span className="text-3xl block mb-2">💬</span>
                  <p className="text-xs font-semibold text-zinc-400">No comments yet</p>
                  <p className="text-[11px] text-zinc-500 max-w-[200px] mt-0.5">
                    Be the first to share your thoughts on this review!
                  </p>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handlePostComment}
              className="p-4 border-t border-white/10 bg-zinc-900/40"
            >
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a reply..."
                  className="flex-1 bg-zinc-800 text-xs text-white placeholder-zinc-500 rounded-xl px-3 py-2.5 outline-none border border-white/10 focus:border-[#E50914]/40 transition-colors"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="w-10 h-10 bg-[#E50914] hover:bg-[#b20710] disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

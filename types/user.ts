import type { MediaType } from "./tmdb";

export interface User {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  level: number;
  xp: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  rating: number;
  content: string;
  hasSpoiler: boolean;
  imageUrl: string | null;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: Pick<User, "id" | "username" | "name" | "avatarUrl" | "level">;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  status: WatchlistStatus;
  isPrivate: boolean;
  addedAt: Date;
}

export type WatchlistStatus =
  | "WATCHING"
  | "COMPLETED"
  | "DROPPED"
  | "PLAN_TO_WATCH";

export interface Favorite {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  addedAt: Date;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: CollectionItem[];
  _count?: { items: number };
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  tmdbId: number;
  mediaType: MediaType;
  order: number;
  addedAt: Date;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  iconUrl: string | null;
  xpReward: number;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  achievement?: Achievement;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType =
  | "REVIEW_LIKED"
  | "FRIEND_FOLLOWED"
  | "MOVIE_RELEASED"
  | "AI_SUGGESTION"
  | "WATCH_REMINDER"
  | "ACHIEVEMENT_UNLOCKED"
  | "COMMENT_REPLIED";

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface UserStats {
  totalReviews: number;
  totalWatchlistItems: number;
  totalFavorites: number;
  totalFollowers: number;
  totalFollowing: number;
  totalCollections: number;
  completedMovies: number;
}

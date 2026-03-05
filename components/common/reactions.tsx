"use client";

import { useEffect, useState } from "react";
import { Heart, HeartOff } from "lucide-react";

interface ReactionsProps {
  contentId: string;
  initialLikes?: number;
  initialDislikes?: number;
}

export default function Reactions({ contentId, initialLikes = 0, initialDislikes = 0 }: ReactionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(null);
  const [loading, setLoading] = useState(false);

  // Загружаем реакции при монтировании
  useEffect(() => {
    async function fetchReactions() {
      try {
        const res = await fetch(`/api/reactions?contentId=${contentId}`);
        const data = await res.json();
        if (data.success) {
          setLikes(data.data.likes);
          setDislikes(data.data.dislikes);
        }
      } catch (e) {
        console.error("Failed to fetch reactions:", e);
      }
    }
    fetchReactions();
  }, [contentId]);

  const handleReaction = async (isLike: boolean) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, isLike }),
      });
      const data = await res.json();
      if (data.success) {
        setLikes(data.data.likes);
        setDislikes(data.data.dislikes);
        setUserReaction(data.data.reaction ? (isLike ? "like" : "dislike") : null);
      }
    } catch (e) {
      console.error("Failed to set reaction:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleReaction(true)}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          userReaction === "like"
            ? "bg-[#2A9D8F]/10 text-[#2A9D8F]"
            : "text-[#6C757D] hover:text-[#2A9D8F] hover:bg-gray-100"
        }`}
      >
        {userReaction === "like" ? (
          <Heart className="w-5 h-5 fill-current" />
        ) : (
          <HeartOff className="w-5 h-5" />
        )}
        <span className="text-sm">{likes}</span>
      </button>

      <button
        onClick={() => handleReaction(false)}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          userReaction === "dislike"
            ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
            : "text-[#6C757D] hover:text-[#FF6B6B] hover:bg-gray-100"
        }`}
      >
        <span className="text-lg">👎</span>
        <span className="text-sm">{dislikes}</span>
      </button>
    </div>
  );
}

"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  contentId: string;
}

export default function ViewTracker({ contentId }: ViewTrackerProps) {
  useEffect(() => {
    // Записываем просмотр при загрузке страницы
    async function trackView() {
      try {
        await fetch("/api/user/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentId }),
        });
      } catch (e) {
        console.error("Failed to track view:", e);
      }
    }
    trackView();
  }, [contentId]);

  return null; // Компонент ничего не рендерит
}

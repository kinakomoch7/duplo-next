"use client";
import { useEffect, useState } from "react";

export const UpdateNotifier = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        registration.addEventListener("updatefound", () => {
          setIsUpdateAvailable(true);
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  return (
    isUpdateAvailable && (
      <div className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-lg">
        <p>新しいバージョンが利用可能です</p>
        <button onClick={handleUpdate} className="mt-2 bg-white text-blue-500 p-2 rounded">
          更新
        </button>
      </div>
    )
  );
};

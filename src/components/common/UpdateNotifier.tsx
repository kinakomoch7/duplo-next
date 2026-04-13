"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const UpdateNotifier = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasReloadedRef = useRef(false);
  const shouldReloadRef = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const onControllerChange = () => {
      if (hasReloadedRef.current || !shouldReloadRef.current) {
        return;
      }

      hasReloadedRef.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(registration.waiting);
        setIsUpdateAvailable(true);
      }

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setWaitingWorker(registration.waiting ?? installingWorker);
            setIsUpdateAvailable(true);
          }
        });
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (!waitingWorker) {
      return;
    }

    setIsUpdating(true);
    setIsUpdateAvailable(false);
    shouldReloadRef.current = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <AnimatePresence>
      {isUpdateAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-[60] w-[calc(100vw-2rem)] max-w-sm"
        >
          <Card className="border-slate-300 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  新しいバージョンがあります
                </p>
                <p className="text-sm text-slate-600">
                  更新すると、最新の内容がこの端末に反映されます。
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? "更新中..." : "更新する"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

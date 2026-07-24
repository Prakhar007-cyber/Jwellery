"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

/*
  Minimal toast system.
  A context exposes `toast(message)`. Toasts render bottom-centre,
  fade in/out, and auto-dismiss. Kept intentionally simple.
*/

type Toast = { id: number; message: string };
type ToastContextValue = (message: string) => void;

const ToastContext = createContext<ToastContextValue>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-8 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-full border border-line bg-ivory/95 px-6 py-3 text-espresso shadow-[0_10px_40px_-12px_rgba(42,33,27,0.35)] backdrop-blur"
            >
              <span className="eyebrow text-[0.68rem] tracking-[0.2em]">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

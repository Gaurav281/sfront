import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle, CheckCircle, Info, X } from 'lucide-react';
import { useAlertStore } from '../store/useAlertStore';

export default function CustomPopup() {
  const { 
    isOpen, 
    type, 
    title, 
    message, 
    onConfirm, 
    closeDialog, 
    toasts, 
    removeToast 
  } = useAlertStore();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeDialog();
  };

  return (
    <>
      {/* 1. TOAST NOTIFICATIONS DRAWER - TOP RIGHT */}
      <div className="fixed top-6 right-6 z-55 flex flex-col gap-3 w-full max-w-sm pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                className={`pointer-events-auto w-full p-4 rounded-xl border flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md ${
                  isSuccess 
                    ? 'bg-zinc-950/90 border-emerald-500/20 text-white' 
                    : isError 
                    ? 'bg-zinc-950/90 border-red-500/20 text-white' 
                    : 'bg-zinc-950/90 border-zinc-700/30 text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isSuccess ? (
                    <CheckCircle className="w-5 h-5 text-accent-green shrink-0" />
                  ) : isError ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  )}
                  <p className="text-xs font-semibold leading-relaxed truncate">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 2. ALERT & CONFIRM DIALOG MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={type === 'alert' ? closeDialog : undefined} // Clicking outside closes alerts
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Dialog Panel Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-sm bg-zinc-950 border border-zinc-700/80 p-6 rounded-2xl shadow-2xl relative z-10 space-y-5"
            >
              {/* Header Icon & Title */}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  type === 'confirm' 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300' 
                    : 'bg-accent-green/5 border-accent-green/10 text-accent-green'
                }`}>
                  {type === 'confirm' ? (
                    <HelpCircle className="w-5 h-5 text-accent-green" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-accent-green animate-pulse" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    {title || (type === 'confirm' ? 'Confirm Action' : 'Notice')}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-semibold">
                    {message}
                  </p>
                </div>
              </div>

              {/* Action Buttons panel */}
              <div className="flex justify-end gap-2.5 pt-2 text-[11px] font-bold">
                {type === 'confirm' ? (
                  <>
                    <button
                      onClick={closeDialog}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="px-5 py-2.5 bg-accent-green hover:bg-accent-green-hover text-black font-extrabold rounded-xl transition-all cursor-pointer"
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={closeDialog}
                    className="w-full px-5 py-2.5 bg-accent-green hover:bg-accent-green-hover text-black font-extrabold rounded-xl transition-all cursor-pointer text-center uppercase tracking-wider"
                  >
                    Okay
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

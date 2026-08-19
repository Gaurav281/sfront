import { create } from 'zustand';

export const useAlertStore = create((set) => ({
  // Custom dialog modal states
  isOpen: false,
  type: 'alert', // 'alert' or 'confirm'
  title: '',
  message: '',
  onConfirm: null,
  
  showAlert: (title, message) => set({
    isOpen: true,
    type: 'alert',
    title,
    message,
    onConfirm: null
  }),

  showConfirm: (title, message, onConfirm) => set({
    isOpen: true,
    type: 'confirm',
    title,
    message,
    onConfirm
  }),

  closeDialog: () => set({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  }),

  // Toast notifications states
  toasts: [],

  addToast: (message, type = 'success') => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 3000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  }))
}));

import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  cartOpen: false,

  addToCart: (item) => {
    const currentItems = get().items;
    const isAlreadyInCart = currentItems.some((i) => i._id === item._id);
    
    if (isAlreadyInCart) {
      return { success: false, message: 'Item already in cart' };
    }
    
    const updatedItems = [...currentItems, item];
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems, cartOpen: true }); // Open cart automatically on add
    return { success: true };
  },

  removeFromCart: (itemId) => {
    const currentItems = get().items;
    const updatedItems = currentItems.filter((item) => item._id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  setCartOpen: (isOpen) => set({ cartOpen: isOpen }),
  
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price, 0);
  }
}));

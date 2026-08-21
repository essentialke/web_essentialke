import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "./user";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    wishlistItems: [],
  }),
  getters: {
    wishlistItemCount: (state) => state.wishlistItems.length,
    isInWishlist: (state) => (productId) => {
      return state.wishlistItems.some((item) => item.productId === productId);
    },
  },
  actions: {
    async fetchWishlistItems() {
      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        try {
          const response = await axios.get("/wishlists");
          this.wishlistItems = response.data;
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      } else {
        this.wishlistItems = [];
      }
    },
    async addToWishlist(productId) {
      try {
        await axios.post("/wishlists", { productId });
        await this.fetchWishlistItems(); // Refresh the list
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    },
    async removeFromWishlist(productId) {
      try {
        await axios.delete(`/wishlists/${productId}`);
        await this.fetchWishlistItems(); // Refresh the list
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    },
  },
});

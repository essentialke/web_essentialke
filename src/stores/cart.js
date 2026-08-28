import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "./user";
import { useSnackbarStore } from "./snackbar";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [], // Array to store cart items
  }),
  getters: {
    cartItemCount: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    subtotal: (state) => {
      return state.cartItems.reduce(
        (total, item) => total + item.quantity * (
          Number(item.product?.salePrice) > 0 && Number(item.product?.salePrice) < Number(item.product?.price)
            ? Number(item.product.salePrice)
            : Number(item.product?.price || 0)
        ),
        0,
      );
    },
    total: (state) => {
      return state.subtotal;
    },
  },
  actions: {
    async fetchCartItems() {
      const userStore = useUserStore();

      // Check if user is authenticated
      if (!userStore.isAuthenticated) {
        // Redirect to login or show a login modal
        return;
      }
      try {
        const response = await axios.get("/cart");
        this.cartItems = response.data;
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    },
    async addToCart(product, quantity) {
      const userStore = useUserStore();
      const snackbarStore = useSnackbarStore();

      // Check if user is authenticated
      if (!userStore.isAuthenticated) {
        // Redirect to login or show a login modal
        return;
      }
      try {
        const response = await axios.post("/cart", {
          productId: product.id,
          quantity: quantity,
        });

        // Update local cartItems state for immediate UI update
        const existingItemIndex = this.cartItems.findIndex(
          (item) => item.productId === product.id,
        );
        if (existingItemIndex !== -1) {
          this.cartItems[existingItemIndex].quantity += quantity;
        } else {
          this.cartItems.push(response.data);
        }

        // Optionally, show a success message or update a notification
        // alert("Book added to cart successfully!");
      } catch (error) {
        console.error("Error adding to cart:", error);

        // Handle specific error scenarios
        if (error.response && error.response.status === 404) {
          snackbarStore.addSnackbar({
            message: "Book not found.",
            type: "error"
          });
        } else if (error.response && error.response.status === 400) {
          snackbarStore.addSnackbar({
            message: error.response.data.error,
            type: "error"
          });
        } else {
          snackbarStore.addSnackbar({
            message: "Failed to add product to cart. Please try again.",
            type: "error"
          });
        }
      }
    },
    async updateQuantity(cartItemId, quantity) {
      try {
        const response = await axios.put(`/cart/${cartItemId}`, {
          quantity,
        });

        // Update local cartItems state for immediate UI update
        const itemIndex = this.cartItems.findIndex(
          (item) => item.id === cartItemId,
        );
        if (itemIndex !== -1) {
          this.cartItems[itemIndex].quantity = quantity;
        }

        // Optionally, show a success message
        // alert("Cart item quantity updated!");
      } catch (error) {
        console.error("Error updating quantity:", error);
        snackbarStore.addSnackbar({
          message: "Failed to update quantity. Please try again.",
          type: "error"
        });
      }
    },
    async removeFromCart(cartItemId) {
      try {
        await axios.delete(`/cart/${cartItemId}`);
        // Update the cartItems state to reflect the removal
        this.cartItems = this.cartItems.filter(
          (item) => item.id !== cartItemId,
        );
      } catch (error) {
        console.error("Error removing item from cart:", error);
        // Handle error, possibly show an alert to the user
        snackbarStore.addSnackbar({
          message: "Failed to remove item from cart. Please try again.",
          type: "error"
        });
      }
    },
    clearCart() {
      this.cartItems = []; //  (or make an API request to clear the cart on the backend)
    },
  },
});

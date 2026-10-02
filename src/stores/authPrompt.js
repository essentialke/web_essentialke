import { defineStore } from "pinia";

export const useAuthPromptStore = defineStore("authPrompt", {
  state: () => ({
    isOpen: false,
    redirect: "/",
    productId: null,
    quantity: 1,
    color: null,
  }),
  actions: {
    open(redirect = "/", productId = null, quantity = 1, color = null) {
      this.redirect = redirect;
      this.productId = productId;
      this.quantity = quantity;
      this.color = color;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
});

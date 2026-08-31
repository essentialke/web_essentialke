import { defineStore } from "pinia";

export const useAuthPromptStore = defineStore("authPrompt", {
  state: () => ({
    isOpen: false,
    redirect: "/",
    productId: null,
    quantity: 1,
  }),
  actions: {
    open(redirect = "/", productId = null, quantity = 1) {
      this.redirect = redirect;
      this.productId = productId;
      this.quantity = quantity;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
});

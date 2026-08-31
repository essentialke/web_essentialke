import { defineStore } from "pinia";

export const useAuthPromptStore = defineStore("authPrompt", {
  state: () => ({
    isOpen: false,
    redirect: "/",
  }),
  actions: {
    open(redirect = "/") {
      this.redirect = redirect;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
});

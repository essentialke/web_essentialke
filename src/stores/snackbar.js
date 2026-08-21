import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("snackbar", {
  state: () => ({
    snackbars: [],
  }),
  actions: {
    addSnackbar({
      message,
      type = "info",
      timeout = 3000,
      dismissable = true,
    }) {
      const id = Date.now(); // Simple unique ID
      this.snackbars.push({
        id,
        message,
        type,
        timeout,
        dismissable,
      });

      if (!dismissable) {
        setTimeout(() => {
          this.dismissSnackbar(id);
        }, timeout);
      }
    },
    dismissSnackbar(id) {
      this.snackbars = this.snackbars.filter((s) => s.id !== id);
    },
  },
});

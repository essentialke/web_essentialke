import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    initialize() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwt_decode.jwtDecode(token);
          // Check if the token is expired
          const now = Date.now().valueOf() / 1000;
          if (typeof decoded.exp === "number" && decoded.exp < now) {
            console.error("Token expired:", error);
            this.logout();
          } else {
            // Set user data and authentication status
            this.isAuthenticated = true;
            this.user = {
              userId: decoded.userId,
              userType: decoded.userType,
              // Add other relevant user data from the token
            };
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          this.logout(); // Ensure user is logged out if token is invalid
        }
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post("/users/login", credentials);
        const { token } = response.data;
        localStorage.setItem("token", token);
        this.initialize();
        return true;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    async googleLogin(credential) {
      const response = await axios.post("/users/google", { credential });
      localStorage.setItem("token", response.data.token);
      this.initialize();
      return response.data;
    },
    logout() {
      localStorage.removeItem("token");
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./routes";
import "./style.css";
import App from "./App.vue";
import axios from "axios";
import { useUserStore } from "./stores/user";
import { useCartStore } from "./stores/cart";
import { useWishlistStore } from "./stores/wishlist";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useLoadingStore } from "./stores/loading";

import {
  faShoppingCart,
  faHeart,
  faUser,
  faTrash,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faTimes,
  faTachometerAlt,
  faUsers,
  faBook,
  faMoneyCheckAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faShoppingCart,
  faHeart,
  faUser,
  faTrash,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faTimes,
  faTachometerAlt,
  faUsers,
  faBook,
  faMoneyCheckAlt,
);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(
  (config) => {
    const loadingStore = useLoadingStore();
    loadingStore.startLoading();

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["x-tenant-id"] = `1`;
    return config;
  },
  (error) => {
    const loadingStore = useLoadingStore();
    loadingStore.stopLoading();
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    const loadingStore = useLoadingStore();
    loadingStore.stopLoading();
    return response;
  },
  (error) => {
    const loadingStore = useLoadingStore();
    loadingStore.stopLoading();
    return Promise.reject(error);
  },
);

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

const userStore = useUserStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

userStore.initialize();

// Other initializations
cartStore.fetchCartItems();
wishlistStore.fetchWishlistItems();

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

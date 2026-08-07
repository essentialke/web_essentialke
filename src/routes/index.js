import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AcceptInvitationView from "../views/AcceptInvitationView.vue";
import ProductView from "../views/ProductView.vue";
import ProductDetailsView from "../views/ProductDetailView.vue";
import VerifyEmailView from "../views/VerifyEmailView.vue";
import CartView from "../views/CartView.vue";
import WishListView from "../views/WishListView.vue";
import SearchView from "../views/SearchView.vue";
import GiftVoucherView from "../views/GiftVoucherView.vue";
import Checkout from "../views/CheckoutView.vue";
import BlogPosts from "../views/BlogPosts.vue";
import BlogDetail from "../views/BlogDetail.vue";
import AdminDynamicContent from "../views/admin/AdminDynamicContent.vue";

import DashboardLayout from "../views/user/DashboardLayout.vue";
import DashboardProfile from "../views/user/Profile.vue";
import DashboardSettings from "../views/user/Settings.vue";
import DashboardOrders from "../views/user/Orders.vue";
import DashboardGiftVouchers from "../views/user/GiftVouchers.vue";
import DynamicPageView from "../views/DynamicPageView.vue";
import NotFoundView from "../views/NotFoundView.vue";

import AdminLayout from "../views/admin/AdminLayout.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminProducts from "../views/admin/AdminProducts.vue";
import AdminTransactions from "@/views/admin/AdminTransactions.vue";
import AdminGiftVouchers from "@/views/admin/AdminGiftVouchers.vue";
import AdminGeneralPosts from "@/views/admin/AdminGeneralPosts.vue"; // Import AdminGeneralPosts
import AdminReviews from "@/views/admin/AdminReviews.vue"; // Import AdminReviews - assuming you have this as well
import AdminContentView from "@/views/admin/AdminContentView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/blog",
    name: "Blog",
    component: BlogPosts,
  },
  {
    path: "/blog/:id/:slug",
    name: "BlogDetail",
    component: BlogDetail,
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/accept-invitation/:token",
    name: "AcceptInvitation",
    component: AcceptInvitationView,
  },
  {
    path: "/verify-email/:token",
    name: "VerifyEmail",
    component: VerifyEmailView,
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartView,
    meta: { requiresAuth: true }, // Protect the cart route
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
    meta: { requiresAuth: true },
  },
  {
    path: "/gift-voucher",
    name: "Gift-Vouchers",
    component: GiftVoucherView,
  },
  {
    path: "/wishlist",
    name: "Wishlist",
    component: WishListView,
    meta: { requiresAuth: true }, // Require authentication for wishlist
  },
  {
    path: "/products",
    name: "Product",
    component: ProductView,
  },
  {
    path: "/search",
    name: "Search",
    component: SearchView,
    props: (route) => ({ searchQuery: route.query.q }),
  },
  {
    path: "/product/:id/:slug",
    name: "ProductDetails",
    component: ProductDetailsView,
    meta: {
      requiresAuth: false, // Requires auth only for borrowing, etc., not for viewing details
    },
    props: (route) => ({
      // Pass query params as props to the component
      ...route.query,
      id: route.params.id, // Ensure id is still passed as a prop
    }),
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "DashboardOrders",
        component: DashboardOrders,
      },
      {
        path: "profile",
        name: "DashboardProfile",
        component: DashboardProfile,
      },
      {
        path: "gift-vouchers",
        name: "GiftVouchers",
        component: DashboardGiftVouchers,
      },
      {
        path: "settings",
        name: "DashboardSettings",
        component: DashboardSettings,
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: "dashboard",
        component: AdminDashboard,
      },
      {
        path: "users",
        component: AdminUsers,
      },
      {
        path: "dynamic",
        component: AdminDynamicContent,
      },
      {
        path: "products",
        component: AdminProducts,
      },
      {
        path: "transactions",
        component: AdminTransactions,
      },
      {
        path: "gift-vouchers",
        component: AdminGiftVouchers,
      },

      {
        path: "general-posts",
        name: "AdminGeneralPosts",
        component: AdminGeneralPosts,
      },
      {
        path: "reviews",
        name: "AdminReviews",
        component: AdminReviews,
      },
      {
        path: "content",
        name: "AdminContent",
        component: AdminContentView,
      },
      {
        path: "", // Redirect to Library by default - adjusted as per your previous config
        redirect: "admin/products", // Corrected redirect path to "library" within /admin
      },
    ],
  },
  {
    path: "/page/:slug",
    name: "DynamicPage",
    component: DynamicPageView,
    // Optional metadata to indicate this is a dynamic page
    meta: {
      isDynamicPage: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  userStore.initialize();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!userStore.isAuthenticated) {
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (!userStore.isAuthenticated) {
      // Redirect to login if not authenticated for admin routes as well
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      });
    } else if (userStore.user?.userType !== "ADMIN") {
      // If authenticated but not admin, redirect to home or a "not authorized" page
      next({ name: "Home" }); // Or a dedicated "NotAuthorized" page
    } else {
      next(); // User is authenticated and admin, proceed
    }
  } else {
    next();
  }
});

export default router;

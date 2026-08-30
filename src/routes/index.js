import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

const HomeView = () => import("../views/HomeView.vue");
const AboutView = () => import("../views/AboutView.vue");
const LoginView = () => import("../views/LoginView.vue");
const RegisterView = () => import("../views/RegisterView.vue");
const AcceptInvitationView = () => import("../views/AcceptInvitationView.vue");
const ProductView = () => import("../views/ProductView.vue");
const ProductDetailsView = () => import("../views/ProductDetailView.vue");
const VerifyEmailView = () => import("../views/VerifyEmailView.vue");
const ForgotPasswordView = () => import("../views/ForgotPasswordView.vue");
const ResetPasswordView = () => import("../views/ResetPasswordView.vue");
const CartView = () => import("../views/CartView.vue");
const WishListView = () => import("../views/WishListView.vue");
const SearchView = () => import("../views/SearchView.vue");
const GiftingView = () => import("../views/GiftingView.vue");
const Checkout = () => import("../views/CheckoutView.vue");

const DashboardLayout = () => import("../views/user/DashboardLayout.vue");
const DashboardProfile = () => import("../views/user/Profile.vue");
const DashboardSettings = () => import("../views/user/Settings.vue");
const DashboardOrders = () => import("../views/user/Orders.vue");
const DynamicPageView = () => import("../views/DynamicPageView.vue");
const NotFoundView = () => import("../views/NotFoundView.vue");

const AdminLayout = () => import("../views/admin/AdminLayout.vue");
const AdminDashboard = () => import("../views/admin/AdminDashboard.vue");
const AdminProducts = () => import("../views/admin/AdminProducts.vue");
const AdminTransactions = () => import("@/views/admin/AdminTransactions.vue");
const AdminReviews = () => import("@/views/admin/AdminReviews.vue");
const AdminPaymentSettings = () => import("@/views/admin/AdminPaymentSettings.vue");
const AdminTestimonials = () => import("@/views/admin/AdminTestimonials.vue");
const AdminChangePasswordView = () => import("@/views/admin/AdminChangePasswordView.vue");
const AdminSubscribers = () => import("@/views/admin/AdminSubscribers.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
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
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordView,
  },
  {
    path: "/reset-password/:token",
    name: "ResetPassword",
    component: ResetPasswordView,
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
    path: "/gifting",
    name: "Gifting",
    component: GiftingView,
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
      { path: "subscribers", name: "AdminSubscribers", component: AdminSubscribers },
      {
        path: "products",
        component: AdminProducts,
      },
      {
        path: "transactions",
        component: AdminTransactions,
      },
      {
        path: "reviews",
        name: "AdminReviews",
        component: AdminReviews,
      },
      {
        path: "testimonials",
        name: "AdminTestimonials",
        component: AdminTestimonials,
      },
      {
        path: "payment-settings",
        name: "AdminPaymentSettings",
        component: AdminPaymentSettings,
      },
      {
        path: "change-password",
        name: "AdminChangePassword",
        component: AdminChangePasswordView,
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

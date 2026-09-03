<template>
    <aside
        class="account-sidebar h-full"
        :class="{
            'w-64': !isMobile,
            'w-full fixed z-40': isMobile && isSidebarOpen,
            hidden: isMobile && !isSidebarOpen,
        }"
    >
        <div class="sidebar-heading flex items-center justify-between p-5 border-b">
            <div><span>Essential</span><h2>My account</h2></div>
            <button
                v-if="isMobile"
                @click="$emit('close-sidebar')"
                class="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <svg
                    class="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>

        <nav class="p-4 space-y-2">
            <RouterLink
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="account-link flex items-center space-x-3 p-3 transition-colors duration-200"
                :class="{
                    active: isActive(item.path),
                }"
                @click="closeSidebarIfMobile"
            >
                <font-awesome-icon :icon="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
            </RouterLink>

            <button
                type="button"
                class="logout-link flex w-full items-center space-x-3 p-3 transition-colors duration-200"
                @click="logout"
            >
                <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="w-5 h-5" />
                <span>Logout</span>
            </button>
        </nav>
    </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faUser,
    faBook,
    faCog,
    faSignOutAlt,
    faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUser, faBook, faCog, faSignOutAlt, faShoppingCart);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isMobile = ref(false);

const props = defineProps({
    isSidebarOpen: Boolean,
});

const emit = defineEmits(["close-sidebar"]);

const menuItems = ref([
    { name: "My Orders", path: "/dashboard", icon: ["fas", "shopping-cart"] },
    { name: "Profile", path: "/dashboard/profile", icon: ["fas", "user"] },
    {
        name: "Settings",
        path: "/dashboard/settings",
        icon: ["fas", "cog"],
    },
]);

const isActive = (path) => {
    return route.path === path;
};

const handleResize = () => {
    isMobile.value = window.innerWidth < 768; // Adjust breakpoint as needed
};

const closeSidebarIfMobile = () => {
    if (isMobile.value) {
        emit("close-sidebar");
    }
};

const logout = () => {
    userStore.logout();
    closeSidebarIfMobile();
    router.push("/login");
};

onMounted(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.account-sidebar{border-right:1px solid #e5ddd2;background:#fbf9f5;color:#514c45;box-shadow:none}
.sidebar-heading{border-color:#e5ddd2}.sidebar-heading span{display:block;margin-bottom:.25rem;color:#9a7c50;font-size:.52rem;font-weight:650;letter-spacing:.24em;text-transform:uppercase}.sidebar-heading h2{font:400 1.45rem 'GFS Didot',Georgia,serif;color:#24221e}
.account-link,.logout-link{border-radius:0;font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase}
.account-link{border-left:2px solid transparent;color:#655f57}.account-link:hover{background:#f2ece3;color:#24221e}.account-link.active{border-left-color:#b08d57;background:#ebe2d6;color:#24221e}
.logout-link{margin-top:1rem;border-top:1px solid #e5ddd2;color:#93594d}.logout-link:hover{background:#f4e8e4}
</style>

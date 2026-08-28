<template>
    <aside
        class="bg-white shadow-md h-full"
        :class="{
            'w-64': !isMobile,
            'w-full fixed z-40': isMobile && isSidebarOpen,
            hidden: isMobile && !isSidebarOpen,
        }"
    >
        <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold text-gray-800">Dashboard</h2>
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
                class="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200"
                :class="{
                    'bg-primary text-white': isActive(item.path),
                    'hover:bg-gray-100 text-gray-700': !isActive(item.path),
                }"
                @click="closeSidebarIfMobile"
            >
                <font-awesome-icon :icon="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
            </RouterLink>

            <button
                type="button"
                class="flex w-full items-center space-x-3 rounded-lg p-2 text-red-600 transition-colors duration-200 hover:bg-red-50"
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

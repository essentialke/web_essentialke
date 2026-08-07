<template>
    <header class="bg-white shadow-sm p-4 flex justify-end sticky top-0 z-10">
        <!-- Placeholder for now, you'll add user info, notifications, etc. here -->
        <div class="relative" v-click-outside="closeUserMenu">
            <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary"
            >
                <img
                    src="/essential-logo.png"
                    alt="Essential logo"
                    class="w-8 h-8 object-contain"
                />
                <span>Admin</span>
                <svg
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isUserMenuOpen }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <div
                v-show="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
            >
                <RouterLink
                    to="/"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                >
                    Back to Main Site
                </RouterLink>
                <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    Logout
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useUserStore } from "../../stores/user";

const isUserMenuOpen = ref(false);
const router = useRouter();
const userStore = useUserStore();

const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted(el) {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = () => {
    isUserMenuOpen.value = false;
};

const handleLogout = async () => {
    try {
        await userStore.logout();
        closeUserMenu();
        router.push("/"); // Redirect to the main site
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
</script>

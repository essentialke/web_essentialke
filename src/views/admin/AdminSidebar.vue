<template>
    <aside
        :class="{
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
            'md:translate-x-0': true,
        }"
        class="bg-gray-800 text-white w-64 min-h-screen p-4 fixed md:sticky top-0 z-30 transition-transform duration-300 ease-in-out"
    >
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
                <img
                    src="/essential-logo.png"
                    alt="Essential logo"
                    class="h-8 w-auto mr-2"
                />
                <h1 class="text-lg font-bold">Admin Panel</h1>
            </div>
            <!-- Close button for mobile -->
            <button
                @click="$emit('close')"
                class="md:hidden text-gray-300 hover:text-white"
            >
                <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
        <nav>
            <ul class="space-y-2">
                <li v-for="link in links" :key="link.to">
                    <RouterLink
                        :to="link.to"
                        class="flex items-center p-2 rounded-lg hover:bg-gray-700"
                        :class="{
                            'bg-gray-700': isActive(link.to),
                        }"
                        @click="$emit('close')"
                    >
                        <font-awesome-icon :icon="link.icon" class="w-5 h-5" />
                        <span class="ml-3">{{ link.name }}</span>
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
import { useRoute, RouterLink } from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faTachometerAlt,
    faUsers,
    faBook,
    faMoneyCheckAlt,
    faCalendar,
    faBookOpen,
    faBlog,
    faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
    faTachometerAlt,
    faUsers,
    faBook,
    faMoneyCheckAlt,
    faCalendar,
    faBookOpen,
    faBlog,
    faCog,
);

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
});

defineEmits(["close"]);

const route = useRoute();

const links = [
    { to: "/admin/dashboard", icon: "tachometer-alt", name: "Dashboard" },
    { to: "/admin/users", icon: "users", name: "Users" },
    { to: "/admin/products", icon: "cart-shopping", name: "Products" },
    {
        to: "/admin/transactions",
        icon: "money-check-alt",
        name: "Transactions",
    },
    {
        to: "/admin/gift-vouchers",
        icon: "money-check-alt",
        name: "Gift Vouchers",
    },
    {
        to: "/admin/general-posts", 
        icon: "blog", 
        name: "General Posts",
    },
    {
        to: "/admin/content", 
        icon: "cog", 
        name: "Settings",
    },
];

const isActive = (path) => {
    return route.path === path;
};
</script>

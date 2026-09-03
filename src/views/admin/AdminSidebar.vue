<template>
    <aside
        :class="{
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
            'md:translate-x-0': true,
        }"
        class="admin-sidebar text-white w-64 min-h-screen p-4 fixed md:sticky top-0 z-30 transition-transform duration-300 ease-in-out"
    >
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
                <img
                    src="/essential-logo.png"
                    alt="Essential logo"
                    class="h-8 w-auto mr-2"
                />
                <div><span class="brand-kicker">Essential</span><h1 class="brand-title">Studio admin</h1></div>
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
                        class="admin-link flex items-center p-3"
                        :class="{
                            active: isActive(link.to),
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
    faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
    faTachometerAlt,
    faUsers,
    faBook,
    faMoneyCheckAlt,
    faCommentDots,
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
    { to: "/admin/products", icon: "cart-shopping", name: "Products" },
    { to: "/admin/subscribers", icon: "users", name: "Subscribers" },
    {
        to: "/admin/transactions",
        icon: "money-check-alt",
        name: "Transactions",
    },
    { to: "/admin/testimonials", icon: "comment-dots", name: "Testimonials" },
    { to: "/admin/payment-settings", icon: "money-check-alt", name: "Payment Settings" },
];

const isActive = (path) => {
    return route.path === path;
};
</script>

<style scoped>
.admin-sidebar{background:#24231f;border-right:1px solid #3c3933;box-shadow:10px 0 30px rgba(20,18,14,.08)}
.brand-kicker{display:block;color:#c2a36e;font-size:.48rem;font-weight:650;letter-spacing:.24em;text-transform:uppercase}.brand-title{font:400 1.2rem 'GFS Didot',Georgia,serif;color:#f7f3ed}
.admin-link{border-left:2px solid transparent;color:#c9c3b9;font-size:.67rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;transition:.2s}.admin-link:hover{background:#302e29;color:#fff}.admin-link.active{border-left-color:#c2a36e;background:#35322c;color:#fff}
</style>

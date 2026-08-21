<template>
    <div class="flex min-h-screen bg-gray-100">
        <!-- Mobile menu button -->
        <button
            @click="toggleSidebar"
            class="md:hidden fixed z-50 top-20 left-4 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 shadow-lg"
            aria-label="Toggle Menu"
        >
            <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    v-if="!isSidebarOpen"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>

        <!-- Overlay for mobile -->
        <div
            v-if="isSidebarOpen"
            @click="toggleSidebar"
            class="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity"
        ></div>

        <!-- Sidebar -->
        <AdminSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

        <!-- Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <!-- Main Content -->
            <main
                class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6"
            >
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import AdminSidebar from "./AdminSidebar.vue";
import AdminHeader from "./AdminHeader.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
    isSidebarOpen.value = false;
};
</script>

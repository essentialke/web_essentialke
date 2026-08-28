<template>
    <div class="flex min-h-[calc(100dvh-4rem)] bg-gray-50">
        <!-- Sidebar -->
        <UserSidebar
            :isSidebarOpen="isSidebarOpen"
            @close-sidebar="isSidebarOpen = false"
        />

        <!-- Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white shadow-sm p-4">
                <div
                    class="container mx-auto flex justify-between items-center"
                >
                    <!-- Hamburger Menu for Mobile -->
                    <button
                        @click="toggleSidebar"
                        class="lg:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
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
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    <!-- Page Title -->
                    <h1 class="text-xl font-semibold text-gray-900">
                        {{ pageTitle }}
                    </h1>
                </div>
            </header>

            <!-- Main Content -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div class="container mx-auto p-3 sm:p-6">
                    <RouterView />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import UserSidebar from "../../components/user/Sidebar.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isSidebarOpen = ref(false);

const pageTitle = ref("");

// Watch for route changes to update the page title
watch(
    () => route.name,
    (newTitle) => {
        switch (newTitle) {
            case "DashboardProfile":
                pageTitle.value = "User Profile";
                break;
            case "DashboardOrders":
                pageTitle.value = "My Orders";
                break;
            case "DashboardSettings":
                pageTitle.value = "Settings";
                break;
            default:
                pageTitle.value = "Dashboard";
        }
    },
);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
    // Ensure user is authenticated before accessing the dashboard
    if (!userStore.isAuthenticated) {
        router.push("/login");
    }
});
</script>

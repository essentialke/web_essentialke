<template>
    <div class="account-shell flex min-h-[calc(100dvh-4rem)]">
        <!-- Sidebar -->
        <UserSidebar
            :isSidebarOpen="isSidebarOpen"
            @close-sidebar="isSidebarOpen = false"
        />

        <!-- Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="account-header p-4 sm:px-8 sm:py-5">
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
                    <h1 class="account-title">
                        {{ pageTitle }}
                    </h1>
                </div>
            </header>

            <!-- Main Content -->
            <main class="account-main flex-1 overflow-x-hidden overflow-y-auto">
                <div class="account-content container mx-auto p-4 sm:p-8 lg:p-10">
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

<style scoped>
.account-shell { background:#f7f3ed; color:#302d29; font-family:'Geist',sans-serif }
.account-header { position:sticky;top:0;z-index:20;border-bottom:1px solid #e5ddd2;background:rgba(251,249,245,.96);backdrop-filter:blur(12px) }
.account-title { font:400 clamp(1.65rem,3vw,2.25rem)/1.1 'GFS Didot',Georgia,serif;letter-spacing:-.015em;color:#24221e }
.account-main { background:linear-gradient(180deg,#f8f5f0 0,#f3eee7 100%) }
.account-content { max-width:1280px }
.account-content :deep(h1),.account-content :deep(h2),.account-content :deep(h3){font-family:'GFS Didot',Georgia,serif;font-weight:400;color:#28251f}
.account-content :deep(.bg-white){border:1px solid #e5ddd2;box-shadow:0 12px 32px rgba(55,46,36,.055)}
.account-content :deep(input),.account-content :deep(textarea),.account-content :deep(select){border-color:#dcd2c5;border-radius:0;background:#fff;box-shadow:none;min-height:46px}
.account-content :deep(input:focus),.account-content :deep(textarea:focus),.account-content :deep(select:focus){border-color:#a88654;box-shadow:0 0 0 1px #a88654;outline:none}
.account-content :deep(button[type="submit"]){min-height:48px;border-radius:0;background:#24221e;font-size:.68rem;font-weight:650;letter-spacing:.14em;text-transform:uppercase;transition:.25s}
.account-content :deep(button[type="submit"]:hover){background:#9a7c50}
@media(max-width:767px){.account-header{padding-left:1rem}.account-title{margin-left:.75rem}}
</style>

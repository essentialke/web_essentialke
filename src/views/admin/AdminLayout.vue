<template>
    <div class="admin-shell flex min-h-screen">
        <!-- Mobile menu button -->
        <button
            @click="toggleSidebar"
            class="admin-menu-button md:hidden fixed z-50 top-[4.5rem] left-3 p-2 text-white shadow-lg"
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
                class="admin-main flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-3 sm:p-6 lg:p-10 pt-16 md:pt-8"
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

<style scoped>
.admin-shell{background:#f4efe8;color:#302d29;font-family:'Geist',sans-serif}.admin-main{background:linear-gradient(180deg,#f8f5f0,#f2ece4)}.admin-menu-button{border-radius:0;background:#24221e}
.admin-main :deep(> *){max-width:1440px;margin-left:auto;margin-right:auto}
.admin-main :deep(h1),.admin-main :deep(h2),.admin-main :deep(h3){font-family:'GFS Didot',Georgia,serif;font-weight:400;color:#28251f}
.admin-main :deep(.bg-white){border:1px solid #e4dbcf;box-shadow:0 12px 30px rgba(54,45,35,.055)}
.admin-main :deep(table){background:#fff}.admin-main :deep(thead){background:#eee7dd;color:#5e574e}.admin-main :deep(th){font-size:.62rem;letter-spacing:.13em;text-transform:uppercase}.admin-main :deep(td){border-color:#eee7de}
.admin-main :deep(input),.admin-main :deep(textarea),.admin-main :deep(select){border-color:#d9cfc2;border-radius:0;box-shadow:none}.admin-main :deep(input:focus),.admin-main :deep(textarea:focus),.admin-main :deep(select:focus){border-color:#a88654;box-shadow:0 0 0 1px #a88654;outline:none}
.admin-main :deep(button){transition:.2s}.admin-main :deep(.bg-primary){background:#24221e}.admin-main :deep(.bg-primary:hover){background:#9a7c50}
</style>

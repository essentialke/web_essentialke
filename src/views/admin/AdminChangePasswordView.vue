<template>
    <div class="container mx-auto max-w-3xl px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Account security</h1>
            <p class="mt-1 text-sm text-gray-500">Update the password for your admin account.</p>
        </div>
        <AdminChangePassword />
    </div>
</template>

<script setup>
import AdminChangePassword from "../../components/admin/AdminChangePassword.vue";
</script>

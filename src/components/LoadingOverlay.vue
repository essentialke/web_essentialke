<template>
    <div
        v-if="loadingStore.isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        aria-label="Loading"
        role="status"
    >
        <div
            class="w-12 h-12 rounded-full border-4 border-secondary/30 border-t-secondary animate-spin"
        ></div>
    </div>
</template>

<script setup>
import { useLoadingStore } from "../stores/loading";

const loadingStore = useLoadingStore();
</script>

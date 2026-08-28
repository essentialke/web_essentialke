<template>
    <transition-group
        name="snackbar-list"
        tag="div"
        class="fixed bottom-3 left-3 right-3 sm:left-auto sm:bottom-4 sm:right-4 z-50 space-y-2"
    >
        <div
            v-for="snackbar in snackbarStore.snackbars"
            :key="snackbar.id"
            class="snackbar-item flex flex-col w-full sm:w-80 max-w-full rounded-lg shadow-lg overflow-hidden"
            :class="getSnackbarClasses(snackbar)"
        >
            <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center space-x-2">
                    <font-awesome-icon
                        v-if="snackbar.type === 'success'"
                        :icon="['fas', 'check-circle']"
                        class="text-lg"
                    />
                    <font-awesome-icon
                        v-if="snackbar.type === 'warning'"
                        :icon="['fas', 'exclamation-triangle']"
                        class="text-lg"
                    />
                    <font-awesome-icon
                        v-if="snackbar.type === 'error'"
                        :icon="['fas', 'times-circle']"
                        class="text-lg"
                    />
                    <span class="text-sm font-medium">{{
                        snackbar.message
                    }}</span>
                </div>
                <button
                    v-if="snackbar.dismissable"
                    @click="dismissSnackbar(snackbar.id)"
                    class="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <font-awesome-icon
                        :icon="['fas', 'times']"
                        class="text-lg"
                    />
                </button>
            </div>
            <div
                class="h-1 bg-gray-400"
                :style="{ width: snackbar.progress + '%' }"
            ></div>
        </div>
    </transition-group>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useSnackbarStore } from "../stores/snackbar";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faCheckCircle,
    faExclamationTriangle,
    faTimesCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheckCircle, faExclamationTriangle, faTimesCircle, faTimes);

const snackbarStore = useSnackbarStore();

const updateProgress = (snackbar) => {
    const startTime = snackbar.createdAt;
    const endTime = startTime + snackbar.timeout;

    const interval = setInterval(() => {
        const now = Date.now();
        if (now >= endTime) {
            clearInterval(interval);
            dismissSnackbar(snackbar.id); // Remove when time is up
            return;
        }
        const progress = ((now - startTime) / snackbar.timeout) * 100;
        snackbar.progress = 100 - progress; // Update progress for receding effect
    }, 50); // Update progress every 50ms

    snackbar.interval = interval; // Store interval ID to clear later
};

const dismissSnackbar = (id) => {
    const snackbar = snackbarStore.snackbars.find((s) => s.id === id);
    if (snackbar && snackbar.interval) {
        clearInterval(snackbar.interval); // Clear interval on manual dismiss
    }
    snackbarStore.dismissSnackbar(id);
};

const getSnackbarClasses = (snackbar) => {
    const baseClasses = "text-white";
    switch (snackbar.type) {
        case "success":
            return `${baseClasses} bg-green-500`;
        case "warning":
            return `${baseClasses} bg-yellow-500`;
        case "error":
            return `${baseClasses} bg-red-500`;
        default:
            return `${baseClasses} bg-gray-700`;
    }
};

// Watch for new snackbars and start progress animation
snackbarStore.$subscribe((mutation, state) => {
    state.snackbars.forEach((snackbar) => {
        if (!snackbar.progress) {
            snackbar.progress = 100; // Initial progress
            snackbar.createdAt = Date.now();
            updateProgress(snackbar);
        }
    });
});

onUnmounted(() => {
    // Clear any running intervals when component is unmounted
    snackbarStore.snackbars.forEach((snackbar) => {
        if (snackbar.interval) {
            clearInterval(snackbar.interval);
        }
    });
});
</script>

<style scoped>
.snackbar-list-enter-active,
.snackbar-list-leave-active {
    transition: all 0.3s ease-out;
}

.snackbar-list-enter-from,
.snackbar-list-leave-to {
    opacity: 0;
    transform: translateY(30px); /* Changed to slide up/down */
}

.snackbar-list-move {
    transition: transform 0.3s;
}
</style>

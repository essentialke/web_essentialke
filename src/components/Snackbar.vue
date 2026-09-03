<template>
    <transition-group
        name="snackbar-list"
        tag="div"
        class="toast-stack fixed bottom-3 left-3 right-3 sm:left-auto sm:bottom-6 sm:right-6 z-50 space-y-3"
    >
        <div
            v-for="snackbar in snackbarStore.snackbars"
            :key="snackbar.id"
            class="snackbar-item flex flex-col w-full sm:w-[22rem] max-w-full overflow-hidden"
            :class="getSnackbarClasses(snackbar)"
        >
            <div class="flex items-center justify-between gap-4 px-4 py-4">
                <div class="flex min-w-0 items-center gap-3">
                    <span class="toast-icon" aria-hidden="true">
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
                    </span>
                    <span class="toast-message">{{
                        snackbar.message
                    }}</span>
                </div>
                <button
                    v-if="snackbar.dismissable"
                    @click="dismissSnackbar(snackbar.id)"
                    class="toast-close"
                    aria-label="Dismiss notification"
                >
                    <font-awesome-icon
                        :icon="['fas', 'times']"
                        class="text-lg"
                    />
                </button>
            </div>
            <div
                class="toast-progress"
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
    switch (snackbar.type) {
        case "success":
            return "toast-success";
        case "warning":
            return "toast-warning";
        case "error":
            return "toast-error";
        default:
            return "toast-info";
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
.snackbar-item {
    --toast-accent: #9a7c50;
    border: 1px solid #ded5c9;
    border-left: 3px solid var(--toast-accent);
    border-radius: 0;
    background: rgba(251, 249, 245, 0.98);
    color: #302d29;
    box-shadow: 0 18px 42px rgba(45, 38, 29, 0.16);
    backdrop-filter: blur(14px);
}

.toast-success { --toast-accent: #647454; }
.toast-warning { --toast-accent: #b08d57; }
.toast-error { --toast-accent: #9a554a; }
.toast-info { --toast-accent: #766d62; }

.toast-icon {
    display: inline-flex;
    width: 2rem;
    height: 2rem;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in srgb, var(--toast-accent) 45%, white);
    border-radius: 50%;
    background: color-mix(in srgb, var(--toast-accent) 10%, white);
    color: var(--toast-accent);
}

.toast-icon svg { width: .85rem; height: .85rem; }
.toast-message { font: 500 .75rem/1.5 'Geist', sans-serif; letter-spacing: .015em; }
.toast-close { display:grid;width:2rem;height:2rem;flex:0 0 auto;place-items:center;color:#8c857b;transition:.2s; }
.toast-close:hover { background:#eee8df;color:#302d29; }
.toast-close:focus-visible { outline:1px solid #b08d57;outline-offset:2px; }
.toast-close svg { width:.8rem;height:.8rem; }
.toast-progress { height:2px;background:var(--toast-accent);transition:width 50ms linear; }

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

@media (max-width: 520px) {
    .snackbar-item { box-shadow:0 12px 30px rgba(45,38,29,.14); }
    .toast-message { font-size:.72rem; }
}
</style>

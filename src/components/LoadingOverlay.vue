<template>
    <div
        v-if="loadingStore.isLoading"
        class="fixed inset-0 backdrop-blur-sm bg-primary/60 z-50 flex items-center justify-center"
    >
        <div class="max-w-md w-full mx-4 loading-container">
            <div
                class="bg-primary/90 backdrop-blur rounded-xl p-8 shadow-2xl border border-primary/30"
            >
                <div class="flex justify-center mb-6">
                    <div
                        class="w-12 h-12 rounded-full border-4 border-secondary/30 border-t-secondary animate-spin-slow"
                    ></div>
                </div>

                <div
                    class="w-full bg-primary/50 rounded-full h-1 mb-6 overflow-hidden"
                >
                    <div
                        class="bg-gradient-to-r from-secondary to-secondary/80 h-1 rounded-full transition-all duration-300 ease-out"
                        :style="{ width: `${progress}%` }"
                    ></div>
                </div>

                <div class="text-center">
                    <p class="text-sm font-serif text-gray-200 tracking-wide">
                        {{ currentMessage }}
                    </p>
                    <div class="flex justify-center mt-2">
                        <div class="flex space-x-1.5">
                            <div
                                v-for="dot in 3"
                                :key="dot"
                                class="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-pulse-subtle"
                                :style="{ animationDelay: `${dot * 200}ms` }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useLoadingStore } from "../stores/loading";

const loadingStore = useLoadingStore();
const progress = ref(0);
const currentMessage = ref("");

const messageGroups = {
    0: [
        "Charting the course to enchantment...",
        "Opening the gates to wonder...",
        "Beginning the grand tour...",
    ],
    25: [
        "Wandering through fields of lavender...",
        "Exploring coastal citrus groves...",
        "Navigating ancient spice routes...",
    ],
    50: [
        "Venturing into lush tropical forests...",
        "Ascending misty mountain peaks...",
        "Discovering hidden desert oases...",
    ],
    75: [
        "Gathering treasures from distant shores...",
        "Bottling the essence of adventure...",
        "Curating your world of scents...",
    ],
};

const updateMessage = (currentProgress) => {
    const threshold = Math.floor(currentProgress / 25) * 25;
    if (messageGroups[threshold]) {
        const messages = messageGroups[threshold];
        currentMessage.value =
            messages[Math.floor(Math.random() * messages.length)];
    }
};

onMounted(() => {
    let lastThreshold = -1;

    const interval = setInterval(() => {
        if (progress.value < 92) {
            const currentThreshold = Math.floor(progress.value / 25);
            if (currentThreshold !== lastThreshold) {
                updateMessage(progress.value);
                lastThreshold = currentThreshold;
            }

            const remainingProgress = 92 - progress.value;
            const increment = Math.min(
                remainingProgress * 0.15,
                Math.random() * 5 + 1,
            );

            progress.value += increment;
        }
    }, 200);

    watch(
        () => loadingStore.isLoading,
        (isLoading) => {
            if (isLoading) {
                progress.value = 0;
                document.body.style.overflow = "hidden";
                updateMessage(0);
            } else {
                document.body.style.overflow = "";
            }
        },
        { immediate: true },
    );

    return () => {
        clearInterval(interval);
        document.body.style.overflow = "";
    };
});
</script>

<style scoped>
.fixed {
    position: fixed;
    touch-action: none;
}

.loading-container {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.backdrop-blur-sm {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.bg-gradient-to-r {
    background-size: 200% 200%;
    animation: gradient 2s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>

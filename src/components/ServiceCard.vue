<template>
    <div
        class="bg-white rounded-2xl text-center transform transition duration-300 hover:scale-105 relative overflow-hidden border-4 border-pink-950"
    >
        <div
            class="absolute top-0 left-0 right-0 bottom-0 z-[-1] h-full w-full rounded-2xl"
        >
            <img class="h-full w-full object-cover" :src="background" alt="" />
        </div>
        <div
            class="bg-pink-950 bg-opacity-70 p-8 h-full w-full flex flex-col justify-center items-center"
        >
            <h3 class="text-2xl font-bold text-white mb-4">
                {{ title }}
            </h3>
            <p class="text-white mb-8 leading-relaxed">
                {{ description }}
            </p>
            <RouterLink
                :to="link"
                class="inline-flex items-center px-6 py-3 rounded-full bg-pink-900 text-white font-semibold hover:bg-primary hover:text-white transition duration-300"
            >
                {{ linkText }}
                <svg
                    class="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
defineProps({
    icon: {
        type: String,
        required: true,
        validator: (value) => ["shop", "library", "clubs"].includes(value),
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    linkText: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: false,
    },
});
</script>

<template>
    <div
        class="bg-white rounded-lg shadow-xl p-6 border-l-4 border-primary transform hover:scale-102 transition-transform duration-300"
    >
        <div class="flex items-center mb-4">
            <img
                v-if="testimonial.avatar"
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-200"
            />
            <svg
                v-else
                class="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
            </svg>
            <div>
                <p class="font-semibold text-gray-800 text-lg">
                    {{ testimonial.name }}
                </p>
                <p v-if="testimonial.role" class="text-sm text-gray-600">
                    {{ testimonial.role }}
                </p>
            </div>
        </div>
        <p class="text-gray-600 italic">"{{ testimonial.quote }}"</p>
    </div>
</template>

<script setup>
defineProps({
    testimonial: {
        type: Object,
        required: true,
        validator: (value) => {
            return (
                typeof value === "object" &&
                value !== null &&
                typeof value.name === "string" &&
                typeof value.quote === "string"
            );
        },
    },
});
</script>

<template>
    <section class="bg-gray-50 py-16 md:py-24" v-if="testimonials.length">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    What Our Members Say
                </h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    Hear from our community of readers and product lovers
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TestimonialCard
                    v-for="testimonial in testimonials"
                    :key="testimonial.name"
                    :testimonial="testimonial"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import TestimonialCard from "../TestimonialCard.vue";

defineProps({
    testimonials: {
        type: Array,
        required: true,
    },
});
</script>

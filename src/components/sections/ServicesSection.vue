<template>
    <section class="bg-pink-800 py-20 md:py-32 relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20">
            <div
                class="absolute inset-0 bg-[length:20px_20px]"
                style="
                    background-image: radial-gradient(
                        circle,
                        white 1px,
                        transparent 1px
                    );
                "
            ></div>
        </div>
        <div class="container mx-auto px-4">
            <div class="text-center mb-20">
                <h2 class="text-4xl md:text-5xl font-bold text-pink-100 mb-6">
                    Our Services
                </h2>
                <p
                    class="text-xl text-pink-100 max-w-2xl mx-auto leading-relaxed"
                >
                    Everything you need to explore, learn, and connect through
                    reading
                </p>
            </div>

            <div
                class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
            >
                <ServiceCard
                    v-for="service in services"
                    :key="service.title"
                    v-bind="service"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import ServiceCard from "../ServiceCard.vue";

const services = [
    {
        icon: "shop",
        title: "Book Shop",
        description:
            "Browse and purchase from our extensive collection of products",
        link: "/products",
        linkText: "Shop Now",
        background: "/IMG_8486.JPG",
    },
    {
        icon: "library",
        title: "Library",
        description:
            "Borrow and read products from our large product collection",
        link: "/library",
        linkText: "View Collections",
        background: "/product_club/individual_3.jpeg",
    },
    {
        icon: "clubs",
        title: "Book Clubs",
        description:
            "Join reading communities and discuss your favorite products",
        link: "/clubs",
        linkText: "Join Clubs",
        background: "/product_club/group_6.jpeg",
    },
];
</script>

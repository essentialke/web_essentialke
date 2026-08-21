<template>
    <section
        class="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-100"
    >
        <div class="relative h-full">
            <!-- Carousel Viewport -->
            <div
                class="h-full overflow-hidden"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
            >
                <div
                    class="flex h-full transition-transform duration-500 ease-in-out"
                    :style="{
                        transform: `translate3d(${-currentSlide * 100}%, 0px, 0px)`,
                    }"
                >
                    <!-- Slides -->
                    <div
                        v-for="(slide, index) in slides"
                        :key="index"
                        class="min-w-full relative h-full"
                        :class="{ 'z-10': currentSlide === index }"
                    >
                        <a :href="slide.link" class="block w-full h-full">
                            <picture class="w-full h-full block">
                                <source
                                    media="(min-width: 576px)"
                                    :srcset="slide.desktopImage"
                                />
                                <img
                                    :src="slide.mobileImage"
                                    :alt="slide.alt || ''"
                                    :fetchpriority="
                                        index === 0 ? 'high' : 'low'
                                    "
                                    class="w-full h-full object-cover object-center"
                                />
                            </picture>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Navigation Buttons -->
            <button
                class="absolute top-1/2 left-5 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-20 md:left-8 lg:left-10"
                @click="previousSlide"
                aria-label="Previous slide"
            >
                <svg
                    class="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            <button
                class="absolute top-1/2 right-5 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-20 md:right-8 lg:right-10"
                @click="nextSlide"
                aria-label="Next slide"
            >
                <svg
                    class="w-6 h-6 text-gray-800"
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
            </button>

            <!-- Dots Navigation -->
            <div
                class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20"
            >
                <button
                    v-for="(_, index) in slides"
                    :key="index"
                    @click="goToSlide(index)"
                    :aria-label="`Go to slide ${index + 1}`"
                    class="w-3 h-3 rounded-full border-2 border-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    :class="[
                        currentSlide === index
                            ? 'bg-white scale-110'
                            : 'bg-transparent hover:bg-white/50',
                    ]"
                ></button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const slides = ref([
    {
        link: "/link1",
        mobileImage:
            "https://cdnprod.mafretailproxy.com/assets/images/APP_Strip_Banner_2x_6c2c7ee40a.png",
        desktopImage:
            "https://cdnprod.mafretailproxy.com/assets/images/APP_Strip_Banner_2x_5a2de9ac32.png",
    },
    {
        link: "/link2",
        desktopImage:
            "https://www.allrecipes.com/thmb/WmytrFQTk9Re6ZYW-p0WS585-tM=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/ALR-what-is-a-bay-leaf-002075a20ae444ceb0266c2fc2129e55.jpg",
        mobileImage: "path/to/mobile/image2.jpg",
    },
    {
        link: "/link3",
        desktopImage: "path/to/desktop/image3.jpg",
        mobileImage: "path/to/mobile/image3.jpg",
    },
    {
        link: "/link4",
        desktopImage: "path/to/desktop/image4.jpg",
        mobileImage: "path/to/mobile/image4.jpg",
    },
    {
        link: "/link5",
        desktopImage: "path/to/desktop/image5.jpg",
        mobileImage: "path/to/mobile/image5.jpg",
    },
]);

const currentSlide = ref(0);
const autoPlayInterval = ref(null);
const touchStart = ref(0);
const touchEnd = ref(0);

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const previousSlide = () => {
    currentSlide.value =
        currentSlide.value === 0
            ? slides.value.length - 1
            : currentSlide.value - 1;
};

const goToSlide = (index) => {
    currentSlide.value = index;
};

const handleTouchStart = (e) => {
    touchStart.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
    touchEnd.value = e.changedTouches[0].screenX;
    const swipeLength = touchStart.value - touchEnd.value;

    if (Math.abs(swipeLength) > 50) {
        if (swipeLength > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
};

const startAutoPlay = () => {
    autoPlayInterval.value = setInterval(() => {
        nextSlide();
    }, 5000);
};

const stopAutoPlay = () => {
    if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value);
    }
};

onMounted(() => {
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay();
});
</script>

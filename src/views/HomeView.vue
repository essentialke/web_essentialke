<script setup>
import { computed, nextTick, onBeforeUnmount, ref, onMounted } from "vue";
import axios from "axios";
import HeroSection from "../components/sections/HeroSection.vue";
import FeaturedProductsSection from "../components/sections/FeaturedProductsSection.vue";
import { createImageSrcSet, resolveAssetUrl } from "../utils/assetUrl";
import { copyDefaultCategories } from "../config/catalog";
import { DEFAULT_STOREFRONT_CONTENT, normalizeStorefrontContent } from "../config/storefront";

const latestProducts = ref([]);
const bestSellers = ref([]);
const catalogProducts = ref([]);
const heroContent = ref(null);
const testimonialsContent = ref(null);
const catalogCategories = ref(copyDefaultCategories());
const storefrontContent = ref(normalizeStorefrontContent(DEFAULT_STOREFRONT_CONTENT));
onMounted(async () => {
    const [products, featuredProducts, catalog, hero, testimonialsResponse, categoriesResponse, storefrontResponse] = await Promise.allSettled([
        axios.get("/products", {
            params: {
                sortBy: "createdAt",
                sortOrder: "desc",
                page: 1,
                limit: 8,
            },
        }),
        axios.get("/products", { params: { featured: true, page: 1, limit: 8 } }),
        axios.get("/products", { params: { page: 1, limit: 50 } }),
        axios.get("/contents/hero"),
        axios.get("/contents/testimonials"),
        axios.get("/contents/categories"),
        axios.get("/contents/storefront"),
    ]);
    if (products.status === "fulfilled") latestProducts.value = products.value.data.products || [];
    if (featuredProducts.status === "fulfilled") bestSellers.value = featuredProducts.value.data.products || [];
    if (catalog.status === "fulfilled") catalogProducts.value = catalog.value.data.products || [];
    if (hero.status === "fulfilled") heroContent.value = hero.value.data?.content || null;
    if (testimonialsResponse.status === "fulfilled") testimonialsContent.value = testimonialsResponse.value.data?.content || null;
    if (categoriesResponse.status === "fulfilled") catalogCategories.value = categoriesResponse.value.data?.content?.categories || copyDefaultCategories();
    if (storefrontResponse.status === "fulfilled") storefrontContent.value = normalizeStorefrontContent(storefrontResponse.value.data?.content);
});

const categoryById = (id) => catalogCategories.value.find((category) => category.id === id);
const productImage = (product) => product?.coverImageUrl || "";
const matchingProduct = (label, index = 0) => {
    const needle = label.toLowerCase().replace(/s$/, "");
    return catalogProducts.value.find((product) =>
        `${product.category || ""} ${product.title || ""}`.toLowerCase().includes(needle),
    ) || catalogProducts.value[index % Math.max(catalogProducts.value.length, 1)];
};
const categoryTiles = computed(() => storefrontContent.value.quickNavCategoryIds.map((id, index) => {
    const category = categoryById(id);
    return { id, name: category?.name || "Category", image: productImage(matchingProduct(category?.name || "", index)) };
}));
const collectionTiles = computed(() => storefrontContent.value.featuredCollections.map((item, index) => {
    const category = categoryById(item.categoryId);
    return { id: item.categoryId, name: category?.name?.replace(/ Collection$/i, "") || "Collection", query: category?.name || "Collections", copy: item.description, image: productImage(matchingProduct(category?.name || "", index + 6)) };
}));
const displayedBestSellers = computed(() => bestSellers.value.length ? bestSellers.value : catalogProducts.value.slice(0, 8));
const giftImage = computed(() => productImage(matchingProduct("Gift Set", 0)) || productImage(catalogProducts.value[0]));
const isVisible = (id) => storefrontContent.value.sections.visibility[id] !== false;
const sectionStyle = (id) => ({ order: storefrontContent.value.sections.order.indexOf(id) + 1 });
const defaultTestimonials = [
    { id: "amina", name: "Amina K.", quote: "The finish is beautiful and understated. It has become the piece I reach for every morning.", rating: 5, verified: true },
    { id: "caroline", name: "Caroline M.", quote: "Even more delicate in person, yet it feels made to last. The packaging was lovely too.", rating: 5, verified: true },
    { id: "nadia", name: "Nadia W.", quote: "A perfect gift. Thoughtful, timeless, and the kind of piece that works with everything.", rating: 5, verified: true },
];
const testimonials = computed(() => testimonialsContent.value?.testimonials || defaultTestimonials);
const carouselItems = computed(() => [...testimonials.value, ...testimonials.value]);
const currentTestimonial = ref(0);
const carouselAnimated = ref(true);
const visibleTestimonials = ref(window.innerWidth <= 800 ? 1 : 3);
let testimonialTimer;

const carouselStyle = computed(() => ({
    transform: `translateX(-${currentTestimonial.value * (100 / visibleTestimonials.value)}%)`,
    transition: carouselAnimated.value ? "transform 650ms cubic-bezier(.22,.61,.36,1)" : "none",
}));

const nextTestimonial = () => {
    if (testimonials.value.length < 2) return;
    carouselAnimated.value = true;
    currentTestimonial.value += 1;
};

const previousTestimonial = async () => {
    if (testimonials.value.length < 2) return;
    if (currentTestimonial.value === 0) {
        carouselAnimated.value = false;
        currentTestimonial.value = testimonials.value.length;
        await nextTick();
        requestAnimationFrame(() => {
            carouselAnimated.value = true;
            currentTestimonial.value -= 1;
        });
        return;
    }
    carouselAnimated.value = true;
    currentTestimonial.value -= 1;
};

const normalizeCarousel = () => {
    if (currentTestimonial.value < testimonials.value.length) return;
    carouselAnimated.value = false;
    currentTestimonial.value %= testimonials.value.length;
};

const stopTestimonials = () => clearInterval(testimonialTimer);
const startTestimonials = () => {
    stopTestimonials();
    testimonialTimer = setInterval(nextTestimonial, 5000);
};
const updateVisibleTestimonials = () => { visibleTestimonials.value = window.innerWidth <= 800 ? 1 : 3; };

onMounted(() => {
    startTestimonials();
    window.addEventListener("resize", updateVisibleTestimonials);
});
onBeforeUnmount(() => {
    stopTestimonials();
    window.removeEventListener("resize", updateVisibleTestimonials);
});
</script>

<template>
    <div class="home">
        <HeroSection :content="heroContent" />
        <div class="homepage-flow">
        <section v-if="isVisible('quickNav')" class="category-section" :style="sectionStyle('quickNav')" aria-labelledby="category-heading">
            <div class="compact-heading">
                <p class="kicker">Find your piece</p>
                <h2 id="category-heading">Shop by category</h2>
            </div>
            <nav class="category-row" aria-label="Shop by category">
                <RouterLink v-for="category in categoryTiles" :key="category.name" :to="{ path: '/products', query: { category: category.name } }">
                    <span class="category-image"><img v-if="category.image" :src="resolveAssetUrl(category.image, { width: 320 })" :srcset="createImageSrcSet(category.image, [160, 240, 320])" sizes="132px" alt="" loading="lazy" /></span>
                    <span>{{ category.name }}</span>
                </RouterLink>
            </nav>
        </section>

        <FeaturedProductsSection v-if="isVisible('bestSellers')" :style="sectionStyle('bestSellers')" :products="displayedBestSellers" :kicker="storefrontContent.headings.bestSellers.kicker" :title="storefrontContent.headings.bestSellers.title" :limit="4" />

        <section v-if="isVisible('featuredCollections')" class="collections" :style="sectionStyle('featuredCollections')" aria-labelledby="collections-heading">
            <div class="section-heading">
                <div><p class="kicker">{{ storefrontContent.headings.featuredCollections.kicker }}</p><h2 id="collections-heading">{{ storefrontContent.headings.featuredCollections.title }}</h2></div>
                <RouterLink :to="{ path: '/products', query: { category: 'Collections' } }">View all collections <span>→</span></RouterLink>
            </div>
            <div class="collection-grid">
                <RouterLink v-for="collection in collectionTiles" :key="collection.name" :to="{ path: '/products', query: { category: collection.query } }" class="collection-card">
                    <img v-if="collection.image" :src="resolveAssetUrl(collection.image, { width: 720 })" :srcset="createImageSrcSet(collection.image, [320, 480, 720])" sizes="(max-width: 900px) 50vw, 25vw" :alt="`${collection.name} collection`" loading="lazy" />
                    <div><p>{{ collection.name }}</p><span>{{ collection.copy }}</span></div>
                </RouterLink>
            </div>
        </section>

        <FeaturedProductsSection v-if="isVisible('newArrivals')" :style="sectionStyle('newArrivals')" :products="latestProducts" :kicker="storefrontContent.headings.newArrivals.kicker" :title="storefrontContent.headings.newArrivals.title" :limit="4" secondary />

        <section v-if="isVisible('gifting')" class="gift-banner" :style="sectionStyle('gifting')">
            <div class="gift-copy"><p class="kicker">{{ storefrontContent.gifting.eyebrow }}</p><h2>{{ storefrontContent.gifting.heading }}</h2><p>{{ storefrontContent.gifting.body }}</p><RouterLink :to="storefrontContent.gifting.ctaRoute">{{ storefrontContent.gifting.ctaLabel }} <span>→</span></RouterLink></div>
            <div class="gift-image"><img v-if="giftImage" :src="resolveAssetUrl(giftImage, { width: 1280 })" :srcset="createImageSrcSet(giftImage, [480, 768, 1024, 1280])" sizes="(max-width: 900px) 100vw, 50vw" alt="Essential jewelry gift selection" loading="lazy" /></div>
        </section>

        <section v-if="isVisible('testimonials')" class="reviews" :style="sectionStyle('testimonials')">
            <div class="review-heading"><p class="kicker">Worn and loved</p><h2>Loved by Our Customers</h2></div>
            <div class="review-carousel" @mouseenter="stopTestimonials" @mouseleave="startTestimonials">
                <div class="review-grid" :style="carouselStyle" @transitionend="normalizeCarousel">
                    <article v-for="(testimonial, index) in carouselItems" :key="`${testimonial.id || testimonial.name}-${index}`">
                        <div class="stars">{{ "★".repeat(testimonial.rating || 5) }}</div>
                        <blockquote>“{{ testimonial.quote }}”</blockquote>
                        <footer><b>{{ testimonial.name }}</b><span v-if="testimonial.verified">✓ Verified buyer</span></footer>
                    </article>
                </div>
                <button class="review-arrow review-arrow-left" type="button" aria-label="Previous testimonial" @click="previousTestimonial">‹</button>
                <button class="review-arrow review-arrow-right" type="button" aria-label="Next testimonial" @click="nextTestimonial">›</button>
            </div>
        </section>
        </div>

    </div>
</template>

<style scoped>
.home{background:#f7f3ed;color:#1a1a1a}.benefit-strip{max-width:1440px;margin:auto;padding:28px 4vw;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #ddd4c7}.benefit{display:flex;justify-content:center;align-items:center;gap:13px;border-right:1px solid #ddd4c7}.benefit:last-child{border:0}.benefit>span{width:34px;height:34px;border:1px solid #b08d57;border-radius:50%;display:grid;place-items:center;color:#9c7945}.benefit b,.benefit small{display:block}.benefit b{font-size:9px;text-transform:uppercase;letter-spacing:.15em}.benefit small{font-size:10px;color:#777;margin-top:4px}.category-row{display:flex;justify-content:center;gap:42px;padding:25px 20px;border-bottom:1px solid #ddd4c7;overflow:auto}.category-row a{white-space:nowrap;font:italic 16px Georgia,serif;color:#4d4942}.category-row a:hover{color:#a17e49}.story-banner{display:grid;grid-template-columns:1.05fr .95fr;background:#24231f;color:#f7f3ed;min-height:610px}.story-visual{position:relative;overflow:hidden;background:radial-gradient(circle at 55% 40%,#c8a76e 0 8%,#8c704b 9% 24%,#3b352b 48%,#24231f 72%);display:grid;place-items:center}.story-visual:after{content:"";position:absolute;width:250px;height:330px;border:1px solid rgba(231,199,137,.55);border-radius:48% 48% 43% 43%;box-shadow:0 0 0 30px rgba(176,141,87,.08),0 0 80px rgba(201,164,92,.35)}.story-visual span{font:44px Georgia;color:#e4c889;letter-spacing:.3em;margin-left:.3em}.story-copy{padding:90px 8vw 80px 7vw;display:flex;flex-direction:column;justify-content:center}.kicker{font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:#b08d57;margin-bottom:18px}.story-copy h2,.review-heading h2{font:400 clamp(35px,4vw,54px)/1.12 Georgia,serif}.story-copy h2 em{color:#c9a86c;font-weight:400}.story-copy>p:not(.kicker){font-size:13px;color:#c8c3b9;line-height:1.9;max-width:530px;margin:28px 0}.story-copy a{font-size:9px;letter-spacing:.18em;text-transform:uppercase;border-bottom:1px solid #a98851;align-self:flex-start;padding-bottom:7px}.reviews{padding:105px 5vw;max-width:1440px;margin:auto}.review-heading{text-align:center;margin-bottom:50px}.review-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.review-grid article{background:#fbf9f5;border:1px solid #e1d9ce;padding:38px}.stars{color:#ae8b53;font-size:11px;letter-spacing:.12em}.review-grid blockquote{font:italic 19px/1.6 Georgia,serif;margin:22px 0 34px}.review-grid footer{display:flex;justify-content:space-between;align-items:center;font-size:9px;letter-spacing:.12em}.review-grid footer span{color:#6b7b55}.press{text-align:center;border-top:1px solid #ded6cb;padding:60px 20px 75px}.press>p{font-size:8px;letter-spacing:.25em;text-transform:uppercase;color:#8b8175}.press>div{display:flex;justify-content:center;align-items:center;gap:6vw;margin:30px 0;color:#77716a}.press>div span{font:bold 20px Georgia,serif}.press>div span:nth-child(3){font:700 14px Arial}.press blockquote{font:italic 18px Georgia,serif;color:#514c45}@media(max-width:800px){.benefit-strip{grid-template-columns:repeat(2,1fr);gap:22px 0}.benefit:nth-child(2){border:0}.category-row{justify-content:flex-start}.story-banner{grid-template-columns:1fr}.story-visual{min-height:390px}.story-copy{padding:65px 24px}.review-grid{grid-template-columns:1fr}.reviews{padding:75px 20px}.press>div{gap:22px;flex-wrap:wrap}}
.category-row a,.story-visual span,.story-copy h2,.review-heading h2,.review-grid blockquote,.press>div span,.press blockquote{font-family:'GFS Didot',Georgia,serif}.category-row a{font-size:19px}.story-copy h2,.review-heading h2{font-size:clamp(40px,4.2vw,58px);line-height:1.06;letter-spacing:-.015em}.story-copy>p:not(.kicker){font-size:14px;line-height:1.85}.review-grid blockquote{font-size:21px;line-height:1.5}.kicker,.benefit b,.story-copy a,.review-grid footer,.press>p{font-family:'Geist',sans-serif;font-weight:600}.review-heading{max-width:700px;margin-left:auto;margin-right:auto}
.home{background:#fff}.benefit-strip,.category-row{background:#fff}.benefit-strip{max-width:none;padding-left:max(4vw,calc((100vw - 1440px)/2 + 4vw));padding-right:max(4vw,calc((100vw - 1440px)/2 + 4vw));border-color:#e9e4dd}.category-row{border-color:#e9e4dd}.reviews{background:#f7f3ed;box-shadow:0 0 0 100vmax #f7f3ed;clip-path:inset(0 -100vmax)}.review-grid article{background:#fff;border-color:#e7e0d6}.press{background:#fff;border-color:#e9e4dd}
.homepage-flow{display:flex;flex-direction:column;width:100%;min-width:0;overflow:hidden}
.review-carousel{position:relative;overflow:hidden;padding:0 42px}.review-grid{display:flex;gap:0;will-change:transform}.review-grid article{box-sizing:border-box;flex:0 0 calc(33.333333% - 24px);margin:0 12px;min-height:438px;display:flex;flex-direction:column}.review-grid article footer{margin-top:auto}.review-arrow{position:absolute;top:50%;z-index:2;width:42px;height:42px;border:1px solid #d8cbbb;border-radius:50%;background:#fff;color:#8c704b;font:30px/1 Georgia,serif;box-shadow:0 4px 14px rgba(45,38,29,.08);transform:translateY(-50%);transition:.2s}.review-arrow:hover{background:#1f1f1c;color:#fff;border-color:#1f1f1c}.review-arrow-left{left:0}.review-arrow-right{right:0}@media(max-width:800px){.review-carousel{padding:0 34px}.review-grid article{flex-basis:calc(100% - 16px);margin:0 8px;min-height:370px}.review-arrow{width:36px;height:36px}.review-arrow-left{left:0}.review-arrow-right{right:0}}@media(prefers-reduced-motion:reduce){.review-grid{transition:none!important}}
.category-section{padding:38px 4vw 42px;max-width:1280px;margin:auto;background:#fff}.compact-heading{text-align:center;margin-bottom:24px}.compact-heading .kicker{margin-bottom:7px}.compact-heading h2{font:400 clamp(26px,2.5vw,34px)/1.05 'GFS Didot',Georgia,serif;letter-spacing:-.01em}.section-heading h2,.gift-copy h2{font:400 clamp(38px,4vw,56px)/1.05 'GFS Didot',Georgia,serif;letter-spacing:-.015em}.category-row{display:grid;grid-template-columns:repeat(6,1fr);gap:22px;padding:0;border:0;overflow:visible}.category-row a{display:flex;flex-direction:column;align-items:center;gap:11px;font:400 16px 'GFS Didot',Georgia,serif;color:#312e29}.category-image{width:min(100%,132px);aspect-ratio:1;border-radius:50%;overflow:hidden;background:#eee8df;transition:transform .35s ease}.category-image img{width:100%;height:100%;object-fit:cover}.category-row a:hover .category-image{transform:translateY(-4px)}.collections{background:#f7f3ed;padding:112px max(4vw,calc((100vw - 1440px)/2 + 4vw)) 120px}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px}.section-heading>a,.gift-copy>a{font:600 9px 'Geist',sans-serif;letter-spacing:.18em;text-transform:uppercase;border-bottom:1px solid #b08d57;padding-bottom:7px}.section-heading>a span,.gift-copy>a span{margin-left:16px}.collection-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.collection-card{position:relative;aspect-ratio:4/5;overflow:hidden;background:#d8cbbc;color:white}.collection-card:after{content:"";position:absolute;inset:35% 0 0;background:linear-gradient(transparent,rgba(18,15,11,.78))}.collection-card img{width:100%;height:100%;object-fit:cover;transition:transform .7s ease}.collection-card:hover img{transform:scale(1.04)}.collection-card div{position:absolute;z-index:1;left:24px;right:24px;bottom:25px}.collection-card p{font:400 29px/1 'GFS Didot',Georgia,serif;margin-bottom:9px}.collection-card span{display:block;font:400 11px/1.5 'Geist',sans-serif;color:rgba(255,255,255,.86)}.gift-banner{display:grid;grid-template-columns:1fr 1fr;min-height:500px;background:#27251f;color:#f7f3ed}.gift-copy{padding:72px 7vw;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}.gift-copy>p:not(.kicker){max-width:430px;margin:20px 0 26px;color:#d0c9bd;font:400 13px/1.8 'Geist',sans-serif}.gift-image{overflow:hidden;background:#d8cbbc}.gift-image img{width:100%;height:100%;object-fit:cover}.gift-copy>a{color:#f7f3ed}.reviews{margin-top:0}
@media(max-width:900px){.category-row{grid-template-columns:repeat(3,1fr);gap:28px 18px}.collection-grid{grid-template-columns:repeat(2,1fr)}.gift-banner{grid-template-columns:1fr}.gift-image{min-height:420px}.section-heading{align-items:flex-start}}
@media(max-width:640px){.category-section{width:100%;max-width:none;padding-left:0;padding-right:0;overflow:hidden}.compact-heading{padding-left:16px;padding-right:16px}.category-row{display:flex;justify-content:flex-start;gap:8px;box-sizing:border-box;width:100vw;max-width:100vw;padding:0 12px 8px;overflow-x:scroll;overflow-y:hidden;scroll-snap-type:x proximity;scroll-padding-inline:12px;overscroll-behavior-x:contain;touch-action:pan-x pinch-zoom;-webkit-overflow-scrolling:touch;scrollbar-width:none}.category-row::-webkit-scrollbar{display:none}.category-row a{flex:0 0 clamp(104px,29vw,120px);min-width:0;white-space:normal;scroll-snap-align:start}.category-image{width:88px;height:88px;flex:0 0 88px}.reviews{box-sizing:border-box;width:100%;min-width:0;padding:40px 8px;overflow:hidden}.review-heading{width:100%;margin-bottom:20px;padding:0 8px}.review-heading .kicker{margin-bottom:10px}.review-heading h2{max-width:100%;font-size:29px;overflow-wrap:anywhere}.review-carousel{box-sizing:border-box;width:100%;min-width:0;padding:0 24px}.review-grid{width:100%;min-width:0}.review-grid article{min-width:0;max-width:calc(100% - 16px);min-height:250px;padding:20px 16px;overflow:hidden}.review-grid blockquote{max-width:100%;font-size:17px;line-height:1.45;margin:16px 0 22px;white-space:normal;overflow-wrap:anywhere}.review-grid footer{gap:8px;font-size:8px;flex-wrap:wrap}.stars{font-size:9px}.review-arrow{width:32px;height:32px;font-size:24px}}
@media(max-width:520px){.category-section{max-width:none;padding:32px 0 36px;overflow:hidden}.compact-heading{text-align:left;margin-bottom:20px;padding:0 16px}.compact-heading h2{font-size:30px}.category-row a{gap:7px;min-height:44px;font-size:14px;line-height:1.2;text-align:center}.category-image{border:1px solid #ebe4da;box-shadow:0 5px 16px rgba(53,44,34,.07)}.collections{padding:56px 16px 64px}.collections .section-heading{display:block;padding:0;margin-bottom:26px}.section-heading>a{display:inline-flex;align-items:center;min-height:44px;margin-top:12px}.collection-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0;overflow:visible}.collection-card{min-width:0;aspect-ratio:4/5}.collection-card div{left:12px;right:12px;bottom:14px}.collection-card p{font-size:21px}.collection-card span{font-size:9px}.gift-copy{padding:46px 16px}.gift-copy h2{font-size:34px}.gift-copy>a{display:flex;align-items:center;min-height:44px}.gift-image{min-height:240px;max-height:290px}.reviews{padding:40px 8px}.review-heading{margin-bottom:20px;padding:0 8px}.review-heading h2{font-size:29px}.review-heading .kicker{margin-bottom:10px}.review-carousel{padding:0 24px}.review-grid article{min-height:250px;padding:20px 16px}.review-grid blockquote{font-size:17px;line-height:1.45;margin:16px 0 22px}.review-grid footer{font-size:8px}.stars{font-size:9px}.review-arrow{width:32px;height:32px;font-size:24px}}
</style>

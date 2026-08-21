<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import HeroSection from "../components/sections/HeroSection.vue";
import FeaturedProductsSection from "../components/sections/FeaturedProductsSection.vue";

const latestProducts = ref([]);
const heroContent = ref(null);
onMounted(async () => {
    const [products, hero] = await Promise.allSettled([
        axios.get("/products", {
            params: {
                sortBy: "createdAt",
                sortOrder: "desc",
                page: 1,
                limit: 8,
            },
        }),
        axios.get("/contents/hero"),
    ]);
    if (products.status === "fulfilled") latestProducts.value = products.value.data.products || [];
    if (hero.status === "fulfilled") heroContent.value = hero.value.data?.content || null;
});

const categories = ["Necklaces", "Rings", "Bracelets", "Earrings", "Chains", "Gift Sets"];
</script>

<template>
    <div class="home">
        <HeroSection :content="heroContent" />
        <nav class="category-row" aria-label="Shop by category">
            <RouterLink v-for="category in categories" :key="category" :to="{ path: '/products', query: { category } }">{{ category }}</RouterLink>
        </nav>
        <FeaturedProductsSection :products="latestProducts" />

        <section class="reviews">
            <div class="review-heading"><p class="kicker">Worn and loved</p><h2>Notes from our community</h2></div>
            <div class="review-grid">
                <article><div class="stars">★★★★★</div><blockquote>“The finish is beautiful and understated. It has become the piece I reach for every morning.”</blockquote><footer><b>AMINA K.</b><span>✓ Verified buyer</span></footer></article>
                <article><div class="stars">★★★★★</div><blockquote>“Even more delicate in person, yet it feels made to last. The packaging was lovely too.”</blockquote><footer><b>CAROLINE M.</b><span>✓ Verified buyer</span></footer></article>
                <article><div class="stars">★★★★★</div><blockquote>“A perfect gift. Thoughtful, timeless, and the kind of piece that works with everything.”</blockquote><footer><b>NADIA W.</b><span>✓ Verified buyer</span></footer></article>
            </div>
        </section>

    </div>
</template>

<style scoped>
.home{background:#f7f3ed;color:#1a1a1a}.benefit-strip{max-width:1440px;margin:auto;padding:28px 4vw;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #ddd4c7}.benefit{display:flex;justify-content:center;align-items:center;gap:13px;border-right:1px solid #ddd4c7}.benefit:last-child{border:0}.benefit>span{width:34px;height:34px;border:1px solid #b08d57;border-radius:50%;display:grid;place-items:center;color:#9c7945}.benefit b,.benefit small{display:block}.benefit b{font-size:9px;text-transform:uppercase;letter-spacing:.15em}.benefit small{font-size:10px;color:#777;margin-top:4px}.category-row{display:flex;justify-content:center;gap:42px;padding:25px 20px;border-bottom:1px solid #ddd4c7;overflow:auto}.category-row a{white-space:nowrap;font:italic 16px Georgia,serif;color:#4d4942}.category-row a:hover{color:#a17e49}.story-banner{display:grid;grid-template-columns:1.05fr .95fr;background:#24231f;color:#f7f3ed;min-height:610px}.story-visual{position:relative;overflow:hidden;background:radial-gradient(circle at 55% 40%,#c8a76e 0 8%,#8c704b 9% 24%,#3b352b 48%,#24231f 72%);display:grid;place-items:center}.story-visual:after{content:"";position:absolute;width:250px;height:330px;border:1px solid rgba(231,199,137,.55);border-radius:48% 48% 43% 43%;box-shadow:0 0 0 30px rgba(176,141,87,.08),0 0 80px rgba(201,164,92,.35)}.story-visual span{font:44px Georgia;color:#e4c889;letter-spacing:.3em;margin-left:.3em}.story-copy{padding:90px 8vw 80px 7vw;display:flex;flex-direction:column;justify-content:center}.kicker{font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:#b08d57;margin-bottom:18px}.story-copy h2,.review-heading h2{font:400 clamp(35px,4vw,54px)/1.12 Georgia,serif}.story-copy h2 em{color:#c9a86c;font-weight:400}.story-copy>p:not(.kicker){font-size:13px;color:#c8c3b9;line-height:1.9;max-width:530px;margin:28px 0}.story-copy a{font-size:9px;letter-spacing:.18em;text-transform:uppercase;border-bottom:1px solid #a98851;align-self:flex-start;padding-bottom:7px}.reviews{padding:105px 5vw;max-width:1440px;margin:auto}.review-heading{text-align:center;margin-bottom:50px}.review-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.review-grid article{background:#fbf9f5;border:1px solid #e1d9ce;padding:38px}.stars{color:#ae8b53;font-size:11px;letter-spacing:.12em}.review-grid blockquote{font:italic 19px/1.6 Georgia,serif;margin:22px 0 34px}.review-grid footer{display:flex;justify-content:space-between;align-items:center;font-size:9px;letter-spacing:.12em}.review-grid footer span{color:#6b7b55}.press{text-align:center;border-top:1px solid #ded6cb;padding:60px 20px 75px}.press>p{font-size:8px;letter-spacing:.25em;text-transform:uppercase;color:#8b8175}.press>div{display:flex;justify-content:center;align-items:center;gap:6vw;margin:30px 0;color:#77716a}.press>div span{font:bold 20px Georgia,serif}.press>div span:nth-child(3){font:700 14px Arial}.press blockquote{font:italic 18px Georgia,serif;color:#514c45}@media(max-width:800px){.benefit-strip{grid-template-columns:repeat(2,1fr);gap:22px 0}.benefit:nth-child(2){border:0}.category-row{justify-content:flex-start}.story-banner{grid-template-columns:1fr}.story-visual{min-height:390px}.story-copy{padding:65px 24px}.review-grid{grid-template-columns:1fr}.reviews{padding:75px 20px}.press>div{gap:22px;flex-wrap:wrap}}
.category-row a,.story-visual span,.story-copy h2,.review-heading h2,.review-grid blockquote,.press>div span,.press blockquote{font-family:'GFS Didot',Georgia,serif}.category-row a{font-size:19px}.story-copy h2,.review-heading h2{font-size:clamp(40px,4.2vw,58px);line-height:1.06;letter-spacing:-.015em}.story-copy>p:not(.kicker){font-size:14px;line-height:1.85}.review-grid blockquote{font-size:21px;line-height:1.5}.kicker,.benefit b,.story-copy a,.review-grid footer,.press>p{font-family:'Geist',sans-serif;font-weight:600}.review-heading{max-width:700px;margin-left:auto;margin-right:auto}
.home{background:#fff}.benefit-strip,.category-row{background:#fff}.benefit-strip{max-width:none;padding-left:max(4vw,calc((100vw - 1440px)/2 + 4vw));padding-right:max(4vw,calc((100vw - 1440px)/2 + 4vw));border-color:#e9e4dd}.category-row{border-color:#e9e4dd}.reviews{background:#f7f3ed;box-shadow:0 0 0 100vmax #f7f3ed;clip-path:inset(0 -100vmax)}.review-grid article{background:#fff;border-color:#e7e0d6}.press{background:#fff;border-color:#e9e4dd}
</style>

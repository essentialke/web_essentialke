<script setup>
import FeaturedProductCard from "../FeaturedProductCard.vue";
defineProps({
    products: { type: Array, required: true },
    kicker: { type: String, default: "Curated for you" },
    title: { type: String, default: "Everyday Icons" },
    limit: { type: Number, default: 8 },
    secondary: { type: Boolean, default: false },
});
</script>
<template>
    <section class="featured" :class="{ secondary }">
        <div class="section-head">
            <div><p class="kicker">{{ kicker }}</p><h2>{{ title }}</h2></div>
            <RouterLink to="/products">View all pieces <span>→</span></RouterLink>
        </div>
        <div v-if="products.length" class="product-grid">
            <FeaturedProductCard v-for="product in products.slice(0, limit)" :key="product.id" :product="product" />
        </div>
        <div v-else class="product-grid placeholders">
            <div v-for="n in 4" :key="n"><div class="placeholder-image"></div><i></i><b></b></div>
        </div>
    </section>
</template>
<style scoped>
.featured{max-width:1440px;margin:auto;padding:100px 4vw 120px}.section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:42px}.kicker{font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#9a7c50;margin-bottom:12px}.section-head h2{font:400 clamp(34px,4vw,52px)/1 Georgia,serif}.section-head>a{font-size:9px;letter-spacing:.18em;text-transform:uppercase;border-bottom:1px solid #b08d57;padding-bottom:7px}.section-head>a span{margin-left:16px}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:48px 24px}.placeholder-image{aspect-ratio:4/5;background:linear-gradient(100deg,#ebe4da 20%,#f5f0e9 40%,#ebe4da 60%);background-size:200% 100%;animation:shimmer 1.5s infinite}.placeholders i,.placeholders b{display:block;background:#e5ded3;height:10px;margin-top:15px;width:70%}.placeholders b{width:35%;height:8px;margin-top:9px}@keyframes shimmer{to{background-position:-200% 0}}@media(max-width:900px){.product-grid{grid-template-columns:repeat(2,1fr)}.featured{padding:72px 20px 90px}}@media(max-width:520px){.product-grid{gap:38px 12px}.section-head{align-items:start}.section-head>a{margin-top:12px}.section-head h2{font-size:35px}}
.section-head h2{font-family:'GFS Didot',Georgia,serif;font-size:clamp(40px,4.2vw,58px);line-height:1;font-weight:400;letter-spacing:-.015em}.kicker{font-family:'Geist',sans-serif;font-weight:600;color:#8b6a3d}.section-head>a{font-family:'Geist',sans-serif;font-weight:600}
.featured{background:#fff}
.featured.secondary{padding-top:78px;padding-bottom:88px;border-top:1px solid #eee8df}.featured.secondary .section-head{margin-bottom:32px}.featured.secondary .section-head h2{font-size:clamp(34px,3.5vw,48px)}
@media(max-width:900px){.featured.secondary{padding-top:62px;padding-bottom:72px}}
@media(max-width:520px){.featured{padding:52px 16px 62px}.section-head{align-items:flex-start;gap:12px;padding:0;margin-bottom:26px}.section-head h2{font-size:30px}.section-head>a{display:flex;align-items:center;min-height:44px;font-size:8px;white-space:nowrap}.section-head>a span{margin-left:8px}.product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 10px;padding:0;overflow:visible}.product-grid>.product-tile,.product-grid>div{min-width:0}.featured.secondary{padding-top:50px;padding-bottom:58px}}
</style>

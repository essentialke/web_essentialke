<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import ProductCard from "../components/ProductCard.vue";
import { resolveAssetUrl } from "../utils/assetUrl";

const bundles = ref([]);
const loading = ref(true);
const heroImage = computed(() => bundles.value[0]?.coverImageUrl ? resolveAssetUrl(bundles.value[0].coverImageUrl) : "/essential-hero.jpg");

onMounted(async () => {
    try {
        const response = await axios.get("/products", { params: { category: "Gift Sets", page: 1, limit: 12 } });
        bundles.value = response.data.products || [];
    } finally { loading.value = false; }
});
</script>

<template>
    <main class="gifting-page">
        <section class="gifting-hero">
            <div class="hero-copy"><p class="eyebrow">Gifts with meaning</p><h1>Beautifully paired,<br />ready to give.</h1><p>Thoughtful jewelry bundles curated for birthdays, milestones, celebrations, and the moments in between.</p><a href="#gift-bundles">Explore gift bundles <span>↓</span></a></div>
            <div class="hero-image"><img :src="heroImage" alt="Essential jewelry gift bundle" /><span>Curated with care<br />Presented beautifully</span></div>
        </section>

        <section class="gift-promises" aria-label="Gift service benefits">
            <div><b>01</b><span><strong>Thoughtfully paired</strong><small>Pieces selected to be worn beautifully together.</small></span></div>
            <div><b>02</b><span><strong>Gift-ready presentation</strong><small>Arrives ready for the moment—no extra wrapping needed.</small></span></div>
            <div><b>03</b><span><strong>A lasting gesture</strong><small>Meaningful jewelry they can return to every day.</small></span></div>
        </section>

        <section id="gift-bundles" class="bundles-section">
            <header><div><p class="eyebrow">Curated for giving</p><h2>Gift Bundles</h2></div><p>Choose a complete pairing, beautifully considered from the first piece to the final detail.</p></header>
            <div v-if="loading" class="bundle-grid skeletons"><div v-for="n in 3" :key="n"><i></i><b></b><span></span></div></div>
            <div v-else-if="bundles.length" class="bundle-grid"><ProductCard v-for="bundle in bundles" :key="bundle.id" :product="bundle" compact /></div>
            <div v-else class="empty-bundles"><p class="eyebrow">Coming together</p><h3>Our gift bundles are being prepared.</h3><p>In the meantime, explore the full collection and choose pieces they’ll love.</p><RouterLink to="/products">Shop all jewelry <span>→</span></RouterLink></div>
        </section>

        <section class="gift-note"><p class="eyebrow">Make it personal</p><h2>A gift chosen with intention<br />always says more.</h2><p>Each bundle is designed to feel complete while leaving room for their own story.</p><RouterLink to="/products">Explore all pieces <span>→</span></RouterLink></section>
    </main>
</template>

<style scoped>
.gifting-page{background:#fff;color:#201f1c}.gifting-hero{display:grid;grid-template-columns:.9fr 1.1fr;min-height:610px;background:#f3ede4}.hero-copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:72px 6vw}.eyebrow{margin-bottom:14px;color:#92703f;font:650 9px 'Geist',sans-serif;letter-spacing:.24em;text-transform:uppercase}.hero-copy h1,.bundles-section h2,.gift-note h2,.empty-bundles h3{font:400 clamp(44px,5vw,72px)/.98 'GFS Didot',Georgia,serif;letter-spacing:-.02em}.hero-copy>p:not(.eyebrow){max-width:520px;margin:24px 0 30px;color:#69635b;font-size:14px;line-height:1.8}.hero-copy>a,.gift-note a,.empty-bundles a{min-height:48px;display:inline-flex;align-items:center;gap:30px;padding:0 20px;background:#1f1f1c;color:#fff;font-size:9px;font-weight:650;letter-spacing:.17em;text-transform:uppercase}.hero-image{position:relative;min-height:540px;overflow:hidden}.hero-image:after{content:"";position:absolute;inset:55% 0 0;background:linear-gradient(transparent,rgba(20,16,12,.58))}.hero-image img{width:100%;height:100%;object-fit:cover}.hero-image>span{position:absolute;z-index:1;right:28px;bottom:24px;color:#fff;text-align:right;font-size:9px;line-height:1.7;letter-spacing:.15em;text-transform:uppercase}.gift-promises{display:grid;grid-template-columns:repeat(3,1fr);max-width:1380px;margin:auto;padding:44px 4vw;border-bottom:1px solid #e7e0d6}.gift-promises>div{display:flex;gap:16px;padding:0 32px;border-right:1px solid #e7e0d6}.gift-promises>div:last-child{border:0}.gift-promises b{color:#a48250;font-size:10px}.gift-promises span,.gift-promises strong,.gift-promises small{display:block}.gift-promises strong{font:400 18px 'GFS Didot',Georgia,serif}.gift-promises small{max-width:250px;margin-top:5px;color:#817a71;font-size:10px;line-height:1.6}.bundles-section{max-width:1400px;margin:auto;padding:100px 4vw 120px}.bundles-section>header{display:flex;justify-content:space-between;align-items:end;gap:36px;margin-bottom:46px}.bundles-section h2{font-size:clamp(42px,4vw,58px)}.bundles-section>header>p{max-width:440px;color:#736d65;font-size:13px;line-height:1.75}.bundle-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}.skeletons i{display:block;aspect-ratio:3/4;background:#eee8df}.skeletons b,.skeletons span{display:block;width:70%;height:12px;margin-top:16px;background:#eee8df}.skeletons span{width:40%;height:9px;margin-top:9px}.empty-bundles{padding:80px 24px;text-align:center;background:#f7f3ed}.empty-bundles h3{font-size:48px}.empty-bundles>p:not(.eyebrow){max-width:480px;margin:18px auto 26px;color:#706960}.gift-note{text-align:center;padding:100px 20px;background:#27251f;color:#f6efe5}.gift-note h2{font-size:clamp(42px,4.8vw,66px)}.gift-note>p:not(.eyebrow){max-width:520px;margin:22px auto 28px;color:#aaa39a;font-size:13px}.gift-note a{background:#f0e2ca;color:#302517}
@media(max-width:850px){.gifting-hero{grid-template-columns:1fr;min-height:0}.hero-copy{padding:60px 24px}.hero-image{min-height:430px}.gift-promises{grid-template-columns:1fr;padding:18px 24px}.gift-promises>div{padding:20px 0;border-right:0;border-bottom:1px solid #e7e0d6}.bundle-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.hero-copy{padding:46px 20px 52px}.hero-copy h1{font-size:44px}.hero-copy>p:not(.eyebrow){margin:18px 0 24px;font-size:13px}.hero-image{min-height:300px;max-height:340px}.gift-promises{padding:12px 20px}.bundles-section{padding:64px 0 76px}.bundles-section>header{display:block;padding:0 18px;margin-bottom:30px}.bundles-section>header>p{margin-top:15px}.bundle-grid{display:flex;gap:14px;padding:0 18px 8px;overflow-x:auto;scroll-snap-type:x mandatory}.bundle-grid>*{flex:0 0 84vw;scroll-snap-align:start}.bundle-grid::-webkit-scrollbar{display:none}.empty-bundles{margin:0 14px;padding:60px 20px}.empty-bundles h3{font-size:40px}.gift-note{padding:72px 20px}.gift-note h2{font-size:42px}}
</style>

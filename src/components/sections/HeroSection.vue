<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { resolveAssetUrl } from "../../utils/assetUrl";

const props = defineProps({ content: { type: Object, default: null } });
const slide = computed(() => props.content?.rightSection?.slides?.[0]);
const heroImage = computed(() =>
    slide.value?.image ? resolveAssetUrl(slide.value.image) : "/essential-hero.jpg",
);
const cloudinaryVariant = (url, width) => {
    if (!url?.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
        return url;
    }

    return url.replace(
        "/image/upload/",
        `/image/upload/f_auto,q_auto:best,w_${width}/`,
    );
};
const heroSrc = computed(() => cloudinaryVariant(heroImage.value, 1920));
const heroSrcset = computed(() => {
    if (!heroImage.value?.includes("res.cloudinary.com")) return undefined;

    return [768, 1280, 1920, 2560]
        .map((width) => `${cloudinaryVariant(heroImage.value, width)} ${width}w`)
        .join(", ");
});
const title = computed(() => {
    const t = props.content?.leftSection?.title;
    return [t?.mainText, t?.highlightedText, t?.endText].filter(Boolean).join(" ") || "Find yourself through meaningful jewelry";
});
const description = computed(() => props.content?.leftSection?.description || "Thoughtfully selected pieces, made to live with you every day and remain beautiful through every season.");
</script>

<template>
    <section class="hero" :class="{ 'hero-with-image': heroImage }">
        <img
            v-if="heroImage"
            :src="heroSrc"
            :srcset="heroSrcset"
            sizes="100vw"
            :alt="slide?.alt || title"
            class="hero-image"
            fetchpriority="high"
            decoding="async"
        />
        <div class="hero-wash"></div>
        <div class="hero-content">
            <p class="eyebrow">The signature collection · 2026</p>
            <h1>{{ title }}</h1>
            <p class="hero-copy">{{ description }}</p>
            <RouterLink to="/products" class="hero-cta">Shop the collection <span>→</span></RouterLink>
        </div>
        <div class="hero-note"><span>01</span><i></i><span>Quiet luxury, made to last</span></div>
    </section>
</template>

<style scoped>
.hero{height:min(680px,72vh);min-height:540px;position:relative;overflow:hidden;background:linear-gradient(110deg,#d7c0a0 0%,#b89565 48%,#7c6248 100%);color:white}.hero-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 38%;animation:reveal 1.2s ease both}.hero-wash{position:absolute;inset:0;background:linear-gradient(90deg,rgba(17,14,11,.62),rgba(17,14,11,.16) 55%,rgba(17,14,11,.05))}.hero-content{position:relative;z-index:1;max-width:1440px;height:100%;margin:auto;padding:0 7vw;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;width:100%}.eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;margin-bottom:24px}.hero h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(48px,6vw,88px);line-height:.98;font-weight:400;letter-spacing:-.035em;max-width:720px}.hero-copy{font-size:14px;line-height:1.75;max-width:470px;margin:28px 0;color:rgba(255,255,255,.88)}.hero-cta{background:#f7f3ed;color:#1a1a1a;padding:15px 22px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;display:flex;gap:25px;transition:.3s}.hero-cta:hover{background:#b08d57;color:white}.hero-note{position:absolute;z-index:2;right:4vw;bottom:30px;display:flex;align-items:center;gap:12px;font-size:9px;letter-spacing:.18em;text-transform:uppercase}.hero-note i{display:block;width:50px;height:1px;background:#fff}@keyframes reveal{from{transform:scale(1.04);opacity:.5}to{transform:scale(1);opacity:1}}@media(max-width:700px){.hero{min-height:570px;height:70vh}.hero-content{padding:0 24px}.hero h1{font-size:48px}.hero-copy{font-size:13px}.hero-note{display:none}}
.hero{background:#e9e2d8}
.hero-image{object-position:center 58%}
.hero-wash{background:linear-gradient(90deg,rgba(17,14,11,.64),rgba(17,14,11,.18) 55%,rgba(17,14,11,.02))}
.hero h1{font-family:'GFS Didot',Georgia,serif;font-size:clamp(54px,6.4vw,94px);line-height:.94;letter-spacing:-.025em;text-shadow:0 2px 24px rgba(0,0,0,.14)}
.eyebrow{font-family:'Geist',sans-serif;font-weight:600;letter-spacing:.3em}.hero-copy{font-size:15px;line-height:1.7;font-weight:400;max-width:500px}.hero-cta{font-family:'Geist',sans-serif;font-weight:600}
@media(max-width:700px){.hero h1{font-size:52px;line-height:.98}.hero-copy{font-size:14px}}
</style>

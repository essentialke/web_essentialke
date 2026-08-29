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
    const contentTitle = [t?.mainText, t?.highlightedText, t?.endText].filter(Boolean).join(" ");
    return contentTitle.trim().toLowerCase() === "find yourself through meaningful jewelry" || !contentTitle
        ? "Find yourself in meaningful jewelry"
        : contentTitle;
});
const titleLines = computed(() =>
    title.value.trim().toLowerCase() === "find yourself in meaningful jewelry"
        ? ["Find yourself in", "meaningful jewelry"]
        : [title.value],
);
const description = computed(() => {
    const contentDescription = props.content?.leftSection?.description;
    return !contentDescription || contentDescription.startsWith("Thoughtfully selected pieces")
        ? "Made to live with you, every day."
        : contentDescription;
});
const eyebrow = computed(() => props.content?.eyebrow || "Signature collection");
const cta = computed(() => ({
    label: props.content?.cta?.label || "Shop now",
    route: props.content?.cta?.route || "/products",
}));
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
            <p class="eyebrow">{{ eyebrow }}</p>
            <h1><span v-for="line in titleLines" :key="line">{{ line }}</span></h1>
            <p class="hero-copy">{{ description }}</p>
            <RouterLink :to="cta.route" class="hero-cta">{{ cta.label }} <span>→</span></RouterLink>
        </div>
        <div class="hero-note"><span>01</span><i></i><span>Quiet luxury, made to last</span></div>
    </section>
</template>

<style scoped>
.hero{height:min(620px,66vh);min-height:480px;position:relative;overflow:hidden;background:linear-gradient(110deg,#d7c0a0 0%,#b89565 48%,#7c6248 100%);color:white}.hero-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 38%;animation:reveal 1.2s ease both}.hero-wash{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.43),rgba(0,0,0,.14))}.hero-content{position:relative;z-index:1;max-width:1440px;height:100%;margin:auto;padding:0 7vw 4vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;width:100%}.eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;margin-bottom:14px}.hero h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(46px,5.2vw,78px);line-height:.92;font-weight:400;letter-spacing:-.035em;max-width:700px}.hero h1 span{display:block}.hero-copy{font-size:14px;line-height:1.5;max-width:470px;margin:18px 0 20px;color:rgba(255,255,255,.92)}.hero-cta{background:rgba(246,232,204,.94);border:1px solid rgba(201,166,107,.95);color:#3b2c18;padding:14px 20px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;display:flex;gap:25px;transition:.3s}.hero-cta:hover{background:#c6a15f;border-color:#e5c98f;color:#1e160b}.hero-note{position:absolute;z-index:2;right:4vw;bottom:30px;display:flex;align-items:center;gap:12px;font-size:9px;letter-spacing:.18em;text-transform:uppercase;text-shadow:0 1px 8px rgba(0,0,0,.45)}.hero-note i{display:block;width:50px;height:1px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.35)}@keyframes reveal{from{transform:scale(1.04);opacity:.5}to{transform:scale(1);opacity:1}}@media(max-width:700px){.hero{min-height:520px;height:66vh}.hero-content{padding:0 24px 3vh}.hero h1{font-size:44px}.hero-copy{font-size:13px}.hero-note{display:none}}
.hero{background:#e9e2d8}
.hero-image{object-position:center 58%}
.hero-wash{background:linear-gradient(90deg,rgba(0,0,0,.43),rgba(0,0,0,.14))}
.hero h1{font-family:'GFS Didot',Georgia,serif;font-size:clamp(46px,5.2vw,78px);line-height:.92;letter-spacing:-.025em;text-shadow:0 2px 24px rgba(0,0,0,.14)}
.eyebrow{font-family:'Geist',sans-serif;font-weight:600;letter-spacing:.3em}.hero-copy{font-size:15px;line-height:1.7;font-weight:400;max-width:500px}.hero-cta{font-family:'Geist',sans-serif;font-weight:600}
@media(max-width:700px){.hero h1{font-size:44px;line-height:.96}.hero-copy{font-size:14px}}
@media(max-width:520px){.hero{height:auto;min-height:400px;aspect-ratio:4/5;max-height:560px}.hero-image{object-position:58% center}.hero-wash{background:linear-gradient(90deg,rgba(0,0,0,.58),rgba(0,0,0,.16))}.hero-content{height:auto;min-height:inherit;padding:48px 16px 28px;justify-content:center}.eyebrow{font-size:9px;margin-bottom:12px}.hero h1{font-size:clamp(32px,10.5vw,42px);max-width:100%;overflow-wrap:anywhere;line-height:.96}.hero-copy{max-width:min(310px,100%);margin:15px 0 18px;font-size:13px;line-height:1.55}.hero-cta{display:inline-flex;align-items:center;justify-content:space-between;min-width:150px;min-height:46px;padding:12px 17px}}
</style>

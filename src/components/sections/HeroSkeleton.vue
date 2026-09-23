<script setup>
import SkeletonBlock from "../SkeletonBlock.vue";
</script>
<template>
    <div class="hero-skeleton" aria-hidden="true">
        <div class="hero-copy"><SkeletonBlock class="eyebrow" /><SkeletonBlock class="headline" /><SkeletonBlock class="headline shorter" /><SkeletonBlock class="description" /><SkeletonBlock class="cta" /></div>
        <div class="image-outline"></div>
    </div>
</template>
<style scoped>
.hero-skeleton{position:relative;height:min(620px,66vh);min-height:480px;overflow:hidden;background:linear-gradient(115deg,#f4eee5,#e2d7c8)}.hero-copy{position:relative;z-index:1;max-width:1440px;height:100%;margin:auto;padding:0 7vw 4vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:14px}.eyebrow{width:150px;height:10px;margin-bottom:6px}.headline{width:min(580px,65%);height:clamp(42px,5vw,70px)}.shorter{width:min(510px,58%)}.description{width:min(310px,65%);height:14px;margin-top:8px}.cta{width:160px;height:46px;margin-top:12px}.image-outline{position:absolute;right:8%;top:15%;width:30%;height:70%;border:1px solid #ffffff80;border-radius:50% 50% 4px 4px;background:#ffffff20}@media(max-width:700px){.hero-skeleton{min-height:520px;height:66vh}.hero-copy{padding:0 24px 3vh}.headline{height:42px}.image-outline{right:-12%;width:60%}}@media(max-width:520px){.hero-skeleton{height:auto;min-height:400px;aspect-ratio:4/5;max-height:560px}.hero-copy{height:auto;min-height:inherit;padding:48px 16px 28px}.headline{height:36px;width:88%}.shorter{width:76%}.description{width:65%}}
</style>

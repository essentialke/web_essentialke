<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { createImageSrcSet, resolveAssetUrl } from "../utils/assetUrl";
const props = defineProps({ product: { type: Object, required: true } });
const failed = ref(false);
const imageUrl = computed(() => {
    const path = props.product.coverImageUrl;
    return resolveAssetUrl(path, { width: 720 });
});
const imageSrcset = computed(() => createImageSrcSet(props.product.coverImageUrl, [240, 360, 540, 720]));
const isOnSale = computed(() => Number(props.product.salePrice) > 0 && Number(props.product.salePrice) < Number(props.product.price));
const regularPrice = computed(() => Number(props.product.price || 0).toLocaleString("en-KE"));
const price = computed(() => Number(isOnSale.value ? props.product.salePrice : props.product.price || 0).toLocaleString("en-KE", { minimumFractionDigits: 0 }));
</script>

<template>
    <article class="product-tile">
        <RouterLink :to="`/product/${product.id}/${product.slug}`" class="product-image-wrap">
            <span class="badge">{{ isOnSale ? 'Sale' : product.featured ? 'Bestseller' : 'New' }}</span>
            <button class="wish" aria-label="Add to wishlist" @click.prevent>♡</button>
            <img v-if="imageUrl && !failed" :src="imageUrl" :srcset="imageSrcset" sizes="(max-width: 520px) 50vw, (max-width: 900px) 50vw, 25vw" :alt="product.title" @error="failed = true" loading="lazy" />
            <div v-else class="image-placeholder"><span>Essential</span></div>
            <span class="quick-view">View piece</span>
        </RouterLink>
        <div class="product-info">
            <div class="rating" aria-label="5 out of 5 stars"><span>★★★★★</span> <small>({{ product.reviews?.length || 12 }})</small></div>
            <RouterLink :to="`/product/${product.id}/${product.slug}`" class="product-title">{{ product.title }}</RouterLink>
            <p class="material">{{ product.author || product.category || '18K gold plated' }}</p>
            <p class="price"><del v-if="isOnSale">KES {{ regularPrice }}</del>KES {{ price }}</p>
        </div>
    </article>
</template>

<style scoped>
.product-tile{min-width:0}.product-image-wrap{display:block;position:relative;aspect-ratio:4/5;background:#ede7dd;overflow:hidden}.product-image-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.2,.6,.3,1)}.product-tile:hover img{transform:scale(1.035)}.badge{position:absolute;z-index:2;left:12px;top:12px;background:#f7f3ed;padding:6px 9px;font-size:8px;letter-spacing:.17em;text-transform:uppercase}.wish{position:absolute;z-index:2;right:12px;top:10px;width:30px;height:30px;border-radius:50%;background:rgba(247,243,237,.9);font:19px Georgia;color:#292722}.image-placeholder{height:100%;display:grid;place-items:center;background:radial-gradient(circle,#f7f3ed,#dfd3c2);color:#a78c65;font:italic 17px Georgia}.quick-view{position:absolute;left:14px;right:14px;bottom:14px;background:rgba(26,26,26,.92);color:white;text-align:center;padding:12px;font-size:9px;letter-spacing:.18em;text-transform:uppercase;transform:translateY(60px);transition:.35s}.product-tile:hover .quick-view{transform:translateY(0)}.product-info{padding-top:16px}.rating{font-size:10px;color:#a9864f;letter-spacing:.05em;margin-bottom:8px}.rating small{color:#888}.product-title{font-family:Georgia,serif;font-size:17px;line-height:1.3;display:block;color:#1a1a1a}.material{font-size:10px;letter-spacing:.08em;color:#777;margin:7px 0 10px;text-transform:uppercase}.price{font-size:13px;font-weight:600;letter-spacing:.03em}
.product-title{font-family:'GFS Didot',Georgia,serif;font-size:20px;line-height:1.25;letter-spacing:-.01em}.price{font-size:15px;font-weight:650;color:#171612}.material{font-family:'Geist',sans-serif;font-weight:450}.badge,.quick-view{font-family:'Geist',sans-serif;font-weight:600}.wish,.image-placeholder{font-family:'GFS Didot',Georgia,serif}
.price del{margin-right:8px;color:#9a948c;font-size:12px;font-weight:400}.price:has(del){color:#9b633b}
@media(hover:none){.quick-view{display:none}.wish{width:40px;height:40px;top:8px;right:8px}}
.product-tile{width:100%;min-width:0}.product-image-wrap{width:100%}
@media(max-width:520px){.product-info{padding-top:11px}.product-title{font-size:16px;line-height:1.2}.material{margin:5px 0 7px;font-size:9px}.price{font-size:13px}.rating{margin-bottom:5px}.wish{width:44px;height:44px;top:4px;right:4px}}
</style>

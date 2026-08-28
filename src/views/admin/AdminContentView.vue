<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { copyDefaultCategories } from "../../config/catalog";
import { DEFAULT_STOREFRONT_CONTENT, normalizeStorefrontContent } from "../../config/storefront";
import GuardedHeroForm from "../../components/admin/GuardedHeroForm.vue";
import ContentFooterForm from "../../components/admin/ContentFooterForm.vue";
import ContentCategoryForm from "../../components/admin/ContentCategoryForm.vue";
import StorefrontContentForm from "../../components/admin/StorefrontContentForm.vue";
import HeroSection from "../../components/sections/HeroSection.vue";
import Footer from "../../components/Footer.vue";

const tabs = [
    { id: "hero", label: "Hero" }, { id: "quickNav", label: "Quick Nav" },
    { id: "collections", label: "Collections" }, { id: "headings", label: "Headings" },
    { id: "gifting", label: "Gifting" }, { id: "layout", label: "Order & Visibility" },
    { id: "footer", label: "Footer" }, { id: "categories", label: "Category Catalog" },
];
const activeTab = ref("hero");
const loading = ref(true);
const hero = ref(null);
const footer = ref(null);
const categories = ref(copyDefaultCategories());
const storefront = ref(normalizeStorefrontContent(DEFAULT_STOREFRONT_CONTENT));
const notice = ref("");

const getContent = async (section, fallback) => {
    try { return (await axios.get(`/contents/${section}`)).data.content; }
    catch (error) { if (error.response?.status === 404) return fallback; throw error; }
};
const load = async () => {
    loading.value = true;
    try {
        const [heroValue, footerValue, categoryValue, storefrontValue] = await Promise.all([
            getContent("hero", null), getContent("footer", null),
            getContent("categories", { categories: copyDefaultCategories() }),
            getContent("storefront", DEFAULT_STOREFRONT_CONTENT),
        ]);
        hero.value = heroValue; footer.value = footerValue;
        categories.value = categoryValue?.categories || copyDefaultCategories();
        storefront.value = normalizeStorefrontContent(storefrontValue);
    } finally { loading.value = false; }
};
const saved = (section, response) => {
    if (section === "hero") hero.value = response.content;
    if (section === "footer") footer.value = response.content;
    if (section === "categories") categories.value = response.content.categories;
    if (section === "storefront") storefront.value = normalizeStorefrontContent(response.content);
    notice.value = "Changes saved.";
    window.setTimeout(() => { notice.value = ""; }, 2500);
};
watch(activeTab, () => { notice.value = ""; });
onMounted(load);
</script>

<template>
    <div class="container mx-auto px-2 sm:px-4 py-5 sm:py-8">
        <div class="mb-6"><h1 class="text-2xl font-bold text-gray-900">Storefront</h1><p class="mt-1 text-sm text-gray-500">Manage homepage merchandising and copy within layout-safe limits.</p></div>
        <nav class="tabs" aria-label="Storefront sections"><button v-for="tab in tabs" :key="tab.id" type="button" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">{{ tab.label }}</button></nav>
        <div v-if="loading" class="py-16 text-center text-gray-500">Loading storefront content…</div>
        <template v-else>
            <p v-if="notice" class="notice">{{ notice }}</p>
            <div v-if="activeTab === 'hero'" class="workspace"><div class="preview"><HeroSection :content="hero" /></div><GuardedHeroForm :content="hero" @saved="saved('hero', $event)" /></div>
            <div v-else-if="activeTab === 'footer'" class="workspace"><div class="preview footer-preview"><Footer :content="footer" preview-mode /></div><ContentFooterForm :content="footer" @saved="saved('footer', $event)" @cancel="load" /></div>
            <div v-else-if="activeTab === 'categories'" class="workspace"><ContentCategoryForm :content="{ categories }" @saved="saved('categories', $event)" @cancel="load" /></div>
            <div v-else class="workspace"><StorefrontContentForm :content="storefront" :categories="categories" :panel="activeTab" @saved="saved('storefront', $event)" /></div>
        </template>
    </div>
</template>

<style scoped>
.tabs{display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid #e5e7eb;margin-bottom:24px;scrollbar-width:none}.tabs button{white-space:nowrap;padding:10px 13px;border-bottom:2px solid transparent;color:#6b7280;font-size:13px;font-weight:600}.tabs button.active{border-color:#9a7c50;color:#6f522d}.workspace{background:white;border-radius:9px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.06)}.preview{max-height:360px;overflow:auto;border:1px solid #e5e7eb;margin-bottom:26px}.footer-preview{background:#111;color:white}.notice{background:#ecfdf5;color:#166534;padding:10px 14px;border-radius:6px;margin-bottom:16px;font-size:13px}@media(max-width:640px){.workspace{padding:14px}.preview{display:none}.tabs{margin-inline:-8px;padding-inline:8px;margin-bottom:16px}.tabs button{min-height:44px}}
</style>

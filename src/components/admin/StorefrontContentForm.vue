<script setup>
import { computed, ref, watch } from "vue";
import axios from "axios";
import { normalizeStorefrontContent, STOREFRONT_SECTION_LABELS } from "../../config/storefront";

const props = defineProps({
    content: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    panel: { type: String, required: true },
});
const emit = defineEmits(["saved"]);
const form = ref(normalizeStorefrontContent(props.content));
const saving = ref(false);
const error = ref("");

watch(() => props.content, (value) => { form.value = normalizeStorefrontContent(value); }, { deep: true });

const activeCategories = computed(() => props.categories.filter((category) => category.status === "active" && category.slug !== "collections"));
const collectionParent = computed(() => props.categories.find((category) => category.slug === "collections"));
const collectionCategories = computed(() => props.categories.filter((category) => category.status === "active" && category.parentId === collectionParent.value?.id));
const categoryName = (id) => props.categories.find((category) => category.id === id)?.name || `Category ${id}`;

const moveSection = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= form.value.sections.order.length) return;
    const next = [...form.value.sections.order];
    [next[index], next[target]] = [next[target], next[index]];
    form.value.sections.order = next;
};

const validate = () => {
    const quickIds = form.value.quickNavCategoryIds.map(Number);
    const collectionIds = form.value.featuredCollections.map((item) => Number(item.categoryId));
    if (quickIds.length !== 6 || new Set(quickIds).size !== 6 || quickIds.some((id) => !id)) return "Choose six different quick-nav categories.";
    if (collectionIds.length !== 4 || new Set(collectionIds).size !== 4 || collectionIds.some((id) => !id)) return "Choose four different featured collections.";
    return "";
};

const save = async () => {
    error.value = validate();
    if (error.value) return;
    saving.value = true;
    try {
        const payload = normalizeStorefrontContent(form.value);
        payload.quickNavCategoryIds = payload.quickNavCategoryIds.map(Number);
        payload.featuredCollections = payload.featuredCollections.map((item) => ({ ...item, categoryId: Number(item.categoryId) }));
        const response = await axios.put("/contents/storefront", { content: payload });
        emit("saved", response.data);
    } catch (requestError) {
        error.value = requestError.response?.data?.issues?.[0]?.message || requestError.response?.data?.error || "Could not save storefront content.";
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <form class="space-y-6" @submit.prevent="save">
        <div v-if="panel === 'quickNav'" class="panel">
            <h3>Quick-nav categories</h3><p class="help">Exactly six active categories. Labels and images are derived automatically.</p>
            <div class="field-grid">
                <label v-for="(_, index) in form.quickNavCategoryIds" :key="index">Position {{ index + 1 }}
                    <select v-model="form.quickNavCategoryIds[index]" required><option disabled value="">Select category</option><option v-for="category in activeCategories" :key="category.id" :value="category.id">{{ category.name }}</option></select>
                </label>
            </div>
        </div>

        <div v-if="panel === 'collections'" class="panel">
            <h3>Featured Collections</h3><p class="help">Exactly four existing collection categories. Collection names cannot drift from Products.</p>
            <div v-for="(item, index) in form.featuredCollections" :key="index" class="collection-row">
                <label>Collection {{ index + 1 }}<select v-model="item.categoryId" required><option disabled value="">Select collection</option><option v-for="category in collectionCategories" :key="category.id" :value="category.id">{{ category.name }}</option></select></label>
                <label>Supporting line <input v-model.trim="item.description" maxlength="90" required /><small>{{ item.description.length }}/90</small></label>
            </div>
        </div>

        <div v-if="panel === 'headings'" class="panel">
            <h3>Section Headings</h3><p class="help">Single-line text only; limits protect the responsive layout.</p>
            <div v-for="key in ['bestSellers', 'featuredCollections', 'newArrivals']" :key="key" class="heading-row">
                <b>{{ STOREFRONT_SECTION_LABELS[key] }}</b>
                <label>Eyebrow <input v-model.trim="form.headings[key].kicker" maxlength="30" required /></label>
                <label>Title <input v-model.trim="form.headings[key].title" maxlength="55" required /></label>
            </div>
        </div>

        <div v-if="panel === 'gifting'" class="panel">
            <h3>Gifting Banner</h3><p class="help">The image is derived from a Gift Set product to preserve its aspect ratio.</p>
            <div class="field-grid">
                <label>Eyebrow <input v-model.trim="form.gifting.eyebrow" maxlength="30" required /></label>
                <label>Heading <input v-model.trim="form.gifting.heading" maxlength="70" required /></label>
                <label class="wide">Body <input v-model.trim="form.gifting.body" maxlength="140" required /></label>
                <label>Button label <input v-model.trim="form.gifting.ctaLabel" maxlength="24" required /></label>
                <label>Button destination <select v-model="form.gifting.ctaRoute"><option value="/gifting">Gift bundles</option><option value="/products">All products</option></select></label>
            </div>
        </div>

        <div v-if="panel === 'layout'" class="panel">
            <h3>Section Order & Visibility</h3><p class="help">The hero is fixed at the top. Product counts, grids, and responsive behavior remain code-controlled.</p>
            <div v-for="(sectionId, index) in form.sections.order" :key="sectionId" class="order-row">
                <span>{{ index + 1 }}. {{ STOREFRONT_SECTION_LABELS[sectionId] }}</span>
                <label class="visibility"><input v-model="form.sections.visibility[sectionId]" type="checkbox" /> Visible</label>
                <button type="button" :disabled="index === 0" @click="moveSection(index, -1)">↑</button><button type="button" :disabled="index === form.sections.order.length - 1" @click="moveSection(index, 1)">↓</button>
            </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <div class="actions"><button type="submit" :disabled="saving">{{ saving ? "Saving…" : "Save storefront" }}</button></div>
    </form>
</template>

<style scoped>
.panel{padding:4px}.panel h3{font-size:18px;font-weight:650;color:#1f2937}.help{font-size:13px;color:#6b7280;margin:5px 0 22px}.field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.wide{grid-column:1/-1}label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#374151}input,select{width:100%;border:1px solid #d1d5db;border-radius:6px;padding:9px 11px;background:white;font-weight:400}small{align-self:flex-end;color:#9ca3af;font-weight:400}.collection-row,.heading-row{display:grid;grid-template-columns:.85fr 1.5fr;gap:18px;padding:18px 0;border-top:1px solid #e5e7eb}.heading-row{grid-template-columns:.65fr 1fr 1fr;align-items:end}.heading-row b{padding-bottom:10px}.order-row{display:grid;grid-template-columns:1fr auto 38px 38px;align-items:center;gap:8px;padding:12px;border-top:1px solid #e5e7eb}.order-row button{border:1px solid #d1d5db;border-radius:5px;padding:6px}.visibility{flex-direction:row;align-items:center}.visibility input{width:auto}.actions{display:flex;justify-content:flex-end}.actions button{background:#1f2937;color:white;border-radius:6px;padding:10px 18px;font-size:13px;font-weight:650}.actions button:disabled{opacity:.55}.error{color:#b91c1c;font-size:13px}@media(max-width:700px){.field-grid,.collection-row,.heading-row{grid-template-columns:1fr}.wide{grid-column:auto}.order-row{grid-template-columns:1fr auto 34px 34px}}
</style>

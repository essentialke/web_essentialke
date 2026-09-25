<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import axios from "axios";
import { copyDefaultCategories } from "../../config/catalog";

const props = defineProps({ category: { type: Object, default: null }, parentId: { type: Number, default: null }, type: { type: String, default: "category" } });
const emit = defineEmits(["saved", "cancel"]);
const catalog = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const nameInput = ref(null);
const name = ref(props.category?.name || "");
const parentId = ref(props.category?.parentId ?? props.parentId);
const status = ref(props.category?.status || "active");
const slug = ref(props.category?.slug || "");
const customSlug = ref(Boolean(props.category));
const generatedSlug = computed(() => name.value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
const title = computed(() => props.category ? "Edit category" : props.type === "collection" ? "Add collection" : parentId.value === null ? "Add category" : "Add subcategory");
function isDescendant(candidate, categories) {
    const seen = new Set();
    while (candidate && !seen.has(candidate.id)) {
        if (candidate.id === props.category?.id) return true;
        seen.add(candidate.id);
        candidate = categories.find(item => item.id === candidate.parentId);
    }
    return false;
}
const parents = computed(() => catalog.value.filter(item => !isDescendant(item, catalog.value)));
function parentLabel(category) {
    const labels = [category.name];
    const seen = new Set([category.id]);
    let parent = catalog.value.find(item => item.id === category.parentId);
    while (parent && !seen.has(parent.id)) {
        seen.add(parent.id); labels.unshift(parent.name);
        parent = catalog.value.find(item => item.id === parent.parentId);
    }
    return labels.join(" / ");
}
async function readCatalog() {
    try { return (await axios.get("/contents/categories")).data.content; }
    catch (err) { if (err.response?.status === 404) return { categories: copyDefaultCategories() }; throw err; }
}
async function load() {
    loading.value = true; error.value = "";
    try { catalog.value = (await readCatalog()).categories; }
    catch { error.value = "Could not load categories. Try again before saving."; }
    finally { loading.value = false; }
    await nextTick(); nameInput.value?.focus();
}
async function save() {
    if (saving.value || loading.value) return;
    error.value = "";
    const cleanName = name.value.trim();
    const cleanSlug = (customSlug.value ? slug.value : generatedSlug.value).trim();
    if (!cleanName) { error.value = "Enter a category name."; nameInput.value?.focus(); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) { error.value = "Add a URL name using lowercase letters, numbers and hyphens in More options."; return; }
    saving.value = true;
    try {
        // Read the latest catalog so adding one item preserves changes made elsewhere.
        const content = await readCatalog();
        const current = content.categories;
        catalog.value = current;
        if (props.category && !current.some(item => item.id === props.category.id)) throw new Error("This category no longer exists. Close the editor and reload.");
        if (current.some(item => item.id !== props.category?.id && (item.name.trim().toLowerCase() === cleanName.toLowerCase() || item.slug.toLowerCase() === cleanSlug.toLowerCase()))) throw new Error("That name or URL name already exists. Choose a different name.");
        const parent = current.find(item => item.id === parentId.value);
        if (parentId.value !== null && (!parent || isDescendant(parent, current))) throw new Error("Choose an existing parent category outside this category's subcategories.");
        const category = { ...props.category, id: props.category?.id ?? Math.max(0, ...current.map(item => item.id)) + 1, name: cleanName, slug: cleanSlug, parentId: parentId.value, status: status.value };
        const categories = props.category ? current.map(item => item.id === category.id ? category : item) : [...current, category];
        const body = new FormData();
        body.append("content", JSON.stringify({ ...content, categories }));
        const response = await axios.put("/contents/categories", body);
        emit("saved", response.data, category);
    } catch (err) { error.value = err.response?.data?.error || (err.response ? "Could not save. Your entries are kept; please try again." : err.message); }
    finally { saving.value = false; }
}
onMounted(load);
</script>

<template>
    <section class="category-editor" :aria-label="title" @keydown.enter.stop>
        <h3>{{ title }}</h3>
        <p v-if="loading" role="status">Loading categories...</p>
        <template v-else>
            <fieldset :disabled="saving">
                <label>{{ props.type === "collection" ? "Collection name" : "Category name" }}<input ref="nameInput" v-model="name" type="text" :placeholder="props.type === 'collection' ? 'e.g. Everyday Collection' : 'e.g. Necklaces or Initial Pendants'" @keydown.enter.prevent="save" /></label>
                <label>Place under<select v-model="parentId"><option :value="null">None — main category</option><option v-for="parent in parents" :key="parent.id" :value="parent.id">{{ parentLabel(parent) }}</option></select></label>
                <p class="help">Choose a parent to make this a subcategory. It will appear inside that category in Shop.</p>
                <details>
                    <summary>More options</summary>
                    <label>Visibility<select v-model="status"><option value="active">Visible in the shop</option><option value="inactive">Hidden from the shop</option></select></label>
                    <label>URL name<input :value="customSlug ? slug : generatedSlug" @input="slug = $event.target.value; customSlug = true" @keydown.enter.prevent="save" /></label>
                    <p class="help">Generated from the name automatically.</p>
                </details>
            </fieldset>
            <p v-if="error" role="alert" class="error">{{ error }} <button type="button" @click="load" :disabled="saving">Reload categories</button></p>
            <div class="actions"><button type="button" :disabled="saving" @click="emit('cancel')">Cancel</button><button type="button" class="primary" :disabled="saving" @click="save">{{ saving ? 'Saving...' : props.category ? 'Save changes' : props.type === 'collection' ? 'Add collection' : parentId === null ? 'Add category' : 'Add subcategory' }}</button></div>
        </template>
    </section>
</template>

<style scoped>
.category-editor{background:#faf8f4;border:1px solid #dfd7ca;border-radius:12px;padding:22px}h3{font-size:18px;font-weight:600;margin-bottom:16px}fieldset{display:grid;gap:14px;min-width:0}label{display:grid;gap:6px;font-size:14px;font-weight:500}input,select{width:100%;min-height:44px;border:1px solid #cfc9be;background:white;border-radius:6px;padding:9px 12px;font-weight:400}.help{font-size:13px;color:#6b655d}summary{cursor:pointer;font-size:13px;padding:8px 0}details label{margin-top:12px}.actions{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}button{min-height:44px;padding:8px 15px;border-radius:6px}.primary{background:#292720;color:white}button:disabled{opacity:.5;cursor:wait}.error{color:#b91c1c;margin-top:14px;font-size:14px}.error button{text-decoration:underline;padding:0}input:focus-visible,select:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid #9a7c50;outline-offset:2px}
</style>

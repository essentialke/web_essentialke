<script setup>
import { computed, nextTick, ref } from 'vue';
import CategoryEditor from './CategoryEditor.vue';
import axios from 'axios';
const props = defineProps({ content: { type: Object, default: null } });
const emit = defineEmits(['saved', 'cancel']);
const search = ref('');
const editor = ref(null);
const editorHost = ref(null);
const addButton = ref(null);
const deleting = ref(false);
const deleteTarget = ref(null);
const error = ref('');
async function removeCategory() {
    if (deleting.value || !deleteTarget.value) return;
    deleting.value = true; error.value = '';
    try {
        let content;
        try { content = (await axios.get('/contents/categories')).data.content; }
        catch (err) { if (err.response?.status !== 404) throw err; content = props.content; }
        if (content.categories.some(item => item.parentId === deleteTarget.value.id)) {
            error.value = 'Move or delete the subcategories first.'; return;
        }
        const body = new FormData();
        body.append('content', JSON.stringify({ ...content, categories: content.categories.filter(item => item.id !== deleteTarget.value.id) }));
        const response = await axios.put('/contents/categories', body);
        emit('saved', response.data);
        deleteTarget.value = null;
        await nextTick(); addButton.value?.focus();
    } catch (err) { error.value = err.response?.data?.error || 'Could not delete the category. Please try again.'; }
    finally { deleting.value = false; }
}
const categories = computed(() => props.content?.categories || []);
const rows = computed(() => {
    const result = [], seen = new Set();
    function visit(category, depth, path) {
        if (seen.has(category.id)) return;
        seen.add(category.id);
        const breadcrumb = [...path, category.name];
        result.push({ ...category, depth, breadcrumb: breadcrumb.join(' / ') });
        categories.value.filter(item => item.parentId === category.id).forEach(item => visit(item, depth + 1, breadcrumb));
    }
    categories.value.filter(item => item.parentId === null).forEach(item => visit(item, 0, []));
    categories.value.filter(item => !seen.has(item.id)).forEach(item => visit(item, 0, []));
    return result.filter(item => item.breadcrumb.toLowerCase().includes(search.value.trim().toLowerCase()));
});
async function openEditor(category = null, parentId = null) {
    editor.value = { category, parentId };
    await nextTick(); editorHost.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
async function closeEditor() { editor.value = null; await nextTick(); addButton.value?.focus(); }
function saved(response, category) { emit('saved', response, category); closeEditor(); }
</script>
<template>
    <section class="category-manager">
        <div class="toolbar">
            <label class="search">Find a category<input v-model="search" type="search" placeholder="Search categories or subcategories" /></label>
            <button ref="addButton" type="button" class="primary" :disabled="Boolean(editor) || Boolean(deleteTarget)" @click="openEditor()">+ Add category</button>
        </div>
        <div v-if="editor" ref="editorHost">
            <CategoryEditor :key="editor.category?.id ?? editor.parentId ?? 'new'" :category="editor.category" :parent-id="editor.parentId" @saved="saved" @cancel="closeEditor" />
        </div>
        <div v-if="deleteTarget" class="delete-confirm" role="region" aria-label="Confirm category deletion">
            <strong>Delete {{ deleteTarget.name }}?</strong>
            <p>This removes the category from the shop. Move or delete any subcategories first.</p>
            <p v-if="error" role="alert">{{ error }}</p>
            <button type="button" :disabled="deleting" @click="deleteTarget = null; error = ''">Cancel</button>
            <button type="button" class="delete-button" :disabled="deleting" @click="removeCategory">{{ deleting ? 'Deleting...' : 'Delete category' }}</button>
        </div>
        <div class="category-list">
            <div v-for="category in rows" :key="category.id" class="category-row">
                <div class="category-info" :style="{ paddingLeft: Math.min(category.depth, 4) * 18 + 'px' }">
                    <span v-if="category.depth" class="branch" aria-hidden="true">&#8627;</span>
                    <div><strong>{{ category.name }}</strong><small v-if="category.depth">{{ category.breadcrumb }}</small><small v-else>Main category</small></div>
                    <span v-if="category.status !== 'active'" class="badge">Hidden</span>
                </div>
                <div class="row-actions"><button type="button" :disabled="Boolean(editor) || Boolean(deleteTarget)" @click="openEditor(null, category.id)">+ Add subcategory<span class="sr-only"> under {{ category.name }}</span></button><button type="button" :disabled="Boolean(editor) || Boolean(deleteTarget)" @click="openEditor(category)">Edit<span class="sr-only"> {{ category.name }}</span></button><button type="button" class="delete-button" :disabled="Boolean(editor) || Boolean(deleteTarget)" @click="deleteTarget = category; error = ''">Delete<span class="sr-only"> {{ category.name }}</span></button></div>
            </div>
            <div v-if="!rows.length" class="empty"><p>{{ categories.length ? 'No matching categories.' : 'Start with your first category.' }}</p><p v-if="!categories.length">Add a main category, then add subcategories beneath it.</p></div>
        </div>
    </section>
</template>
<style scoped>
.delete-confirm{background:#fff7f4;border:1px solid #edc9bd;padding:20px;border-radius:10px}.delete-confirm p{font-size:14px;margin:10px 0}.delete-confirm [role=alert],.row-actions .delete-button,.delete-button{color:#b42318}.row-actions{flex-wrap:wrap}
.category-manager{display:grid;gap:20px}.toolbar{display:flex;align-items:flex-end;gap:16px;justify-content:space-between}.search{display:grid;gap:6px;font-size:13px;color:#625b51;max-width:440px;flex:1}.search input{min-height:44px;padding:10px 12px;border:1px solid #ddd5c9;border-radius:7px;background:white;width:100%}button{min-height:44px;padding:8px 14px;font-size:13px;border-radius:6px}.primary{background:#292720;color:white;white-space:nowrap}.category-list{background:white;border:1px solid #e8e2d8;border-radius:12px;overflow:hidden}.category-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid #eee9e1}.category-row:last-child{border:0}.category-info{display:flex;align-items:center;gap:12px;min-width:0}strong{font-size:14px;font-weight:600;overflow-wrap:anywhere}small{display:block;font-size:12px;color:#81796f;margin-top:3px;overflow-wrap:anywhere}.branch{color:#ac9672}.row-actions{display:flex;gap:6px;flex-shrink:0}.row-actions button{color:#725b37}.row-actions button:hover{background:#f7f3ed}.badge{font-size:11px;background:#f3f0eb;padding:3px 8px;border-radius:12px}.empty{padding:40px 20px;text-align:center;color:#81796f}button:disabled{opacity:.4;cursor:default}button:focus-visible,input:focus-visible{outline:2px solid #9a7c50;outline-offset:2px}@media(max-width:640px){.toolbar{align-items:stretch;flex-direction:column}.search{max-width:none}.category-row{align-items:stretch;flex-direction:column;gap:8px;padding:14px}.row-actions{justify-content:flex-end}}
</style>

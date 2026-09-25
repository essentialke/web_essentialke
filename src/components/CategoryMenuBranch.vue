<script setup>
import { RouterLink } from "vue-router";
const props = defineProps({ categories: { type: Array, required: true }, queryKey: { type: String, default: "category" } });
const linkFor = (category) => ({ path: "/products", query: { [props.queryKey]: category.name } });
</script>

<template>
    <ul class="category-branch">
        <li v-for="category in props.categories" :key="category.id">
            <details v-if="category.children.length">
                <summary>{{ category.name }}<svg class="branch-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg></summary>
                <RouterLink :to="linkFor(category)">All {{ category.name }}</RouterLink>
                <CategoryMenuBranch :categories="category.children" :query-key="props.queryKey" />
            </details>
            <RouterLink v-else :to="linkFor(category)">{{ category.name }}</RouterLink>
        </li>
    </ul>
</template>

<style scoped>
.category-branch{list-style:none;margin:0;padding:0;display:grid;gap:4px}
a,summary{display:block;padding:12px 0;color:inherit;font-size:15px;line-height:1.5;text-decoration:none;cursor:pointer}
summary{display:flex;align-items:center;justify-content:space-between;gap:16px;list-style:none}summary::-webkit-details-marker{display:none}.branch-chevron{width:16px;height:16px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.5;transition:transform .2s}details[open]>summary>.branch-chevron{transform:rotate(90deg)}a:hover{text-decoration:underline;text-underline-offset:5px}
summary{font-weight:600}a,summary{min-height:44px;border-radius:5px;transition:background .15s,color .15s}a:hover,summary:hover{background:#f3ede3;color:#654c2c}details[open]>summary{color:#775b34}details>a,details>.category-branch{margin-left:14px;padding-left:14px;border-left:1px solid #dfd2be}a:focus-visible,summary:focus-visible{outline:2px solid #9a7c50;outline-offset:3px}
</style>

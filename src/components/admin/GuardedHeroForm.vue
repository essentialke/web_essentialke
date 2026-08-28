<script setup>
import { computed, ref, watch } from "vue";
import axios from "axios";

const props = defineProps({ content: { type: Object, default: null } });
const emit = defineEmits(["saved"]);
const defaults = () => ({
    eyebrow: "Signature collection",
    leftSection: { title: { mainText: "Find yourself in meaningful jewelry", highlightedText: "", endText: "" }, description: "Made to live with you, every day.", buttons: [], features: [] },
    cta: { label: "Shop now", route: "/products" },
    rightSection: { slides: [{ id: 1, image: "", alt: "Essential jewelry collection", stats: {} }] },
});
const normalize = (content) => {
    const base = defaults(); const value = content || {};
    const title = [value.leftSection?.title?.mainText, value.leftSection?.title?.highlightedText, value.leftSection?.title?.endText].filter(Boolean).join(" ") || base.leftSection.title.mainText;
    return { ...base, ...value, eyebrow: value.eyebrow || base.eyebrow, cta: { ...base.cta, ...value.cta }, leftSection: { ...base.leftSection, ...value.leftSection, title: { mainText: title, highlightedText: "", endText: "" } }, rightSection: { slides: [value.rightSection?.slides?.[0] || base.rightSection.slides[0]] } };
};
const form = ref(normalize(props.content));
const file = ref(null); const preview = ref(""); const error = ref(""); const saving = ref(false);
watch(() => props.content, (value) => { form.value = normalize(value); }, { deep: true });
const title = computed({ get: () => form.value.leftSection.title.mainText, set: (value) => { form.value.leftSection.title.mainText = value; } });
const selectImage = (event) => {
    error.value = ""; const selected = event.target.files?.[0]; if (!selected) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type) || selected.size > 5 * 1024 * 1024) { error.value = "Use a JPEG, PNG, or WebP image no larger than 5 MB."; event.target.value = ""; return; }
    const image = new Image(); image.onload = () => { const ratio = image.width / image.height; URL.revokeObjectURL(image.src); if (ratio < 2 || ratio > 3) { error.value = "Hero images must be landscape with an aspect ratio between 2:1 and 3:1."; event.target.value = ""; return; } file.value = selected; preview.value = URL.createObjectURL(selected); };
    image.src = URL.createObjectURL(selected);
};
const save = async () => {
    error.value = ""; saving.value = true;
    try { const payload = normalize(form.value); const data = new FormData(); data.append("content", JSON.stringify(payload)); if (file.value) data.append("rightSection.slides[0].image", file.value); const response = await axios.put("/contents/hero", data); emit("saved", response.data); file.value = null; }
    catch (requestError) { error.value = requestError.response?.data?.error || "Could not save hero content."; }
    finally { saving.value = false; }
};
</script>
<template>
    <form class="hero-form" @submit.prevent="save">
        <p class="help">Copy is single-line and length-limited. One validated landscape image is allowed.</p>
        <div class="fields">
            <label>Eyebrow <input v-model.trim="form.eyebrow" maxlength="30" required /></label>
            <label>Headline <input v-model.trim="title" maxlength="55" required /></label>
            <label class="wide">Description <input v-model.trim="form.leftSection.description" maxlength="100" required /></label>
            <label>Button label <input v-model.trim="form.cta.label" maxlength="20" required /></label>
            <label>Button destination <select v-model="form.cta.route"><option value="/products">All products</option></select></label>
            <label class="wide">Hero image <input type="file" accept="image/jpeg,image/png,image/webp" @change="selectImage" /><small>JPEG, PNG or WebP · max 5 MB · ratio 2:1–3:1</small></label>
        </div>
        <img v-if="preview" :src="preview" class="image-preview" alt="New hero preview" />
        <p v-if="error" class="error">{{ error }}</p><div class="actions"><button :disabled="saving">{{ saving ? "Saving…" : "Save hero" }}</button></div>
    </form>
</template>
<style scoped>
.hero-form{padding-top:6px}.help{font-size:13px;color:#6b7280;margin-bottom:20px}.fields{display:grid;grid-template-columns:1fr 1fr;gap:18px}.wide{grid-column:1/-1}label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#374151}input,select{border:1px solid #d1d5db;border-radius:6px;padding:9px 11px;background:#fff;font-weight:400}small{font-weight:400;color:#6b7280}.image-preview{max-width:360px;margin-top:18px;aspect-ratio:2.4/1;object-fit:cover}.actions{display:flex;justify-content:flex-end;margin-top:20px}.actions button{background:#1f2937;color:#fff;border-radius:6px;padding:10px 18px;font-weight:650}.error{color:#b91c1c;margin-top:12px;font-size:13px}@media(max-width:700px){.fields{grid-template-columns:1fr}.wide{grid-column:auto}}
</style>

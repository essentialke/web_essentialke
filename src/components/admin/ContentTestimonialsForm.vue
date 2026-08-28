<template>
    <form class="space-y-6" @submit.prevent="saveContent">
        <div class="flex items-center justify-between">
            <div><h3 class="text-lg font-semibold">Testimonials</h3><p class="text-sm text-gray-500">Manage the customer notes shown on the home page.</p></div>
            <button type="button" class="rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600" @click="addTestimonial">Add testimonial</button>
        </div>
        <div class="grid gap-4">
            <article v-for="(testimonial, index) in formData.testimonials" :key="testimonial.id" class="rounded-lg border border-gray-200 p-4">
                <div class="mb-4 flex items-center justify-between"><h4 class="font-medium">Testimonial {{ index + 1 }}</h4><button type="button" class="text-sm font-medium text-red-600 hover:text-red-800" @click="removeTestimonial(index)">Remove</button></div>
                <div class="grid gap-4 md:grid-cols-2">
                    <label class="text-sm font-medium text-gray-700">Customer name<input v-model.trim="testimonial.name" required maxlength="80" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Amina K." /></label>
                    <label class="text-sm font-medium text-gray-700">Rating<select v-model.number="testimonial.rating" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"><option v-for="rating in 5" :key="rating" :value="rating">{{ rating }} star{{ rating === 1 ? "" : "s" }}</option></select></label>
                    <label class="text-sm font-medium text-gray-700 md:col-span-2">Testimonial<textarea v-model.trim="testimonial.quote" required maxlength="500" rows="4" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Share the customer's experience..."></textarea></label>
                    <label class="flex items-center gap-2 text-sm text-gray-700 md:col-span-2"><input v-model="testimonial.verified" type="checkbox" class="rounded border-gray-300" />Show as verified buyer</label>
                </div>
            </article>
            <p v-if="formData.testimonials.length === 0" class="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">No testimonials yet. Add one to display it on the home page.</p>
        </div>
        <div class="flex justify-end gap-4"><button type="button" class="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300" @click="$emit('cancel')">Cancel</button><button type="submit" class="rounded-md bg-primary px-4 py-2 text-white hover:bg-secondary disabled:opacity-60" :disabled="saving">{{ saving ? "Saving..." : "Save testimonials" }}</button></div>
    </form>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useSnackbarStore } from "../../stores/snackbar";

const props = defineProps({ content: { type: Object, default: null } });
const emit = defineEmits(["saved", "cancel"]);
const snackbarStore = useSnackbarStore();
const saving = ref(false);
const cloneContent = (content) => JSON.parse(JSON.stringify(content || { testimonials: [] }));
const formData = ref(cloneContent(props.content));

const addTestimonial = () => formData.value.testimonials.push({ id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${formData.value.testimonials.length}`, name: "", quote: "", rating: 5, verified: true });
const removeTestimonial = (index) => formData.value.testimonials.splice(index, 1);
const saveContent = async () => {
    saving.value = true;
    try {
        const response = await axios.put("/contents/testimonials", { content: formData.value });
        emit("saved", response.data);
    } catch (error) {
        console.error("Error saving testimonials:", error);
        snackbarStore.addSnackbar({ message: "Failed to save testimonials. Please try again.", type: "error" });
    } finally { saving.value = false; }
};
watch(() => props.content, (content) => { formData.value = cloneContent(content); });
</script>

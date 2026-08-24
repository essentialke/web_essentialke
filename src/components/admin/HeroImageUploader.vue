<template>
    <section class="rounded-lg bg-white p-6 shadow-md" aria-labelledby="hero-image-heading">
        <div class="mb-5">
            <h2 id="hero-image-heading" class="text-lg font-semibold text-gray-900">
                Homepage hero image
            </h2>
            <p class="mt-1 text-sm text-gray-500">
                Upload the large banner displayed at the top of the homepage.
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
            <div class="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                <img
                    v-if="previewUrl"
                    :src="previewUrl"
                    :alt="heroContent.rightSection.slides[0].alt || 'Current homepage hero'"
                    class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full items-center justify-center text-sm text-gray-500">
                    No hero image uploaded
                </div>
            </div>

            <form class="flex flex-col justify-center" @submit.prevent="uploadHero">
                <label for="hero-image" class="text-sm font-medium text-gray-700">
                    Choose image
                </label>
                <input
                    id="hero-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="mt-2 block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-secondary"
                    @change="selectImage"
                />
                <p class="mt-2 text-xs text-gray-500">
                    JPEG, PNG, or WebP. Minimum 1600 × 900 px; 1920 × 1080 px recommended.
                </p>
                <button
                    type="submit"
                    :disabled="!selectedFile || saving"
                    class="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {{ saving ? "Uploading…" : "Upload hero image" }}
                </button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import axios from "axios";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { useSnackbarStore } from "../../stores/snackbar";

const defaultContent = () => ({
    leftSection: {
        title: { mainText: "", highlightedText: "", endText: "" },
        description: "",
        buttons: [],
        features: [],
    },
    rightSection: {
        slides: [{ id: 1, image: "", alt: "Homepage hero", stats: {} }],
    },
});

const heroContent = ref(defaultContent());
const selectedFile = ref(null);
const localPreviewUrl = ref("");
const saving = ref(false);
const snackbarStore = useSnackbarStore();

const previewUrl = computed(() =>
    localPreviewUrl.value || resolveAssetUrl(heroContent.value.rightSection.slides[0].image),
);

const showMessage = (message, type) => snackbarStore.addSnackbar({ message, type });

const ensureHeroShape = (content) => {
    const normalized = content && typeof content === "object" ? content : defaultContent();
    normalized.leftSection ||= defaultContent().leftSection;
    normalized.rightSection ||= { slides: [] };
    normalized.rightSection.slides ||= [];
    normalized.rightSection.slides[0] ||= defaultContent().rightSection.slides[0];
    return normalized;
};

const loadHero = async () => {
    try {
        const response = await axios.get("/contents/hero");
        heroContent.value = ensureHeroShape(response.data.content);
    } catch (error) {
        if (error.response?.status !== 404) {
            showMessage("Could not load the current hero image.", "error");
        }
    }
};

const imageDimensions = (file) => new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
        URL.revokeObjectURL(url);
    };
    image.onerror = () => {
        reject(new Error("The selected image could not be read."));
        URL.revokeObjectURL(url);
    };
    image.src = url;
});

const selectImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const { width, height } = await imageDimensions(file);
        if (width < 1600 || height < 900) {
            throw new Error(`Image is ${width} × ${height} px. Minimum size is 1600 × 900 px.`);
        }

        if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
        selectedFile.value = file;
        localPreviewUrl.value = URL.createObjectURL(file);
    } catch (error) {
        selectedFile.value = null;
        event.target.value = "";
        showMessage(error.message, "error");
    }
};

const uploadHero = async () => {
    if (!selectedFile.value) return;
    saving.value = true;

    try {
        const data = new FormData();
        data.append("content", JSON.stringify(heroContent.value));
        data.append("rightSection.slides[0].image", selectedFile.value);

        const response = await axios.put("/contents/hero", data);
        heroContent.value = ensureHeroShape(response.data.content);
        selectedFile.value = null;
        if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
        localPreviewUrl.value = "";
        showMessage("Homepage hero image updated.", "success");
    } catch (error) {
        showMessage(error.response?.data?.error || "Hero image upload failed.", "error");
    } finally {
        saving.value = false;
    }
};

onMounted(loadHero);
onBeforeUnmount(() => {
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
});
</script>

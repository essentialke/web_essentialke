<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
                Title
            </label>
            <input
                type="text"
                id="title"
                v-model="formData.title"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.title" class="text-red-500 text-xs">{{
                errors.title
            }}</span>
        </div>

        <div>
            <label for="slug" class="block text-sm font-medium text-gray-700">
                Slug
            </label>
            <input
                type="text"
                id="slug"
                v-model="formData.slug"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.slug" class="text-red-500 text-xs">{{
                errors.slug
            }}</span>
        </div>

        <div>
            <label for="kind" class="block text-sm font-medium text-gray-700">
                Kind
            </label>
            <input
                type="text"
                id="kind"
                v-model="formData.kind"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span v-if="errors.kind" class="text-red-500 text-xs">{{
                errors.kind
            }}</span>
        </div>

        <div>
            <label
                for="content"
                class="block text-sm font-medium text-gray-700"
            >
                Content
            </label>
            <EditorContent
                :editor="editor"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary min-h-[150px]"
            />
            <span v-if="errors.content" class="text-red-500 text-xs">{{
                errors.content
            }}</span>
        </div>

        <!-- Tiptap Toolbar -->
        <div class="flex space-x-2">
            <button
                type="button"
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor?.isActive('bold') }"
                class="rich-button"
            >
                Bold
            </button>
            <button
                type="button"
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor?.isActive('italic') }"
                class="rich-button"
            >
                Italic
            </button>
            <button
                type="button"
                @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
                :class="{
                    'is-active': editor?.isActive('heading', { level: 2 }),
                }"
                class="rich-button"
            >
                Heading
            </button>
            <button
                type="button"
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor?.isActive('bulletList') }"
                class="rich-button"
            >
                List
            </button>
        </div>

        <!-- Image Upload Section -->
        <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
                Image (Optional)
            </label>
            <input
                type="file"
                id="image"
                ref="imageInput"
                @change="onFileSelected"
                accept="image/*"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p v-if="formData.imageUrl" class="mt-2 text-sm text-gray-500">
                Current Image URL: {{ formData.imageUrl }}
            </p>
            <span v-if="errors.imageUrl" class="text-red-500 text-xs">{{
                errors.imageUrl
            }}</span>
        </div>

        <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="onCancel"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            >
                Cancel
            </button>
            <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                Save
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";

const props = defineProps({
    generalPost: Object, // Still using generalPost prop for now, can rename later if needed
});

const emit = defineEmits(["save", "cancel"]);

const isEditing = ref(false);
const formData = ref({
    title: "",
    slug: "",
    kind: "",
    content: "",
    imageUrl: null,
    image: null,
});

const errors = ref({});

const editor = useEditor({
    content: ref(formData.value.content),
    extensions: [StarterKit],
    onUpdate({ editor }) {
        formData.value.content = editor.getHTML();
    },
});

onMounted(() => {
    if (props.generalPost) {
        isEditing.value = true;
        formData.value = { ...props.generalPost };
        editor.value.commands.setContent(props.generalPost.content || "");
    }
});

watch(
    () => props.generalPost,
    (newGeneralPost) => {
        if (newGeneralPost) {
            isEditing.value = true;
            formData.value = { ...newGeneralPost };
            editor.value?.commands.setContent(newGeneralPost.content || "");
        } else {
            isEditing.value = false;
            formData.value = {
                title: "",
                slug: "",
                kind: "",
                content: "",
                imageUrl: null,
                image: null,
            };
            editor.value?.commands.setContent("");
        }
        errors.value = {};
    },
    { deep: true },
);

onBeforeUnmount(() => {
    editor.value?.destroy();
});

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.title) {
        errors.value.title = "Title is required.";
        isValid = false;
    }
    if (!formData.value.slug) {
        errors.value.slug = "Slug is required.";
        isValid = false;
    }
    if (!formData.value.kind) {
        errors.value.kind = "Kind is required.";
        isValid = false;
    }

    if (!formData.value.content) {
        errors.value.content = "Content is required.";
        isValid = false;
    }

    return isValid;
};

const onFileSelected = (event) => {
    const file = event.target.files[0];
    formData.value.image = file;
    formData.value.imageUrl = null;
};

const onSubmit = async () => {
    if (!validateForm()) return;

    const form = new FormData();
    form.append("title", formData.value.title);
    form.append("slug", formData.value.slug);
    form.append("kind", formData.value.kind);
    form.append("content", formData.value.content);

    if (formData.value.image) {
        form.append("image", formData.value.image);
    }

    if (formData.value.imageUrl && !formData.value.image) {
        form.append("imageUrl", formData.value.imageUrl);
    }

    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        let response;
        if (isEditing.value && props.generalPost) {
            response = await axios.put(
                `/general-posts/${props.generalPost.id}`,
                form,
                config,
            );
        } else {
            response = await axios.post("/general-posts", form, config);
        }

        if (response.data.imageUrl) {
            formData.value.imageUrl = response.data.imageUrl;
        }

        emit("save");
    } catch (error) {
        console.error("Error saving dynamic content:", error);
        if (error.response?.data?.error) {
            if (Array.isArray(error.response.data.error)) {
                error.response.data.error.forEach((err) => {
                    errors.value[err.path[0]] = err.message;
                });
            } else {
                errors.value.general = error.response.data.error;
            }
        } else {
            errors.value.general = "Error saving content.";
        }
    }
};

const onCancel = () => {
    errors.value = {};
    emit("cancel");
};
</script>

<style scoped>
.rich-button {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded inline-flex items-center text-sm;
}
.rich-button.is-active {
    @apply bg-blue-500 text-white hover:bg-blue-600;
}

:deep(.ProseMirror) {
    outline: none;
    width: 100%;
    min-height: 150px;
}

:deep(.ProseMirror p) {
    margin: 0;
}

:deep(.ProseMirror-focused) {
    outline: none;
    border: none;
    box-shadow: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
    color: #9ca3af;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}
</style>

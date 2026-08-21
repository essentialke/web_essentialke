<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Title field -->
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700"
                >Title</label
            >
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

        <!-- Content Type Selection -->
        <div>
            <label for="kind" class="block text-sm font-medium text-gray-700"
                >Content Type</label
            >
            <select
                id="kind"
                v-model="formData.kind"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                <option value="blog">Blog Post</option>
                <option value="page">Static Page</option>
            </select>
            <span v-if="errors.kind" class="text-red-500 text-xs">{{
                errors.kind
            }}</span>
        </div>

        <!-- Slug field -->
        <div>
            <label for="slug" class="block text-sm font-medium text-gray-700"
                >URL Slug</label
            >
            <div class="flex items-center mt-1">
                <span class="text-gray-500 mr-1">/</span>
                <input
                    type="text"
                    id="slug"
                    v-model="formData.slug"
                    placeholder="auto-generated-from-title"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>
            <p class="mt-1 text-xs text-gray-500">
                Leave empty to auto-generate from title
            </p>
            <span v-if="errors.slug" class="text-red-500 text-xs">{{
                errors.slug
            }}</span>
        </div>

        <!-- Rich Text Editor -->
        <div>
            <label
                for="content"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Content</label
            >

            <!-- Tiptap Toolbar -->
            <div
                class="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1"
            >
                <button
                    type="button"
                    @click="
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    "
                    :class="{
                        'is-active': editor?.isActive('heading', { level: 1 }),
                    }"
                    class="editor-btn"
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    @click="
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    "
                    :class="{
                        'is-active': editor?.isActive('heading', { level: 2 }),
                    }"
                    class="editor-btn"
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    @click="
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    "
                    :class="{
                        'is-active': editor?.isActive('heading', { level: 3 }),
                    }"
                    class="editor-btn"
                    title="Heading 3"
                >
                    H3
                </button>
                <div class="h-6 w-px bg-gray-300 mx-1"></div>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor?.isActive('bold') }"
                    class="editor-btn"
                    title="Bold"
                >
                    <i class="fas fa-bold"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor?.isActive('italic') }"
                    class="editor-btn"
                    title="Italic"
                >
                    <i class="fas fa-italic"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor?.isActive('strike') }"
                    class="editor-btn"
                    title="Strikethrough"
                >
                    <i class="fas fa-strikethrough"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor?.isActive('code') }"
                    class="editor-btn"
                    title="Inline Code"
                >
                    <i class="fas fa-code"></i>
                </button>
                <div class="h-6 w-px bg-gray-300 mx-1"></div>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor?.isActive('bulletList') }"
                    class="editor-btn"
                    title="Bullet List"
                >
                    <i class="fas fa-list-ul"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor?.isActive('orderedList') }"
                    class="editor-btn"
                    title="Numbered List"
                >
                    <i class="fas fa-list-ol"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleTaskList().run()"
                    :class="{ 'is-active': editor?.isActive('taskList') }"
                    class="editor-btn"
                    title="Task List"
                >
                    <i class="fas fa-tasks"></i>
                </button>
                <div class="h-6 w-px bg-gray-300 mx-1"></div>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'is-active': editor?.isActive('blockquote') }"
                    class="editor-btn"
                    title="Blockquote"
                >
                    <i class="fas fa-quote-right"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().setHorizontalRule().run()"
                    class="editor-btn"
                    title="Horizontal Rule"
                >
                    <i class="fas fa-minus"></i>
                </button>
                <div class="h-6 w-px bg-gray-300 mx-1"></div>
                <button
                    type="button"
                    @click="editor.chain().focus().setTextAlign('left').run()"
                    :class="{
                        'is-active': editor?.isActive({ textAlign: 'left' }),
                    }"
                    class="editor-btn"
                    title="Align Left"
                >
                    <i class="fas fa-align-left"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().setTextAlign('center').run()"
                    :class="{
                        'is-active': editor?.isActive({ textAlign: 'center' }),
                    }"
                    class="editor-btn"
                    title="Align Center"
                >
                    <i class="fas fa-align-center"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().setTextAlign('right').run()"
                    :class="{
                        'is-active': editor?.isActive({ textAlign: 'right' }),
                    }"
                    class="editor-btn"
                    title="Align Right"
                >
                    <i class="fas fa-align-right"></i>
                </button>
                <div class="h-6 w-px bg-gray-300 mx-1"></div>
                <button
                    type="button"
                    @click="editor.chain().focus().undo().run()"
                    class="editor-btn"
                    title="Undo"
                >
                    <i class="fas fa-undo"></i>
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().redo().run()"
                    class="editor-btn"
                    title="Redo"
                >
                    <i class="fas fa-redo"></i>
                </button>
            </div>

            <EditorContent
                :editor="editor"
                class="mt-0 block w-full px-3 py-2 border border-t-0 border-gray-300 rounded-b-md shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary min-h-[300px] prose max-w-none"
            />
            <span v-if="errors.content" class="text-red-500 text-xs">{{
                errors.content
            }}</span>
        </div>

        <!-- Image Upload Section with Preview -->
        <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
                Featured Image (Optional)
            </label>
            <div class="flex items-start space-x-4">
                <!-- Image Preview -->
                <div
                    v-if="imagePreviewUrl"
                    class="h-32 w-32 overflow-hidden rounded border border-gray-300 bg-gray-100"
                >
                    <img
                        :src="imagePreviewUrl"
                        alt="Featured image preview"
                        class="h-full w-full object-cover"
                    />
                </div>
                <div class="flex-1">
                    <input
                        type="file"
                        id="image"
                        ref="imageInput"
                        @change="onFileSelected"
                        accept="image/*"
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <span v-if="errors.imageUrl" class="text-red-500 text-xs">{{
                        errors.imageUrl
                    }}</span>
                </div>
            </div>
        </div>

        <!-- Published Checkbox -->
        <div>
            <input
                type="checkbox"
                id="published"
                v-model="formData.published"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
                for="published"
                class="ml-2 text-sm font-medium text-gray-700"
                >Published</label
            >
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
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlock from "@tiptap/extension-code-block";
import axios from "axios";

const props = defineProps({
    generalPost: Object,
});

const emit = defineEmits(["save", "cancel"]);

const isEditing = ref(false);
const formData = ref({
    title: "",
    content: "",
    kind: "blog", // Default to blog
    slug: "",
    published: false,
    imageUrl: null,
    image: null,
});

const errors = ref({});
const localImageUrl = ref(null);

// Compute image preview URL
const imagePreviewUrl = computed(() => {
    // If there's a local file selected, use that
    if (localImageUrl.value) {
        return localImageUrl.value;
    }

    // Otherwise use the existing imageUrl (if editing)
    if (formData.value.imageUrl) {
        if (formData.value.imageUrl.startsWith("http")) {
            return formData.value.imageUrl;
        } else {
            const baseUrl = import.meta.env.DEV
                ? "http://localhost:3000"
                : import.meta.env.VITE_ASSET_URL;
            return `${baseUrl}${formData.value.imageUrl}`;
        }
    }

    return null;
});

const editor = useEditor({
    content: ref(formData.value.content),
    extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
            types: ["heading", "paragraph"],
        }),
        Typography,
        Placeholder.configure({
            placeholder: "Write your content here...",
        }),
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        CodeBlock.configure({
            languageClassPrefix: "language-",
        }),
    ],
    onUpdate({ editor }) {
        formData.value.content = editor.getHTML();
    },
});

// Generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
};

// Watch title changes to suggest a slug (only if slug is empty)
watch(
    () => formData.value.title,
    (newTitle) => {
        if (!formData.value.slug && newTitle) {
            formData.value.slug = generateSlug(newTitle);
        }
    },
);

onMounted(() => {
    if (props.generalPost) {
        isEditing.value = true;
        formData.value = {
            ...props.generalPost,
            kind: props.generalPost.kind || "blog",
        };
        editor.value?.commands.setContent(props.generalPost.content || "");
    }
});

watch(
    () => props.generalPost,
    (newGeneralPost) => {
        if (newGeneralPost) {
            isEditing.value = true;
            formData.value = {
                ...newGeneralPost,
                kind: newGeneralPost.kind || "blog",
            };
            editor.value?.commands.setContent(newGeneralPost.content || "");
            localImageUrl.value = null; // Reset local image
        } else {
            isEditing.value = false;
            formData.value = {
                title: "",
                content: "",
                kind: "blog",
                slug: "",
                published: false,
                imageUrl: null,
                image: null,
            };
            editor.value?.commands.setContent("");
            localImageUrl.value = null; // Reset local image
        }
        errors.value = {};
    },
    { deep: true },
);

onBeforeUnmount(() => {
    editor.value?.destroy();

    // Clean up any created object URLs to prevent memory leaks
    if (localImageUrl.value) {
        URL.revokeObjectURL(localImageUrl.value);
    }
});

const validateForm = () => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.title) {
        errors.value.title = "Title is required.";
        isValid = false;
    }

    if (!formData.value.content) {
        errors.value.content = "Content is required.";
        isValid = false;
    }

    if (!formData.value.kind) {
        errors.value.kind = "Content type is required.";
        isValid = false;
    }

    return isValid;
};

const onFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        formData.value.image = file;

        // Create a local URL for preview
        if (localImageUrl.value) {
            URL.revokeObjectURL(localImageUrl.value);
        }
        localImageUrl.value = URL.createObjectURL(file);
    }
};

const onSubmit = async () => {
    if (!validateForm()) return;

    const form = new FormData();
    form.append("title", formData.value.title);
    form.append("content", formData.value.content);
    form.append("kind", formData.value.kind);
    form.append("published", String(formData.value.published));

    if (formData.value.slug) {
        form.append("slug", formData.value.slug);
    }

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

        // Clean up any created object URLs
        if (localImageUrl.value) {
            URL.revokeObjectURL(localImageUrl.value);
            localImageUrl.value = null;
        }

        emit("save");
    } catch (error) {
        console.error("Error saving general post:", error);
        if (error.response?.data?.error) {
            if (Array.isArray(error.response.data.error)) {
                error.response.data.error.forEach((err) => {
                    errors.value[err.path[0]] = err.message;
                });
            } else {
                errors.value.general = error.response.data.error;
            }
        } else {
            errors.value.general = "Error saving post.";
        }
    }
};

const onCancel = () => {
    errors.value = {};

    // Clean up any created object URLs
    if (localImageUrl.value) {
        URL.revokeObjectURL(localImageUrl.value);
        localImageUrl.value = null;
    }

    emit("cancel");
};
</script>

<style scoped>
.editor-btn {
    @apply rounded p-1.5 hover:bg-gray-200 transition-colors;
    min-width: 32px;
}
.editor-btn.is-active {
    @apply bg-blue-100 text-blue-700;
}

:deep(.ProseMirror) {
    outline: none;
    width: 100%;
    min-height: 300px;
    overflow-y: auto;
}

:deep(.ProseMirror p) {
    margin: 0.5em 0;
}

:deep(.ProseMirror h1) {
    font-size: 1.75em;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
}

:deep(.ProseMirror h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
}

:deep(.ProseMirror h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
}

:deep(.ProseMirror blockquote) {
    border-left: 3px solid #ddd;
    padding-left: 1em;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
}

:deep(.ProseMirror ul[data-type="taskList"]) {
    list-style: none;
    padding: 0;
}

:deep(.ProseMirror ul[data-type="taskList"] li) {
    display: flex;
    align-items: flex-start;
}

:deep(.ProseMirror ul[data-type="taskList"] li > label) {
    margin-right: 0.5em;
    user-select: none;
}

:deep(.ProseMirror ul[data-type="taskList"] li > div) {
    flex: 1;
    margin-top: 0;
}

:deep(.ProseMirror code) {
    background-color: rgba(#616161, 0.1);
    color: #616161;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family:
        "SF Mono", Monaco, Menlo, Consolas, "Liberation Mono", "Courier New",
        monospace;
    font-size: 0.85em;
}

:deep(.ProseMirror pre) {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
}

:deep(.ProseMirror pre code) {
    color: inherit;
    padding: 0;
    background: none;
    font-size: 0.85rem;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
    color: #9ca3af;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

:deep(.ProseMirror hr) {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 1.5rem 0;
}
</style>

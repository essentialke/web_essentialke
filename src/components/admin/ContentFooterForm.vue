<template>
    <form @submit.prevent="saveContent" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Brand Section -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-4">Brand Information</h3>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700"
                        >Brand Description</label
                    >
                    <textarea
                        v-model="formData.brand.description"
                        rows="3"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    ></textarea>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700"
                        >Tagline</label
                    >
                    <textarea
                        v-model="formData.brand.tagline"
                        rows="2"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    ></textarea>
                </div>

                <!-- Social Links Table -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium">Social Links</h4>
                        <button
                            type="button"
                            @click="addSocialLink"
                            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Add Link
                        </button>
                    </div>

                    <div class="border rounded-md overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        URL
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Icon
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr
                                    v-for="(
                                        link, index
                                    ) in formData.socialLinks"
                                    :key="index"
                                    class="hover:bg-gray-50"
                                >
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.name"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.url"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <select
                                            v-model="link.icon[1]"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        >
                                            <option value="facebook-f">
                                                Facebook
                                            </option>
                                            <option value="twitter">
                                                Twitter
                                            </option>
                                            <option value="instagram">
                                                Instagram
                                            </option>
                                            <option value="tiktok">
                                                TikTok
                                            </option>
                                        </select>
                                    </td>
                                    <td
                                        class="px-2 py-2 whitespace-nowrap text-right"
                                    >
                                        <button
                                            type="button"
                                            @click="removeSocialLink(index)"
                                            class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="formData.socialLinks.length === 0">
                                    <td
                                        colspan="4"
                                        class="px-3 py-4 text-center text-sm text-gray-500"
                                    >
                                        No social links added. Click "Add Link"
                                        to create one.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Location -->
                <div class="mb-6">
                    <h4 class="font-medium mb-3">Store Location</h4>
                    <input
                        type="text"
                        v-model="formData.location"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <!-- Contact -->
                <div class="mb-6">
                    <h4 class="font-medium mb-3">Contact Number</h4>
                    <input
                        type="text"
                        v-model="formData.contactNumber"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <!-- Links Section -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <!-- Quick Links Table -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium">Quick Links</h4>
                        <button
                            type="button"
                            @click="addQuickLink"
                            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Add Link
                        </button>
                    </div>

                    <div class="border rounded-md overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        URL
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr
                                    v-for="(link, index) in formData.quickLinks"
                                    :key="index"
                                    class="hover:bg-gray-50"
                                >
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.name"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.url"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td
                                        class="px-2 py-2 whitespace-nowrap text-right"
                                    >
                                        <button
                                            type="button"
                                            @click="removeQuickLink(index)"
                                            class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="formData.quickLinks.length === 0">
                                    <td
                                        colspan="3"
                                        class="px-3 py-4 text-center text-sm text-gray-500"
                                    >
                                        No quick links added. Click "Add Link"
                                        to create one.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Help Links Table -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium">Help Links</h4>
                        <button
                            type="button"
                            @click="addHelpLink"
                            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Add Link
                        </button>
                    </div>

                    <div class="border rounded-md overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        URL
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr
                                    v-for="(link, index) in formData.helpLinks"
                                    :key="index"
                                    class="hover:bg-gray-50"
                                >
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.name"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.url"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td
                                        class="px-2 py-2 whitespace-nowrap text-right"
                                    >
                                        <button
                                            type="button"
                                            @click="removeHelpLink(index)"
                                            class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="formData.helpLinks.length === 0">
                                    <td
                                        colspan="3"
                                        class="px-3 py-4 text-center text-sm text-gray-500"
                                    >
                                        No help links added. Click "Add Link" to
                                        create one.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Legal Links Table -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium">Legal Links</h4>
                        <button
                            type="button"
                            @click="addLegalLink"
                            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Add Link
                        </button>
                    </div>

                    <div class="border rounded-md overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        URL
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr
                                    v-for="(link, index) in formData.legalLinks"
                                    :key="index"
                                    class="hover:bg-gray-50"
                                >
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.name"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td class="px-2 py-2 whitespace-nowrap">
                                        <input
                                            type="text"
                                            v-model="link.url"
                                            class="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </td>
                                    <td
                                        class="px-2 py-2 whitespace-nowrap text-right"
                                    >
                                        <button
                                            type="button"
                                            @click="removeLegalLink(index)"
                                            class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="formData.legalLinks.length === 0">
                                    <td
                                        colspan="3"
                                        class="px-3 py-4 text-center text-sm text-gray-500"
                                    >
                                        No legal links added. Click "Add Link"
                                        to create one.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Newsletter -->
                <div class="mb-6">
                    <h4 class="font-medium mb-3">Newsletter Section</h4>

                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700"
                            >Title</label
                        >
                        <input
                            type="text"
                            v-model="formData.newsletter.title"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >Description</label
                        >
                        <textarea
                            v-model="formData.newsletter.description"
                            rows="2"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="$emit('cancel')"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                Cancel
            </button>
            <button
                type="submit"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                :disabled="saving"
            >
                {{ saving ? "Saving..." : "Save Content" }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useSnackbarStore } from "../../stores/snackbar";

const props = defineProps({
    content: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["saved", "cancel"]);

const saving = ref(false);
const formData = ref({
    brand: {
        description: "",
        tagline: "Find yourself through meaningful jewelry",
    },
    socialLinks: [
        {
            name: "Facebook",
            url: "#",
            icon: ["fab", "facebook-f"],
        },
        {
            name: "Twitter",
            url: "#",
            icon: ["fab", "twitter"],
        },
        {
            name: "Instagram",
            url: "#",
            icon: ["fab", "instagram"],
        },
        {
            name: "TikTok",
            url: "#",
            icon: ["fab", "tiktok"],
        },
    ],
    quickLinks: [
        { name: "Shop", url: "/products" },
        { name: "About Us", url: "/about" },
        { name: "Contact", url: "/contact" },
    ],
    helpLinks: [
        { name: "FAQ", url: "/faq" },
        { name: "Shipping Information", url: "/shipping" },
        { name: "Returns Policy", url: "/returns" },
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms & Conditions", url: "/terms" },
    ],
    legalLinks: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Cookie Policy", url: "/cookies" },
    ],
    location: "",
    contactNumber: "+254 123456789",
    newsletter: {
        title: "Stay Connected",
        description:
            "Join our newsletter for the latest updates and exclusive offers.",
    },
});

const snackbarStore = useSnackbarStore();

// Initialize form with passed content
onMounted(() => {
    if (props.content) {
        formData.value = JSON.parse(JSON.stringify(props.content));
    }
});

// Helper functions for the form
const addSocialLink = () => {
    formData.value.socialLinks.push({
        name: "New Social",
        url: "#",
        icon: ["fab", "facebook-f"],
    });
};

const removeSocialLink = (index) => {
    formData.value.socialLinks.splice(index, 1);
};

const addQuickLink = () => {
    formData.value.quickLinks.push({
        name: "New Link",
        url: "/",
    });
};

const removeQuickLink = (index) => {
    formData.value.quickLinks.splice(index, 1);
};

const addHelpLink = () => {
    formData.value.helpLinks.push({
        name: "New Help Link",
        url: "/",
    });
};

const removeHelpLink = (index) => {
    formData.value.helpLinks.splice(index, 1);
};

const addLegalLink = () => {
    formData.value.legalLinks.push({
        name: "New Legal Link",
        url: "/",
    });
};

const removeLegalLink = (index) => {
    formData.value.legalLinks.splice(index, 1);
};

const saveContent = async () => {
    saving.value = true;

    try {
        const formDataToSend = new FormData();
        formDataToSend.append("content", JSON.stringify(formData.value));

        const response = await axios.put("/contents/footer", formDataToSend);
        emit("saved", response.data);
    } catch (error) {
        console.error("Error saving content:", error);
        snackbarStore.addSnackbar({
            message: "Failed to save content. Please try again.",
            type: "error"
        });
    } finally {
        saving.value = false;
    }
};

// Watch for content prop changes
watch(
    () => props.content,
    (newContent) => {
        if (newContent) {
            formData.value = JSON.parse(JSON.stringify(newContent));
        }
    },
);
</script>

<style scoped>
/* Add some basic styling to make tables look better */
table {
    border-collapse: separate;
    border-spacing: 0;
}

th {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f9fafb;
}

input,
select {
    transition: all 0.2s;
}

input:hover,
select:hover {
    border-color: #d1d5db;
}

input:focus,
select:focus {
    border-color: var(--primary-color, #3b82f6);
    box-shadow: 0 0 0 1px var(--primary-color, #3b82f6);
}

/* Highlight row on hover */
tr:hover td {
    background-color: rgba(249, 250, 251, 0.5);
}
</style>

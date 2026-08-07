<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
import Snackbar from "./components/Snackbar.vue";
import { ref, onMounted } from "vue";
import { useSnackbarStore } from "./stores/snackbar";
import axios from "axios";
import LoadingOverlay from "./components/LoadingOverlay.vue";

const snackbarRef = ref(null);
const snackbarStore = useSnackbarStore();
const footerContent = ref(null);

onMounted(async () => {
    // Expose the addSnackbar method globally (optional)
    window.addSnackbar = (message, type, timeout, dismissable) => {
        snackbarStore.addSnackbar({
            message,
            type,
            timeout,
            dismissable,
        });
    };

    // Fetch footer content
    try {
        const response = await axios.get("/contents/footer").catch((err) => {
            if (err.response && err.response.status === 404) {
                return { data: null };
            }
            throw err;
        });

        if (response.data && response.data.content) {
            footerContent.value = response.data.content;
        }
    } catch (error) {
        console.error("Error fetching footer content:", error);
    }
});
</script>

<template>
    <Navbar />
    <main class="flex-grow">
        <RouterView />
    </main>
    <Footer :content="footerContent" />
    <Snackbar />
    <LoadingOverlay />
</template>

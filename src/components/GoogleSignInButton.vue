<template>
    <div class="google-auth">
        <div ref="buttonContainer"></div>
        <p v-if="configurationError" class="text-xs text-red-600 text-center mt-2">
            Google sign-in is not configured.
        </p>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const emit = defineEmits(["credential", "error"]);
const buttonContainer = ref(null);
const configurationError = ref(false);
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const loadGoogleScript = () =>
    new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) return resolve();
        const existing = document.querySelector('script[data-google-identity]');
        if (existing) {
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
            return;
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.dataset.googleIdentity = "true";
        script.addEventListener("load", resolve, { once: true });
        script.addEventListener("error", reject, { once: true });
        document.head.appendChild(script);
    });

onMounted(async () => {
    if (!clientId) {
        configurationError.value = true;
        return;
    }
    try {
        await loadGoogleScript();
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => emit("credential", response.credential),
        });
        window.google.accounts.id.renderButton(buttonContainer.value, {
            type: "standard",
            theme: "outline",
            size: "large",
            shape: "rectangular",
            text: "continue_with",
            width: 400,
            logo_alignment: "left",
        });
    } catch (error) {
        emit("error", error);
    }
});
</script>

<style scoped>
.google-auth { display: flex; flex-direction: column; align-items: center; width: 100%; }
.google-auth > div { width: 100%; display: flex; justify-content: center; }
</style>

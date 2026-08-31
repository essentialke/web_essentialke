<template>
    <Teleport to="body">
        <div
            v-if="prompt.isOpen"
            class="login-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-required-title"
            @click.self="prompt.close()"
        >
            <section class="login-panel">
                <button class="close-button" type="button" aria-label="Close" @click="prompt.close()">&times;</button>
                <p class="eyebrow">Your shopping bag</p>
                <h2 id="login-required-title">Sign in to add this piece</h2>
                <p class="copy">Sign in or create an account to save items in your cart and continue to checkout.</p>
                <RouterLink class="primary-action" :to="loginDestination" @click="prompt.close()">Sign in</RouterLink>
                <RouterLink class="secondary-action" :to="registerDestination" @click="prompt.close()">Create account</RouterLink>
            </section>
        </div>
    </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from "vue";
import { RouterLink } from "vue-router";
import { useAuthPromptStore } from "../stores/authPrompt";

const prompt = useAuthPromptStore();
const loginDestination = computed(() => ({ path: "/login", query: { redirect: prompt.redirect } }));
const registerDestination = computed(() => ({ path: "/register", query: { redirect: prompt.redirect } }));

watch(() => prompt.isOpen, (open) => {
    document.body.style.overflow = open ? "hidden" : "";
});
onBeforeUnmount(() => { document.body.style.overflow = ""; });
</script>

<style scoped>
.login-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(20,18,15,.62);backdrop-filter:blur(3px)}
.login-panel{position:relative;width:min(100%,430px);padding:42px 36px 36px;background:#fff;color:#211f1b;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,.28)}
.close-button{position:absolute;right:14px;top:9px;width:38px;height:38px;color:#625d55;font-size:30px;line-height:1}
.eyebrow{margin-bottom:12px;color:#9b7845;font-size:9px;font-weight:650;letter-spacing:.22em;text-transform:uppercase}
h2{font:400 34px/1.08 'GFS Didot',Georgia,serif}
.copy{margin:16px auto 25px;max-width:330px;color:#6e6961;font-size:13px;line-height:1.7}
.primary-action,.secondary-action{display:flex;min-height:48px;align-items:center;justify-content:center;font-size:10px;font-weight:650;letter-spacing:.16em;text-transform:uppercase}
.primary-action{background:#24221e;color:#fff}
.secondary-action{margin-top:10px;border:1px solid #bdb6aa;color:#24221e}
@media(max-width:640px){.login-overlay{align-items:flex-end;padding:0}.login-panel{width:100%;padding:38px 24px calc(24px + env(safe-area-inset-bottom));border-radius:18px 18px 0 0}.copy{margin-bottom:21px}}
</style>

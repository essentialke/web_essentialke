<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "../stores/user";

const user = useUserStore();
const route = useRoute();
const coupon = ref(null);
const open = ref(false);
const copyMessage = ref("");
const closeButton = ref(null);
const codeInput = ref(null);
const visible = computed(() => open.value && user.isAuthenticated && !route.path.startsWith("/admin"));
let requestId = 0;
let previousFocus;
let previousOverflow = "";

watch(() => user.isAuthenticated ? user.user?.userId : null, async (userId) => {
    const currentRequest = ++requestId;
    open.value = false;
    coupon.value = null;
    copyMessage.value = "";
    if (!userId || user.user?.userType === "ADMIN") return;
    try {
        const { data } = await axios.get("/discountcodes/featured");
        if (currentRequest !== requestId) return;
        if (data.coupon && ["percentage", "fixed"].includes(data.coupon.type) && data.coupon.value > 0) {
            coupon.value = data.coupon;
            open.value = true;
        }
    } catch {
        // An unavailable offer must not interrupt sign-in or shopping.
    }
}, { immediate: true });

const close = () => { open.value = false; };
const copyCode = async () => {
    try {
        await navigator.clipboard.writeText(coupon.value.code);
        copyMessage.value = "Code copied. Apply it at checkout.";
    } catch {
        codeInput.value?.focus();
        codeInput.value?.select();
        copyMessage.value = "Select and copy the code above to use at checkout.";
    }
};
const handleKeys = (event) => {
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
        const controls = [closeButton.value, codeInput.value, document.getElementById("copy-coupon"), document.getElementById("dismiss-coupon")].filter(Boolean);
        const index = controls.indexOf(document.activeElement);
        if ((event.shiftKey && index <= 0) || (!event.shiftKey && (index === controls.length - 1 || index < 0))) {
            event.preventDefault();
            controls[event.shiftKey ? controls.length - 1 : 0]?.focus();
        }
    }
};
watch(visible, async (show) => {
    if (show) {
        previousFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        await nextTick();
        if (visible.value) closeButton.value?.focus();
    } else {
        document.body.style.overflow = previousOverflow;
        if (previousFocus?.isConnected) previousFocus.focus();
    }
});
onBeforeUnmount(() => {
    requestId++;
    if (visible.value) document.body.style.overflow = previousOverflow;
});
</script>

<template>
    <Teleport to="body">
        <div v-if="visible && coupon" class="coupon-overlay" @click.self="close" @keydown="handleKeys">
            <section class="coupon-panel" role="dialog" aria-modal="true" aria-labelledby="coupon-title" aria-describedby="coupon-description">
                <button ref="closeButton" type="button" class="coupon-close" aria-label="Close offer" @click="close">&times;</button>
                <p class="eyebrow">A little something for you</p>
                <h2 id="coupon-title">{{ coupon.type === 'percentage' ? `${coupon.value}% off` : `KES ${coupon.value} off` }}</h2>
                <p id="coupon-description">Welcome to Essential. Use this code at checkout for a little more meaning in your next piece.</p>
                <label for="welcome-coupon">Your coupon code</label>
                <input id="welcome-coupon" ref="codeInput" :value="coupon.code" readonly @focus="$event.target.select()" />
                <p v-if="coupon.validUntil" class="expiry">Valid until {{ new Date(coupon.validUntil).toLocaleString() }}.</p>
                <button id="copy-coupon" type="button" class="copy-button" @click="copyCode">Copy code</button>
                <p role="status" class="copy-status">{{ copyMessage }}</p>
                <button id="dismiss-coupon" type="button" class="continue-button" @click="close">Continue shopping</button>
            </section>
        </div>
    </Teleport>
</template>

<style scoped>
.coupon-overlay{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px;background:rgba(20,18,15,.62);backdrop-filter:blur(3px);overflow-y:auto}
.coupon-panel{position:relative;width:min(100%,460px);max-height:calc(100dvh - 40px);overflow-y:auto;padding:44px 32px 30px;background:#fbf9f5;text-align:center;color:#24221e;box-shadow:0 24px 70px rgba(0,0,0,.28)}
.coupon-close{position:absolute;right:10px;top:8px;width:44px;height:44px;font-size:30px;color:#625d55}.eyebrow{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8c7048;margin-bottom:18px}h2{font:400 48px/1.1 Georgia,serif}#coupon-description{margin:20px 0;color:#6e6961;font-size:14px;line-height:1.7}label{display:block;margin-bottom:10px;font-size:11px;text-transform:uppercase;letter-spacing:.12em}input{width:100%;min-width:0;padding:15px 12px;border:1px dashed #a88c62;background:#f5efe4;text-align:center;font-size:20px;font-weight:600;letter-spacing:.08em}.expiry{margin-top:12px;font-size:12px;color:#6e6961}.copy-button,.continue-button{display:block;width:100%;min-height:48px;font-size:11px;letter-spacing:.12em;text-transform:uppercase}.copy-button{margin-top:22px;background:#24221e;color:white}.continue-button{text-decoration:underline}.copy-status{font-size:12px;color:#6e6961;margin-top:10px}button:focus-visible,input:focus-visible{outline:2px solid #a88c62;outline-offset:3px}@media(max-width:480px){.coupon-panel{padding:48px 22px 24px}}
</style>

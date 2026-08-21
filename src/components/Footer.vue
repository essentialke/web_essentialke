<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useSnackbarStore } from "../stores/snackbar";
defineProps({ content: { type: Object, default: null } });
const email = ref(""); const snackbar = useSnackbarStore();
function subscribe(){ snackbar.addSnackbar({ message: "Welcome to our circle.", type: "success" }); email.value=""; }
</script>
<template>
    <footer class="footer">
        <div class="footer-top">
            <div class="footer-brand"><RouterLink to="/" class="footer-logo" aria-label="Essential home"><img src="/essential-logo.png" alt="Essential" /></RouterLink><p>Find yourself through meaningful jewelry</p><div class="socials"><a href="#">Instagram</a><a href="#">Pinterest</a><a href="#">TikTok</a></div></div>
            <div><h3>Shop</h3><RouterLink to="/products">New arrivals</RouterLink><RouterLink to="/products">Best sellers</RouterLink><RouterLink to="/products">Necklaces</RouterLink><RouterLink to="/products">Rings</RouterLink><RouterLink to="/gift-voucher">Gift cards</RouterLink></div>
            <div><h3>Care</h3><RouterLink to="/page/shipping">Shipping & returns</RouterLink><RouterLink to="/page/care">Jewelry care</RouterLink><RouterLink to="/page/warranty">Warranty</RouterLink><RouterLink to="/page/faq">FAQ</RouterLink><RouterLink to="/about">Contact us</RouterLink></div>
            <div class="signup"><h3>The private list</h3><p>New pieces, considered stories, and private offers—sent occasionally.</p><form @submit.prevent="subscribe"><input v-model="email" required type="email" placeholder="Your email address"><button aria-label="Subscribe">→</button></form><small>By subscribing, you agree to our privacy policy.</small></div>
        </div>
        <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Essential</span><div><span>VISA</span><span>mastercard</span><span>M-PESA</span></div><div><RouterLink to="/page/privacy">Privacy</RouterLink><RouterLink to="/page/terms">Terms</RouterLink></div></div>
    </footer>
</template>
<style scoped>
.footer{background:#1f1f1c;color:#d5d0c8;padding:75px 5vw 24px}.footer-top{max-width:1400px;margin:auto;display:grid;grid-template-columns:1.5fr .7fr .7fr 1.25fr;gap:6vw}.footer-logo{display:flex;align-items:center;gap:8px;color:#f7f3ed;font:18px Georgia;letter-spacing:.2em}.footer-logo i{width:5px;height:5px;border:1px solid #b08d57;transform:rotate(45deg)}.footer-brand p,.signup p{font-size:11px;line-height:1.8;color:#8f8b84;max-width:310px;margin:22px 0}.socials{display:flex;gap:18px}.socials a{font-size:9px;text-transform:uppercase;letter-spacing:.12em}.footer-top h3{color:white;font-size:9px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:23px}.footer-top>div:not(:first-child):not(:last-child) a{display:block;color:#a8a49e;font-size:11px;margin:0 0 14px}.footer a:hover{color:#c5a464}.signup form{display:flex;border-bottom:1px solid #777168}.signup input{flex:1;background:transparent;border:0;padding:12px 0;color:white;outline:0;font-size:12px}.signup button{font-size:20px;color:#c5a464}.signup small{font-size:8px;color:#77736c;display:block;margin-top:12px}.footer-bottom{max-width:1400px;margin:65px auto 0;border-top:1px solid #3a3935;padding-top:22px;display:flex;justify-content:space-between;align-items:center;font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:#77736c}.footer-bottom>div{display:flex;gap:18px}.footer-bottom>div:first-of-type span{border:1px solid #4b4944;padding:5px 7px;color:#aaa59d}@media(max-width:800px){.footer{padding:60px 24px 24px}.footer-top{grid-template-columns:1fr 1fr}.footer-brand,.signup{grid-column:1/-1}.footer-bottom{flex-direction:column;gap:20px;align-items:flex-start}}
.footer-logo{display:block;width:64px;height:96px;overflow:hidden;font-size:0}
.footer-logo img{width:64px;height:96px;object-fit:contain;filter:invert(1);mix-blend-mode:screen}
</style>

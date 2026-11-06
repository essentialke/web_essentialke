<script setup>
const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
</script>

<template>
    <main class="contact-page">
        <header>
            <p class="eyebrow">Essential</p>
            <h1>Contact Us</h1>
            <p class="intro">Let's find something meaningful.</p>
            <p class="description">Have a question about a piece, choosing a gift or your order? We'd love to hear from you.</p>
        </header>

        <div class="contact-options">
            <a class="contact-option" href="https://www.instagram.com/essentialke?obrf=MW9id2E2MWkwcWk4dw==" target="_blank" rel="noopener noreferrer">
                <h2>Instagram</h2>
                <p>Send us a message about your order or a piece you love.</p>
                <span>@essentialke <span aria-hidden="true">&#8599;</span></span>
            </a>
            <a class="contact-option" href="https://www.tiktok.com/@essentialke21?_r=1&amp;_t=ZS-9B8vxlhDxhM" target="_blank" rel="noopener noreferrer">
                <h2>TikTok</h2>
                <p>Connect with us and discover more of Essential.</p>
                <span>@essentialke21 <span aria-hidden="true">&#8599;</span></span>
            </a>
            <a v-if="whatsappNumber" class="contact-option" :href="`https://wa.me/${whatsappNumber}`" target="_blank" rel="noopener noreferrer">
                <h2>WhatsApp</h2>
                <p>Chat with us about jewelry, gifts or an existing order.</p>
                <span>Start a conversation <span aria-hidden="true">&#8599;</span></span>
            </a>
        </div>

        <p class="order-note">For order enquiries, include your order number so we can help you more easily.</p>
    </main>
</template>

<style scoped>
.contact-page{max-width:1100px;margin:0 auto;padding:80px 24px 100px;color:#1f1f1c}
header{max-width:640px}
.eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#85704c;margin-bottom:20px}
h1{font-family:Georgia,serif;font-size:clamp(36px,6vw,56px);line-height:1.15;margin:0 0 24px}
.intro{font-family:Georgia,serif;font-size:24px;margin-bottom:16px}
.description,.contact-option p,.order-note{font-size:15px;line-height:1.8;color:#656158}
.contact-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;margin-top:44px}
.contact-option{display:flex;flex-direction:column;padding:30px;border:1px solid #ded8ce;background:#faf8f4;text-decoration:none;transition:border-color .2s,background .2s}
.contact-option:hover{border-color:#9b8055;background:#f4efe6}
.contact-option:focus-visible{outline:2px solid #85704c;outline-offset:4px}
.contact-option h2{font-family:Georgia,serif;font-size:25px;margin:0 0 14px}
.contact-option p{margin:0 0 24px}
.contact-option>span{margin-top:auto;font-size:13px;color:#735b34;display:flex;justify-content:space-between;gap:16px}
.order-note{margin-top:32px;font-size:13px}
@media(max-width:600px){.contact-page{padding:48px 20px 64px}.contact-options{grid-template-columns:1fr;margin-top:32px;gap:16px}.contact-option{padding:24px}}
</style>

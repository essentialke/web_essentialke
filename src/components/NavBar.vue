<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { useCartStore } from "../stores/cart";
import { useWishlistStore } from "../stores/wishlist";
import axios from "axios";
import {
    collectionCategories,
    copyDefaultCategories,
} from "../config/catalog";

const router = useRouter();
const userStore = useUserStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const menuOpen = ref(false);
const searchOpen = ref(false);
const collectionsOpen = ref(false);
const searchQuery = ref("");

const nav = [
    { name: "New", path: "/products?sortBy=createdAt&sortOrder=desc" },
    { name: "All Jewelry", path: "/products" },
    { name: "Best Sellers", path: "/products?featured=true" },
    { name: "Collections", path: "/products", dropdown: true },
    { name: "Stickers", path: "/products?category=Stickers" },
    { name: "Gifting", path: "/gift-voucher" },
    { name: "Sale", path: "/products?sortBy=sale" },
];

const collections = ref(collectionCategories(copyDefaultCategories()));

const collectionPath = (name) => ({
    path: "/products",
    query: { category: name },
});

async function fetchCollections() {
    try {
        const response = await axios.get("/contents/categories");
        const configuredCollections = collectionCategories(
            response.data?.content?.categories || [],
        );
        if (configuredCollections.length) collections.value = configuredCollections;
    } catch (error) {
        console.warn("Using default collection navigation.", error);
    }
}

function submitSearch() {
    if (searchQuery.value.trim()) router.push({ path: "/search", query: { q: searchQuery.value.trim() } });
    searchOpen.value = false;
    collectionsOpen.value = false;
    menuOpen.value = false;
}

function closeMenus() {
    menuOpen.value = false;
    searchOpen.value = false;
    document.body.style.overflow = "";
}

function toggleMenu() {
    menuOpen.value = !menuOpen.value;
    document.body.style.overflow = menuOpen.value ? "hidden" : "";
}

const onKey = (e) => e.key === "Escape" && closeMenus();
onMounted(() => {
    document.addEventListener("keydown", onKey);
    fetchCollections();
});
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
router.afterEach(closeMenus);
</script>

<template>
    <header class="site-header">
        <div class="header-main">
            <RouterLink to="/" class="wordmark" aria-label="Essential home">
                <img src="/essential-logo.png" alt="Essential" />
            </RouterLink>

            <nav class="desktop-nav">
                <template v-for="item in nav" :key="item.name">
                    <div v-if="item.dropdown" class="nav-dropdown">
                        <RouterLink :to="item.path" class="dropdown-trigger">{{ item.name }} <span aria-hidden="true"></span></RouterLink>
                        <div class="dropdown-panel">
                            <RouterLink v-for="collection in collections" :key="collection.id" :to="collectionPath(collection.name)">{{ collection.name }}</RouterLink>
                        </div>
                    </div>
                    <RouterLink v-else :to="item.path">{{ item.name }}</RouterLink>
                </template>
            </nav>

            <div class="header-side header-icons">
                <button @click="searchOpen = !searchOpen" aria-label="Search">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
                </button>
                <RouterLink :to="userStore.isAuthenticated ? '/dashboard/profile' : '/login'" aria-label="Account">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
                </RouterLink>
                <RouterLink to="/wishlist" aria-label="Wishlist" class="count-wrap">
                    <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/></svg>
                    <b v-if="wishlistStore.wishlistItemCount">{{ wishlistStore.wishlistItemCount }}</b>
                </RouterLink>
                <RouterLink to="/cart" aria-label="Cart" class="count-wrap">
                    <svg viewBox="0 0 24 24"><path d="M6 8h12l1 13H5L6 8z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
                    <b v-if="cartStore.cartItemCount">{{ cartStore.cartItemCount }}</b>
                </RouterLink>
                <button class="mobile-toggle" @click="toggleMenu" aria-label="Open menu">
                    <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                </button>
            </div>
        </div>

        <form v-if="searchOpen" @submit.prevent="submitSearch" class="search-drawer">
            <input v-model="searchQuery" autofocus placeholder="Search the collection" aria-label="Search the collection" />
            <button type="submit">Search</button>
        </form>

        <nav v-if="menuOpen" class="mobile-nav">
            <template v-for="item in nav" :key="item.name">
                <div v-if="item.dropdown" class="mobile-collections">
                    <button @click="collectionsOpen = !collectionsOpen" :aria-expanded="collectionsOpen">{{ item.name }} <span>{{ collectionsOpen ? '−' : '+' }}</span></button>
                    <div v-if="collectionsOpen" class="mobile-collection-links">
                        <RouterLink v-for="collection in collections" :key="collection.id" :to="collectionPath(collection.name)">{{ collection.name }}</RouterLink>
                    </div>
                </div>
                <RouterLink v-else :to="item.path">{{ item.name }}</RouterLink>
            </template>
        </nav>
    </header>
</template>

<style scoped>
.site-header{position:sticky;top:0;z-index:50;background:#f7f3ed;color:#1a1a1a;border-bottom:1px solid rgba(26,26,26,.1)}
.announcement{height:30px;background:#1e1e1b;color:#f7f3ed;display:flex;align-items:center;justify-content:center;gap:18px;font-size:9px;letter-spacing:.16em;text-transform:uppercase}.announcement-dot{color:#c3a060}
.header-main{height:76px;max-width:1440px;margin:auto;padding:0 40px;display:flex;justify-content:space-between;align-items:center}.header-side{display:flex;align-items:center}.wordmark{display:flex;align-items:center;gap:9px;font-family:Georgia,serif;font-size:19px;letter-spacing:.24em}.wordmark i{width:5px;height:5px;border:1px solid #b08d57;transform:rotate(45deg)}
.header-icons{justify-content:flex-end;gap:18px}.header-icons a,.header-icons button{position:relative;display:grid;place-items:center}.header-icons svg,.header-support svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.4}.count-wrap b{position:absolute;top:-8px;right:-9px;width:15px;height:15px;border-radius:50%;background:#b08d57;color:white;font:9px/15px Arial;text-align:center}.desktop-nav{height:38px;display:flex;justify-content:center;align-items:flex-start;gap:46px}.desktop-nav a{font-size:10px;letter-spacing:.2em;text-transform:uppercase;position:relative}.desktop-nav a:after{content:"";position:absolute;left:0;right:0;bottom:-7px;height:1px;background:#b08d57;transform:scaleX(0);transition:.25s}.desktop-nav a:hover:after,.desktop-nav a.router-link-active:after{transform:scaleX(1)}
.nav-dropdown{position:relative;padding-bottom:20px}.dropdown-trigger{display:flex;align-items:center;gap:7px}.dropdown-trigger span{font-size:12px;color:#9a7c50}.dropdown-panel{position:absolute;top:28px;left:50%;width:245px;padding:18px 0;background:#f7f3ed;border:1px solid #ddd4c7;box-shadow:0 14px 32px rgba(36,31,25,.1);opacity:0;visibility:hidden;transform:translate(-50%,8px);transition:.2s}.nav-dropdown:hover .dropdown-panel,.nav-dropdown:focus-within .dropdown-panel{opacity:1;visibility:visible;transform:translate(-50%,0)}.dropdown-panel a{display:block;padding:9px 22px;font-family:Georgia,serif;font-size:13px;letter-spacing:.01em;text-transform:none;color:#4f4a43}.dropdown-panel a:hover{color:#9a7c50;background:#f1ebe2}.dropdown-panel a:after{display:none}
.search-drawer{position:absolute;left:0;right:0;top:100%;background:#f7f3ed;border-top:1px solid #ddd4c7;padding:20px max(5vw,24px);display:flex;justify-content:center}.search-drawer input{width:min(620px,75vw);border:0;border-bottom:1px solid #777;background:transparent;padding:10px 4px;outline:0;font-family:Georgia,serif;font-size:20px}.search-drawer button{background:#1a1a1a;color:white;padding:0 24px;font-size:10px;letter-spacing:.16em;text-transform:uppercase}.mobile-toggle,.mobile-nav{display:none}
@media(max-width:800px){.header-main{height:64px;padding:0 18px;display:flex;justify-content:space-between}.header-support,.desktop-nav,.header-icons>a:nth-of-type(1),.header-icons>a:nth-of-type(2){display:none}.wordmark{font-size:15px}.mobile-toggle{display:grid!important}.mobile-nav{display:flex;position:fixed;inset:64px 0 0;background:#f7f3ed;padding:44px 24px;flex-direction:column;gap:28px;overflow-y:auto}.mobile-nav a{font-family:Georgia,serif;font-size:28px}.search-drawer{top:100%}}
.wordmark{display:grid;place-items:center;height:68px;width:74px;overflow:hidden;font-size:0}
.wordmark img{width:56px;height:62px;object-fit:contain;mix-blend-mode:multiply}
@media(max-width:800px){.wordmark{height:58px;width:55px}.wordmark img{width:42px;height:50px}}
.mobile-collections button{width:100%;display:flex;align-items:center;justify-content:space-between;font-family:'GFS Didot',Georgia,serif;font-size:30px;text-align:left}.mobile-collection-links{display:flex;flex-direction:column;gap:14px;padding:18px 0 2px 16px;border-left:1px solid #b08d57}.mobile-nav .mobile-collection-links a{font-family:'Geist',sans-serif;font-size:13px;font-weight:500;letter-spacing:.07em;color:#696158}
.desktop-nav a{font-family:'Geist',sans-serif;font-weight:550}.dropdown-panel a,.search-drawer input{font-family:'GFS Didot',Georgia,serif}.dropdown-panel a{font-size:15px}.announcement{font-family:'Geist',sans-serif;font-weight:500}
@media(max-width:800px){.mobile-nav>a{font-family:'GFS Didot',Georgia,serif;font-size:30px}}
.header-main{height:82px;display:grid;grid-template-columns:110px minmax(0,1fr) 150px;align-items:center}.desktop-nav{height:100%;align-items:center;gap:clamp(18px,2.3vw,40px)}.desktop-nav>a,.desktop-nav .dropdown-trigger{font-size:10px;letter-spacing:.14em;white-space:nowrap}.nav-dropdown{height:100%;padding:0;display:flex;align-items:center}.dropdown-panel{top:calc(100% - 1px)}
.dropdown-trigger{display:inline-flex;align-items:center;line-height:1}.dropdown-trigger span{display:block;width:6px;height:6px;margin:0 0 3px 1px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg);transform-origin:center;flex:0 0 auto}
@media(max-width:1000px){.header-main{padding:0 24px;grid-template-columns:90px minmax(0,1fr) 130px}.desktop-nav{gap:16px}.desktop-nav>a,.desktop-nav .dropdown-trigger{font-size:9px;letter-spacing:.09em}.header-icons{gap:13px}}
@media(max-width:800px){.header-main{height:64px;display:flex;padding:0 18px}.desktop-nav{display:none}}
</style>

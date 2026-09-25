<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useCartStore } from '../stores/cart';
import { useWishlistStore } from '../stores/wishlist';
import CategoryMenuBranch from './CategoryMenuBranch.vue';
import { copyDefaultCategories, isStorefrontCategory } from '../config/catalog';
import axios from 'axios';
const router = useRouter();
const userStore = useUserStore(), cartStore = useCartStore(), wishlistStore = useWishlistStore();
const header = ref(null), menuOpen = ref(false), searchOpen = ref(false), searchQuery = ref('');
const openDropdown = ref(null), selectedId = ref(null), categories = ref(copyDefaultCategories());
const nav = [{ name: 'Shop' }, { name: 'Best Sellers', path: '/products?featured=true' }, { name: 'Gifts' }, { name: 'Collections' }];
const tree = computed(() => {
    const active = categories.value.filter(isStorefrontCategory);
    const branch = (parentId, seen = new Set()) => active.filter(c => c.parentId === parentId && !seen.has(c.id)).map(c => ({ ...c, children: branch(c.id, new Set([...seen, c.id])) }));
    return branch(null);
});
const rootsFor = name => name === 'Shop' ? tree.value : tree.value.filter(c => name === 'Collections' ? c.slug === 'collections' : ['gifts', 'gifting', 'gift-sets'].includes(c.slug));
const selected = computed(() => tree.value.find(c => c.id === selectedId.value));
const categoryPath = name => ({ path: '/products', query: { category: name } });
const collectionPath = name => ({ path: '/products', query: { collection: name } });
function toggleCategory(id) { selectedId.value = selectedId.value === id ? null : id; }
async function enterCategory(id) { selectedId.value = id; await nextTick(); header.value?.querySelector('#shop-subcategories a')?.focus(); }
function toggleDropdown(name) { openDropdown.value = openDropdown.value === name ? null : name; selectedId.value = null; searchOpen.value = false; }
function closeMenus() { menuOpen.value = false; searchOpen.value = false; openDropdown.value = null; selectedId.value = null; document.body.style.overflow = ''; }
function toggleMenu() { const next = !menuOpen.value; closeMenus(); menuOpen.value = next; document.body.style.overflow = next ? 'hidden' : ''; }
function toggleSearch() { const next = !searchOpen.value; closeMenus(); searchOpen.value = next; }
function submitSearch() { if (searchQuery.value.trim()) router.push({ path: '/search', query: { q: searchQuery.value.trim() } }); closeMenus(); }
function onKey(e) { if (e.key === 'Escape') { const trigger = header.value?.querySelector('[data-nav-trigger][aria-expanded="true"]'); closeMenus(); trigger?.focus(); } }
const onOutside = e => { if (!header.value?.contains(e.target)) closeMenus(); };
const onFocusOut = e => { if (!header.value?.contains(e.relatedTarget)) openDropdown.value = null; };
const removeRouteHook = router.afterEach(closeMenus);
onMounted(async () => {
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onOutside);
    try { const response = await axios.get('/contents/categories'); if (Array.isArray(response.data?.content?.categories)) categories.value = response.data.content.categories; }
    catch (error) { console.warn('Using default category navigation.', error); }
});
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside); removeRouteHook(); document.body.style.overflow = ''; });
</script>
<template>
<header ref="header" class="site-header" @focusout="onFocusOut">
    <div class="header-main">
        <RouterLink to="/" class="wordmark" aria-label="Essential home"><img src="/essential-logo.png" alt="Essential" /></RouterLink>
        <nav class="desktop-nav" aria-label="Main navigation">
            <template v-for="item in nav" :key="item.name">
                <RouterLink v-if="item.path" :to="item.path">{{ item.name }}</RouterLink>
                <div v-else class="nav-dropdown">
                    <button type="button" class="dropdown-trigger" data-nav-trigger :aria-expanded="openDropdown === item.name" :aria-controls="'desktop-' + item.name" @click="toggleDropdown(item.name)">{{ item.name }} <span aria-hidden="true"></span></button>
                    <div v-if="openDropdown === item.name" :id="'desktop-' + item.name" class="mega-panel" :class="{ 'shop-panel': item.name === 'Shop' }">
                        <template v-if="item.name === 'Shop'">
                            <div class="category-column">
                                <p class="menu-eyebrow">Browse the shop</p>
                                <div class="shop-shortcuts">
                                    <RouterLink to="/products">Shop all <span aria-hidden="true">&#8599;</span></RouterLink>
                                    <RouterLink to="/products?sortBy=createdAt&sortOrder=desc">New releases</RouterLink>
                                </div>
                                <p class="menu-eyebrow category-label">Categories</p>
                                <template v-for="category in tree" :key="category.id">
                                    <button v-if="category.children.length" type="button" :class="{ selected: selectedId === category.id }" :aria-expanded="selectedId === category.id" aria-controls="shop-subcategories" @click="toggleCategory(category.id)" @keydown.right.prevent="enterCategory(category.id)">{{ category.name }} <svg class="category-chevron" :class="{ expanded: selectedId === category.id }" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg></button>
                                    <RouterLink v-else :to="categoryPath(category.name)">{{ category.name }}</RouterLink>
                                </template>
                            </div>
                            <div id="shop-subcategories" class="subcategory-column">
                                <template v-if="selected">
                                    <p class="menu-eyebrow">Explore</p>
                                    <h2 class="submenu-title">{{ selected.name }}</h2>
                                    <RouterLink class="all-category" :to="categoryPath(selected.name)">Shop all {{ selected.name }} <span aria-hidden="true">&#8594;</span></RouterLink>
                                    <CategoryMenuBranch :key="selected.id" :categories="selected.children" />
                                </template>
                                <div v-else class="menu-intro"><p class="menu-eyebrow">Made to be yours</p><h2 class="submenu-title">Find your everyday<br>favourite.</h2><p class="menu-hint">Explore our jewelry by category.<br>Open an arrow to discover more.</p></div>
                            </div>
                        </template>
                        <template v-else>
                            <p class="menu-eyebrow">Discover</p>
                            <h2 class="submenu-title">{{ item.name }}</h2>
                            <RouterLink v-if="item.name === 'Gifts'" class="all-category" to="/gifting">Explore Gifts</RouterLink>
                            <CategoryMenuBranch :categories="rootsFor(item.name)" :query-key="item.name === 'Collections' ? 'collection' : 'category'" />
                            <p v-if="item.name === 'Collections' && !rootsFor(item.name).length" class="menu-hint">Collections coming soon.</p>
                        </template>
                    </div>
                </div>
            </template>
        </nav>
            <div class="header-side header-icons min-w-0 shrink-0">
                <button @click="toggleSearch" aria-label="Search">
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
                <button class="mobile-toggle flex md:hidden" @click="toggleMenu" :aria-label="menuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="menuOpen">
                    <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                </button>
            </div>
        </div>


    <form v-if="searchOpen" @submit.prevent="submitSearch" class="search-drawer">
        <input v-model="searchQuery" autofocus placeholder="Search the collection" aria-label="Search the collection" /><button type="submit">Search</button>
    </form>
    <nav v-if="menuOpen" class="mobile-nav" aria-label="Mobile navigation">
        <template v-for="item in nav" :key="item.name">
            <RouterLink v-if="item.path" :to="item.path">{{ item.name }}</RouterLink>
            <div v-else class="mobile-collections">
                <button type="button" data-nav-trigger @click="toggleDropdown(item.name)" :aria-expanded="openDropdown === item.name" :aria-controls="'mobile-' + item.name">{{ item.name }} <span aria-hidden="true">{{ openDropdown === item.name ? '-' : '+' }}</span></button>
                <div v-if="openDropdown === item.name" :id="'mobile-' + item.name" class="mobile-category-panel">
                    <template v-if="item.name === 'Shop'"><RouterLink to="/products">Shop All</RouterLink><RouterLink to="/products?sortBy=createdAt&sortOrder=desc">New Releases</RouterLink></template>
                    <RouterLink v-if="item.name === 'Gifts'" to="/gifting">Explore Gifts</RouterLink>
                    <CategoryMenuBranch :categories="rootsFor(item.name)" :query-key="item.name === 'Collections' ? 'collection' : 'category'" />
                    <p v-if="item.name === 'Collections' && !rootsFor(item.name).length">Collections coming soon.</p>
                </div>
            </div>
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
@media(max-width:800px){.header-main{height:64px;display:flex;padding:0 8px 0 12px;gap:4px}.wordmark{width:48px;flex:0 0 48px}.desktop-nav{display:none}.header-icons{gap:0;margin-left:auto}.header-icons>a,.header-icons>button{width:44px;height:44px;flex:0 0 44px}.mobile-nav{padding:28px 20px 40px;gap:20px}.mobile-nav>a,.mobile-collections button{min-height:44px;font-size:26px;line-height:1.2}.mobile-collection-links a{display:flex;align-items:center;min-height:44px}.search-drawer{padding:12px;gap:8px}.search-drawer input{width:100%;min-width:0;font-size:16px}.search-drawer button{padding:0 14px;min-width:72px;min-height:44px}}
@media(max-width:360px){.header-icons>a,.header-icons>button{width:42px;flex-basis:42px}.wordmark{width:44px;flex-basis:44px}.wordmark img{width:40px}}


.desktop-nav{gap:clamp(24px,3.7vw,60px)}
.desktop-nav>a,.desktop-nav .dropdown-trigger{font-family:'Geist',sans-serif;font-size:15px;font-weight:500;letter-spacing:.07em;text-transform:none}
.nav-dropdown{position:static}.dropdown-trigger{min-height:44px}
.mega-panel{position:absolute;top:100%;left:0;width:min(800px,100vw);max-height:calc(100dvh - 100px);overflow-y:auto;background:#fffdf9;padding:32px 40px;box-shadow:0 20px 40px #2620181a;border:1px solid #e7dfd3;border-left:0;border-radius:0 0 12px 0}
.shop-panel{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:32px}
.category-column{display:flex;flex-direction:column;gap:2px}
.category-column>a,.category-column>button{display:flex;justify-content:space-between;align-items:center;gap:16px;min-height:46px;padding:11px 14px;text-align:left;font:500 14px/1.5 'Geist',sans-serif;letter-spacing:.01em;text-transform:none;border-left:2px solid transparent;border-radius:0 5px 5px 0;transition:background .15s,color .15s}
.category-column>a:hover,.category-column>button:hover{background:#f4efe7}.category-column .selected{background:#eee5d7;border-left-color:#9a7c50;color:#654c2c;font-weight:650}.category-column span{color:#777}
.mega-panel a:after{display:none}.mega-panel .all-category{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:14px 0 18px;padding:12px 0;border-bottom:1px solid #e4dbcd;font:500 13px/1.5 'Geist',sans-serif;letter-spacing:0;text-transform:none;color:#775b34}.mega-panel .all-category:hover{color:#34271a}
.menu-eyebrow{font:600 10px/1.5 'Geist',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7c6c56}.category-label{padding:18px 14px 9px}.shop-shortcuts{display:grid;gap:3px;padding:12px 0 16px;border-bottom:1px solid #e4dbcd}.desktop-nav .shop-shortcuts a{display:flex;align-items:center;justify-content:space-between;min-height:40px;font-size:14px;font-weight:600;letter-spacing:0;text-transform:none}.shop-shortcuts a:hover{color:#8a6b3e}.subcategory-column{border-left:1px solid #e4dbcd;padding-left:32px}.submenu-title{font:400 30px/1.18 'GFS Didot',Georgia,serif;letter-spacing:-.02em;margin-top:10px;color:#302b24;overflow-wrap:anywhere}.menu-intro{padding-top:8px}.dropdown-trigger[aria-expanded="true"]{color:#775b34}.dropdown-trigger[aria-expanded="true"] span{transform:rotate(225deg)}
.menu-hint{color:#777;font-size:14px;line-height:1.8;padding-top:12px}
.category-chevron{width:16px;height:16px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.5;transition:transform .2s}.category-chevron.expanded{transform:rotate(90deg)}
.mega-panel :deep(.category-branch a),.mobile-category-panel :deep(.category-branch a){font:400 15px/1.5 'Geist',sans-serif;letter-spacing:0;text-transform:none}
.mobile-category-panel{padding:12px 0 12px 18px;border-left:1px solid #d4c5b0;margin-top:12px}
.mobile-category-panel>a{display:block;padding:12px 0;font:400 15px/1.5 'Geist',sans-serif}
.mobile-collections{border-bottom:1px solid #dfd6c8;padding-bottom:14px}.mobile-category-panel{background:#fffaf2;border-radius:0 8px 8px 0;padding:12px 16px}.mobile-collections>button[aria-expanded="true"]{color:#775b34}
button:focus-visible,a:focus-visible{outline:2px solid #9a7c50;outline-offset:4px}
@media(min-width:801px) and (max-width:1000px){.desktop-nav{gap:22px}.desktop-nav>a,.desktop-nav .dropdown-trigger{font-size:13px}}
</style>

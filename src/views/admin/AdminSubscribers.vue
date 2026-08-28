<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useSnackbarStore } from "../../stores/snackbar";
const subscribers = ref([]); const loading = ref(true); const search = ref(""); const snackbar = useSnackbarStore();
const filtered = computed(() => subscribers.value.filter((item) => item.email.toLowerCase().includes(search.value.toLowerCase())));
const load = async () => { loading.value = true; try { subscribers.value = (await axios.get("/subscribers")).data.subscribers || []; } finally { loading.value = false; } };
const remove = async (subscriber) => { if (!confirm(`Remove ${subscriber.email} from subscribers?`)) return; await axios.delete(`/subscribers/${subscriber.id}`); subscribers.value = subscribers.value.filter((item) => item.id !== subscriber.id); snackbar.addSnackbar({ message: "Subscriber removed.", type: "success" }); };
const exportCsv = () => { const rows = ["Email,Subscribed At", ...filtered.value.map((item) => `"${item.email}","${new Date(item.subscribedAt).toISOString()}"`)]; const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "essential-subscribers.csv"; link.click(); URL.revokeObjectURL(url); };
onMounted(load);
</script>
<template>
  <section>
    <header class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-900">Subscribers</h1><p class="mt-1 text-sm text-gray-500">Emails collected through the storefront signup form.</p></div><button v-if="subscribers.length" class="rounded bg-gray-800 px-4 py-2 text-sm font-semibold text-white" @click="exportCsv">Export CSV</button></header>
    <div class="mb-5 rounded-lg bg-white p-4 shadow-sm"><label class="text-sm font-medium text-gray-700">Search email<input v-model.trim="search" type="search" placeholder="name@example.com" class="mt-1 block w-full max-w-md rounded-md border border-gray-300 px-3 py-2" /></label></div>
    <div class="overflow-hidden rounded-lg bg-white shadow-sm"><div v-if="loading" class="p-8 text-center text-gray-500">Loading subscribers…</div><div v-else-if="!filtered.length" class="p-10 text-center text-gray-500">No subscriber emails found.</div><div v-else class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Subscribed</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th></tr></thead><tbody class="divide-y divide-gray-100"><tr v-for="subscriber in filtered" :key="subscriber.id"><td class="px-5 py-4 font-medium text-gray-900">{{ subscriber.email }}</td><td class="px-5 py-4 text-sm text-gray-500">{{ new Date(subscriber.subscribedAt).toLocaleDateString() }}</td><td class="px-5 py-4 text-right"><button class="text-sm font-medium text-red-600" @click="remove(subscriber)">Remove</button></td></tr></tbody></table></div></div>
  </section>
</template>

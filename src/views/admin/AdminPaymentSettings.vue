<template>
  <div :class="embedded ? 'max-w-3xl' : 'container mx-auto px-4 py-8 max-w-3xl'">
    <h2 :id="headingId" class="text-2xl font-bold mb-2">IntaSend Settings</h2>
    <p class="text-gray-600 mb-6">IntaSend is the active gateway. Daraja is currently inactive.</p>

    <form @submit.prevent="save" class="bg-white shadow rounded-lg p-6 space-y-5">
      <div class="flex items-center justify-between border-b pb-4">
        <div><h3 class="font-semibold text-lg">IntaSend</h3><p class="text-sm text-gray-500">M-PESA STK Push payments</p></div>
        <span class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">Active</span>
      </div>

      <label class="block"><span class="text-sm font-medium text-gray-700">Environment</span>
        <select v-model="form.environment" class="mt-1 block w-full border rounded-md py-2 px-3">
          <option value="sandbox">Sandbox</option><option value="production">Production</option>
        </select>
      </label>
      <label class="block"><span class="text-sm font-medium text-gray-700">Publishable key</span>
        <input v-model.trim="form.publicKey" required autocomplete="off" class="mt-1 block w-full border rounded-md py-2 px-3" placeholder="ISPubKey_..." />
      </label>
      <label class="block"><span class="text-sm font-medium text-gray-700">Secret key</span>
        <input v-model.trim="form.secretKey" :required="!secretKeyConfigured" type="password" autocomplete="new-password" class="mt-1 block w-full border rounded-md py-2 px-3" :placeholder="secretKeyConfigured ? 'Configured — leave blank to keep current key' : 'ISSecretKey_...'" />
      </label>
      <label class="block"><span class="text-sm font-medium text-gray-700">Webhook challenge</span>
        <input v-model.trim="form.webhookChallenge" type="password" autocomplete="new-password" class="mt-1 block w-full border rounded-md py-2 px-3" :placeholder="challengeConfigured ? 'Configured — leave blank to keep current value' : 'Challenge configured in IntaSend'" />
      </label>
      <div class="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
        Webhook URL: <code>{{ webhookUrl }}</code>
      </div>
      <button :disabled="saving" class="px-5 py-2 rounded-md bg-primary text-white disabled:opacity-50">{{ saving ? 'Saving…' : 'Save payment settings' }}</button>
    </form>

    <div class="mt-6 bg-gray-50 border rounded-lg p-5 flex justify-between items-center">
      <div><h3 class="font-semibold">Safaricom Daraja</h3><p class="text-sm text-gray-500">Direct integration retained for future use</p></div>
      <span class="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-600">Inactive</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useSnackbarStore } from '../../stores/snackbar';

defineProps({
  embedded: { type: Boolean, default: false },
  headingId: { type: String, default: undefined },
});

const snackbar = useSnackbarStore();
const saving = ref(false), secretKeyConfigured = ref(false), challengeConfigured = ref(false);
const form = ref({ environment: 'sandbox', publicKey: '', secretKey: '', webhookChallenge: '' });
const webhookUrl = computed(() => `${String(axios.defaults.baseURL || window.location.origin).replace(/\/$/, '')}/transactions/intasend-webhook`);

onMounted(async () => {
  try {
    const { data } = await axios.get('/admin/payment-settings');
    form.value.environment = data.intasend.environment;
    form.value.publicKey = data.intasend.publicKey;
    secretKeyConfigured.value = data.intasend.secretKeyConfigured;
    challengeConfigured.value = data.intasend.webhookChallengeConfigured;
  } catch { snackbar.addSnackbar({ message: 'Could not load payment settings', type: 'error' }); }
});

const save = async () => {
  saving.value = true;
  try {
    await axios.put('/admin/payment-settings', form.value);
    secretKeyConfigured.value = true;
    if (form.value.webhookChallenge) challengeConfigured.value = true;
    form.value.secretKey = ''; form.value.webhookChallenge = '';
    snackbar.addSnackbar({ message: 'Payment settings saved', type: 'success' });
  } catch (error) {
    snackbar.addSnackbar({ message: error.response?.data?.error || 'Could not save payment settings', type: 'error' });
  } finally { saving.value = false; }
};
</script>

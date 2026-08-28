<template>
    <div v-if="show" class="fixed z-50 inset-0 overflow-y-auto">
        <div
            class="modal-shell flex items-center justify-center min-h-screen pt-4 px-4 pb-20"
        >
            <!-- Backdrop -->
            <div
                class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                @click="$emit('close')"
            ></div>

            <!-- Modal -->
            <div
                class="modal-panel relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all"
            >
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-xl font-semibold text-gray-900">
                        <slot name="header"></slot>
                    </h3>
                    <button
                        @click="$emit('close')"
                        class="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg
                            class="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="modal-body p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <slot></slot>
                </div>

                <!-- Footer -->
                <div
                    v-if="$slots.footer"
                    class="flex justify-end gap-2 p-4 border-t bg-gray-50"
                >
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: Boolean,
});

defineEmits(["close"]);
</script>

<style scoped>
@media(max-width:640px){.modal-shell{align-items:flex-end;padding:12px 0 0}.modal-panel{max-height:calc(100dvh - 12px);border-radius:16px 16px 0 0}.modal-body{padding:18px;max-height:calc(100dvh - 130px)}.modal-panel>div:first-of-type{padding:14px 18px}.modal-panel>div:first-of-type h3{font-size:18px}}
</style>

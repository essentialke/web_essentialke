<template>
    <div
        class="stat-card bg-white transition-all duration-300 overflow-hidden"
    >
        <div class="flex items-center p-6">
            <div
                :class="`stat-icon mr-4 flex items-center justify-center w-12 h-12 ${getBgColor}`"
            >
                <font-awesome-icon
                    :icon="icon"
                    :class="iconColor"
                    class="w-5 h-5"
                />
            </div>
            <div class="flex-grow">
                <h3 class="text-gray-600 text-sm font-medium mb-1">
                    {{ title }}
                </h3>
                <p class="text-2xl font-bold text-gray-800">{{ value }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faUsers,
    faBook,
    faShoppingCart,
    faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUsers, faBook, faShoppingCart, faDoorOpen);

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    iconColor: {
        type: String,
        default: "text-blue-500",
    },
});

const getBgColor = computed(() => {
    if (props.iconColor.includes("blue")) return "bg-blue-50";
    if (props.iconColor.includes("green")) return "bg-green-50";
    if (props.iconColor.includes("yellow")) return "bg-yellow-50";
    if (props.iconColor.includes("purple")) return "bg-purple-50";
    return "bg-gray-50";
});
</script>

<style scoped>
.stat-card{border-radius:0;border-top:2px solid #b08d57}.stat-card:hover{transform:translateY(-2px);box-shadow:0 18px 38px rgba(55,46,36,.1)}.stat-icon{border-radius:50%}.stat-card h3{font-family:'Geist',sans-serif;font-size:.6rem;font-weight:650;letter-spacing:.13em;text-transform:uppercase}.stat-card p{font:400 2rem 'GFS Didot',Georgia,serif}
</style>

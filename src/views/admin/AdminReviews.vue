<template>
    <div class="container mx-auto">
        <h2 class="text-2xl font-bold mb-4">Reviews</h2>

        <!-- Table with Pagination -->
        <Table :headers="reviewHeaders" :items="reviews">
            <template #actions="{ item }">
                <select
                    v-model="item.status"
                    @change="updateReview(item)"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                </select>
            </template>
        </Table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Table from "../../components/admin/Table.vue";
import { useUserStore } from "../../stores/user";

const reviews = ref([]);
const userStore = useUserStore();

// Define the table headers
const reviewHeaders = ref([
    { title: "ID", key: "id" },
    { title: "Book", key: "product.title" },
    { title: "Author", key: "user.name" },
    { title: "Comment", key: "comment" },
    { title: "Rating", key: "rating" },
    { title: "Status", key: "status" },
    { title: "Actions", key: "actions" },
]);

onMounted(async () => {
    await fetchReviews();
});

async function fetchReviews() {
    try {
        const response = await axios.get("/reviews");
        reviews.value = response.data;
        console.log(reviews.value);
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

async function updateReview(review) {
    try {
        await axios.put(`/reviews/${review.id}`, {
            status: review.status,
        });
        await fetchReviews();
    } catch (error) {
        console.error("Error updating review:", error);
    }
}
</script>

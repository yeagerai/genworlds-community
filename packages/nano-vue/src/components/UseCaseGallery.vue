<template>
  <div class="p-8 bg-gray-50">
    <h1 class="mb-6 text-4xl font-semibold text-blue-600">Use Case Gallery</h1>
    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="useCase in useCases"
        :key="useCase"
        class="p-4 text-center bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-50"
        @click="navigateToUseCase(useCase)"
      >
        {{ useCase }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "UseCaseGallery",
  data() {
    return {
      useCases: [],
    };
  },
  methods: {
    navigateToUseCase(useCase) {
      this.$router.push({
        name: "UseCaseView",
        params: {
          useCaseTitle: useCase,
          useCaseSlug: useCase.toLowerCase().replace(/ /g, "-"),
        },
      });
    },
  },
  mounted() {
    fetch("http://127.0.0.1:7457/use-case-list")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        this.useCases = data;
      })
      .catch((error) => console.error("There was a problem with the fetch operation:", error));
  },
};
</script>

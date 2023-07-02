<template>
  <div class="navbar">
    <div class="navbar-start">
      <ul class="menu menu-horizontal px-1">
        <li tabindex="0">
          <details>
            <summary>Use Cases</summary>
            <ul class="p-2">
              <li
                v-for="useCase in useCases"
                :key="useCase"
                @click="navigateToUseCase(useCase)"
              ><a>{{ useCase }}</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl">🧬🌍 GenWorlds</a>
    </div>
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
        name: "useCaseView",
        params: {
          useCaseTitle: useCase,
          slug: useCase.toLowerCase().replace(/ /g, "-"),
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

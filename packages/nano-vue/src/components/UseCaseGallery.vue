<template>
  <div class="h-screen flex flex-col">
    <div class="navbar h-32">
      <div class="navbar-start">
        <ul class="menu menu-horizontal px-1">
          <li tabindex="0">
            <div class="inline-block relative w-128">
              <label for="use-case-select" class="block text-sm font-medium mb-2 dark:text-white">Current Use Case:</label>
              <select id="use-case-select" class="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                v-model="currentUseCase" @change="navigateToCurentUseCase">
                <option :value="null" disabled selected>Select a use case</option>
                <option v-for="useCase in useCases" :key="useCase.use_case + useCase.world_definition" :value="useCase">{{ useCase.use_case + "/" + useCase.world_definition }}</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div class="navbar-center">
        <a class="btn btn-ghost normal-case text-xl">🧬🌍 GenWorlds</a>
      </div>
    </div>
    <div class="flex-grow  min-h-0">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "UseCaseGallery",
  data() {
    return {
      useCases: [],
      currentUseCase: this.$route.params.use_case ? {use_case: this.$route.params.use_case, world_definition: this.$route.params.world_definition} : null,
    };
  },
  methods: {
    navigateToCurentUseCase() {
      this.$router.push({
        name: "useCaseView",
        params: {
          use_case: this.currentUseCase.use_case,
          world_definition: this.currentUseCase.world_definition,
        },
      });
    },
  },
  watch: {
    $route(to, ) {
      this.currentUseCase = {
        use_case: to.params.use_case,
        world_definition: to.params.world_definition,
      };
    }
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
        this.useCases = data.toSorted((a, b) => (a.use_case+a.world_definition).localeCompare(b.use_case+b.world_definition));
      })
      .catch((error) => console.error("There was a problem with the fetch operation:", error));
  },
};
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="navbar">
      <div class="navbar-start">
        <!-- <div class="inline-block relative w-128">Current Use Case:</div> -->
        <ul class="menu menu-horizontal px-1">
          <li tabindex="0">
           <select id="use-case-select" class="select select-bordered select-primary w-full max-w-xs"
              v-model="currentUseCase" @change="navigateToCurentUseCase">
              <option :value="null" disabled selected>Select a use case</option>
              <option v-for="useCase in useCases" :key="useCase.use_case + useCase.world_definition" :value="useCase">{{ useCase.use_case + "/" + useCase.world_definition }}</option>
            </select>
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

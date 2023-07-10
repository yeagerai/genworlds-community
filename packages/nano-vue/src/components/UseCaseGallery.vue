<template>
  <div class="h-screen flex flex-col">
    <div class="navbar">
      <div class="navbar-start space-x-4">
       
        <select id="use-case-select" class="select select-sm w-full max-w-xs"
          v-model="currentUseCase" @change="navigateToCurentUseCase">
          <option :value="null" disabled selected>Select a use case</option>
          <option v-for="useCase in useCases" :key="useCase.use_case + useCase.world_definition" :value="useCase">{{ useCase.use_case + "/" + useCase.world_definition }}</option>
        </select>       

      </div>
      

      <div class="navbar-center space-x-4">
        <div class="join">
          <div class="tooltip tooltip-bottom" data-tip="Stop the current use case">
            <button class="btn btn-sm join-item btn-outline btn-error" @click="stopUseCase" :disabled="!currentUseCase">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
          
          <div class="tooltip tooltip-bottom" data-tip="Restart the use case">
            <button class="btn btn-sm join-item btn-outline btn-success" @click="restartUseCase" :disabled="!currentUseCase">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>            
            </button>
          </div>

          <div class="tooltip tooltip-bottom" data-tip="Download the event history json">
            <button class="btn btn-sm join-item btn-outline btn-info" @click="downloadEventHistory" :disabled="!currentUseCase">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>  
      </div>

      <div class="navbar-end">
        <a class="btn btn-ghost normal-case text-xl">🧬🌍 GenWorlds</a>
      </div>
    </div>
    <div class="flex-grow  min-h-0">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUseCaseActionStore } from '@/stores/useCaseActionStore';

export default {
  name: "UseCaseGallery",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const useCases = ref([]);
    const currentUseCase = ref(
      route.params.use_case
        ? {
            use_case: route.params.use_case,
            world_definition: route.params.world_definition,
          }
        : null
    );

    const navigateToCurentUseCase = () => {
      router.push({
        name: "useCaseView",
        params: {
          use_case: currentUseCase.value.use_case,
          world_definition: currentUseCase.value.world_definition,
        },
      });
    };

    const fetchUseCases = async () => {
      const currentUrl = window.location.origin;
      const apiUrl = `${currentUrl}:9000/world-instance/use-case-list`;

      try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        useCases.value = data.sort((a, b) => (a.use_case+a.world_definition).localeCompare(b.use_case+b.world_definition));
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    onMounted(fetchUseCases);

    watch(route, (to) => {
      currentUseCase.value = {
        use_case: to.params.use_case,
        world_definition: to.params.world_definition,
      };
    });

    const useCaseActionsStore = useUseCaseActionStore();
    const stopUseCase = () => {
      useCaseActionsStore.setPerformStopUseCaseAction(true);
    }
    const restartUseCase = () => {
      useCaseActionsStore.setPerformRestartUseCaseAction(true);
    }
    const downloadEventHistory = () => {
      useCaseActionsStore.setPerformDownloadUseCaseEventHistoryAction(true);
    }

    return {
      useCases,
      currentUseCase,
      navigateToCurentUseCase,
      fetchUseCases,
      stopUseCase,
      restartUseCase,
      downloadEventHistory,
    };
  },
};
</script>

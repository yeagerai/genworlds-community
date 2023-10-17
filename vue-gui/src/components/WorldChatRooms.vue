<script setup>
import { onMounted, onBeforeUnmount, computed, } from 'vue';

// stores
import { useScreensStore } from '@/stores/screensStore';
import { useWorldStateStore } from '@/stores/worldStateStore';

//js utils
import  downloadEventHistory from '@/modules/downloadEventHistory';

// components
import SendMessageBox from './SendMessageBox.vue';
import WorldInfo from './WorldInfo.vue';
import ChatRoom from './ChatRoom.vue';
import ChatRoomSelectorVue from './ChatRoomSelector.vue';

const screensStore = useScreensStore();
const screens = computed(() => screensStore.screens);
const screensHaveBeenLoaded = computed(() => screens.value.length !== 0);
const worldStateStore = useWorldStateStore();
const useCaseName = computed(() => worldStateStore.worldName);

onMounted(async () => {
  const _keyListener = function(e) {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();

          downloadEventHistory();
      }
  };

  document.addEventListener('keydown', _keyListener);  

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', _keyListener);
  });
});

</script>

<template>
  <div v-if="!screensHaveBeenLoaded" class="flex-1 mb-4 h-full w-full">
    <!--loading svg-->
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-32 h-32">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  </div>
  <div v-else class="p-4 flex flex-col h-full">
    <h1 class="text-xl mb-4">{{ useCaseName }}</h1>
    <ChatRoomSelectorVue />
    <div class="overflow-y-auto flex-1 mb-4" ref="chatContainer">
      <div v-if="shouldRenderWorldDetails" class="w-full h-full">
        <WorldInfo class="w-full h-full"/>
      </div>
      <div v-else>
        <ChatRoom class="w-full h-full"/>
      </div>
    </div>
    <SendMessageBox/>
  </div>

</template>

<style scoped>
[format*="bold"] {
  font-weight: bold;
}
</style>
